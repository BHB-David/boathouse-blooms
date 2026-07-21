/**
 * BHB noise-filter manager  (Google Apps Script)
 * -------------------------------------------------
 * Creates/rebuilds server-side Gmail filter(s) that label mail from known
 * marketing/transactional senders with `bhb/noise`. The refresh scan then
 * subtracts that label:  to:boathouseblooms@gmail.com after:DATE -label:bhb/noise
 *
 * Replaces the hand-maintained -from:(...) blocklist:
 *   - edit NOISE_SENDERS below, re-run, done (version-control this .gs in the repo)
 *   - runs server-side, on arrival, with nothing open
 *
 * SETUP (one time):
 *   1. script.google.com -> New project. Paste this in.   <-- sign in AS the
 *      Boathouse account (filters are created on whoever authorizes -> 'me').
 *   2. Left sidebar -> Services (+) -> add "Gmail API" (advanced service).
 *   3. Run rebuildNoiseFilter(). Approve the auth prompt (Gmail settings + labels).
 *   4. Confirm in Gmail: Settings -> Filters and Blocked Addresses.
 *
 * RE-RUN to apply edits: run rebuildNoiseFilter() again. Idempotent — it deletes
 * every filter that adds the bhb/noise label, then recreates from the list below.
 * It only touches bhb/noise filters; your other filters are left alone.
 *
 * GOTCHAS:
 *   - Filters act on NEW incoming mail only; they do NOT retro-label existing mail.
 *   - SKIP_INBOX defaults false (label only). Archiving is Susan's inbox call.
 */

// ---- Tokens copied verbatim from the BHB_SKILL.md inbound blocklist. ----
// NOTE: these are MATCH TOKENS, not all clean domains. Most are domains, but a
// few are deliberate substring matches kept exactly as in the scan's -from:(...):
//   noreply / no-reply / mailman / concierge / drhellman  -> match anywhere in From
//   cutflowers@quinlanwasserman                            -> partial address
// Keep them as-is so the filter matches exactly what the blocklist matched.
// Add new noise senders here, then re-run rebuildNoiseFilter().
const NOISE_SENDERS = [
  'honeybook.com', 'noreply', 'no-reply', 'mailman', 'concierge',
  'theknot.com', 'weddingwire.com', 'weddingpro.com', 'linkedin.com',
  'mailchi.mp', 'substack.com', 'shopify.com', 'amazon.com', 'ebay.com',
  'etsy.com', 'mailerlite.com', 'sendgrid.net', 'constantcontact.com',
  'campaign-archive.com', 'list-manage.com', 'mailjet.com', 'salesforce.com',
  'landsend.com', 'michaels.com', 'wayfair.com', 'boden.com', 'juliaamory.com',
  'chasingpaper.com', 'ashabyadm.com', 'shoppeamberinteriors.com',
  'sweetbeeorganics.com', 'tnuck.com', 'vrbo.com', 'homedepot.com',
  'northandfinch.com', 'e-notification.net', 'tiktok.com',
  'floweringminds.education', 'acegolfs.com', 'herrenproject.org', 'bombas.com',
  'chappywrap.com', 'karenadamsdesigns.com', 'paperlondon.com', 'aritzia.com',
  'mrsalice.com', 'hotelviking.com', 'faire.com', 'joinmidi.com',
  'onepeloton.com', 'canva.com', 'goodshuffle-mail.com', 'picta.com',
  'pila-barre.com', 'realflowerbusiness.com', 'ccsend.com',
  'sent-via.netsuite.com', 'dvflora.com', 'thefloralreserve.com', 'mg.wgbh.org',
  'om.e.wgbh.org', 'drhellman', 'cutflowers@quinlanwasserman', 'yummicandles.com',
  'petite-plume.com', 'campaigns.pic-time.com', 'michaelscustomframing.com',
  'duffieldlane.com', 'stylemepretty.com', 'hafsaandco.com', 'cavicchio.com',
  'thefloralsociety.com', 'eq.intuit.com', 'notifications.intuit.com',
  'mapfreinsurance.com', 'fedex.com', 'yotpo.com', 'g.shopifyemail.com',
  'shootproof.com', 'thereformation.com', 'opentable.com', 'mayarts.com',
  'saracampbell.com', 'notices.intuit.com', 'feedback.mapfre.com', 'm.wgbh.org'
];

const LABEL_NAME = 'bhb/noise';

// ---- LEAD-CHANNEL EXEMPTIONS (never label, regardless of token matches) ----
// Added Jul 21 2026 (Refresh #69 regression fix). Two NOISE_SENDERS tokens were
// swallowing real leads:
//   'theknot.com'               also matched  *.member.theknot.com  (Knot Pro
//                               Network lead messages — 5 mislabeled leads)
//   'honeybook.com' + 'mailman' both matched  mailman@honeybook.com (HoneyBook
//                               New Inquiry notifications — Eve Loftus Jul 21)
// Rather than narrowing the tokens (theknot/honeybook marketing mail should
// stay labeled), every filter chunk appends -from: negations for these senders.
// A sender listed here can NEVER be labeled bhb/noise, no matter what token
// matches it. Add future lead channels here, then re-run rebuildNoiseFilter().
const DO_NOT_LABEL = [
  'member.theknot.com',      // Knot Pro Network lead messages
  'mailman@honeybook.com'    // HB New Inquiry + payment/contract confirmations
];

// false = label only, mail stays in Inbox (the scan only needs the label).
// true  = also skip the Inbox (archive on arrival). Susan's inbox call, NOT a
//         scan requirement. Leave false unless she asks.
const SKIP_INBOX = false;

// Senders per filter. The full list is long; Gmail can reject an over-long
// single query, so split into chunks, each its own filter adding the SAME label.
const CHUNK_SIZE = 40;


function rebuildNoiseFilter() {
  const labelId = ensureLabel_(LABEL_NAME);

  // Idempotency: drop ALL existing filters that add our label, so re-running
  // after editing NOISE_SENDERS rebuilds cleanly (no duplicates, handles chunks).
  const listResp = Gmail.Users.Settings.Filters.list('me');   // null when no filters exist
  const existing = (listResp && listResp.filter) || [];
  existing.forEach(function (f) {
    const adds = (f.action && f.action.addLabelIds) || [];
    if (adds.indexOf(labelId) !== -1) {
      Gmail.Users.Settings.Filters.remove('me', f.id);
      Logger.log('Removed old filter ' + f.id);
    }
  });

  if (!NOISE_SENDERS.length) {
    Logger.log('NOISE_SENDERS is empty — nothing to create.');
    return;
  }

  const action = { addLabelIds: [labelId] };
  if (SKIP_INBOX) action.removeLabelIds = ['INBOX'];

  let made = 0;
  for (let i = 0; i < NOISE_SENDERS.length; i += CHUNK_SIZE) {
    const chunk = NOISE_SENDERS.slice(i, i + CHUNK_SIZE);
    const exempt = DO_NOT_LABEL.map(function (s) { return ' -from:' + s; }).join('');
    const query = 'from:(' + chunk.join(' OR ') + ')' + exempt;  // same matching as -from:(...), minus lead channels
    const created = Gmail.Users.Settings.Filters.create(
      { criteria: { query: query }, action: action }, 'me'
    );
    made++;
    Logger.log('Created filter ' + created.id + ' (' + chunk.length + ' senders)');
  }
  Logger.log('Done: ' + made + ' filter(s) for ' + NOISE_SENDERS.length +
             ' senders. SKIP_INBOX=' + SKIP_INBOX);
}


function ensureLabel_(name) {
  const labelResp = Gmail.Users.Labels.list('me');
  const labels = (labelResp && labelResp.labels) || [];
  const found = labels.filter(function (l) { return l.name === name; })[0];
  if (found) return found.id;
  const created = Gmail.Users.Labels.create(
    { name: name, labelListVisibility: 'labelShow', messageListVisibility: 'show' },
    'me'
  );
  Logger.log('Created label ' + name + ' (' + created.id + ')');
  return created.id;
}
