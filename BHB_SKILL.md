---
name: bhb-refresh
description: "Use this skill whenever the user says 'refresh', 'run a refresh', or asks to update the Boathouse Blooms proposal reconciliation app. Contains the complete protocol for scanning Gmail (outbound + inbound), Google Calendar (bidirectional diff), and Zapier [HB Update] emails. Scan window is bounded by SCAN_AFTER = today − max(days_since_last_refresh, 14) with maxResults tiered by window size. The app mirrors HoneyBook — entries archived in HB are auto-detected via reverse calendar diff and moved to HB_ARCHIVED. Also carries forward the pending-items state so Claude orients instantly and runs targeted thread reads on each pending item before the broad scans."
compatibility: "claude.ai Projects with Gmail MCP and Google Calendar MCP connected"
---

# Boathouse Blooms — Refresh Skill

## What this app is

A password-protected static HTML app (`index.html` on GitHub Pages) that **mirrors** HoneyBook's state for Susan & David Hellman's floral business. The HB calendar is the source of truth; the app reflects it.

Five arrays drive the view:

- **HB Pipeline** — active HB projects (stage-tracked)
- **Gmail Only** — proposal/invoice clients with no HB project yet, *or* repeat/corporate clients that never move to HB (terminal state, not transitional)
- **Cal Only** — HB calendar Inquiry entries with no pipeline project
- **HB Archived** — entries HoneyBook has archived (detected by absence from the live calendar); hidden from default views, revealed by clicking the **📦 HB Archived** filter button
- **(Completed pipeline entries)** — subset of HB Pipeline with `stage:"Completed"`; hidden from default views, revealed by clicking the **Completed** stage button under HoneyBook

The **🗓️ No Cal** filter button is a cross-cutting view (not a fifth array): it shows every HB Pipeline or Gmail Only client with no calendar entry — i.e. whose name is not a key in `CAL_LINKS`. Each No Cal card carries a **+ Add to Calendar** button (a Google Calendar deep link; see "No Cal filter" under Patterns).

Single `index.html` file. All data is hardcoded JS arrays. No server, no build step.

---

## Current state

| Item | Value |
|---|---|
| Last refresh | #71 — July 23, 2026, 5:25 AM ET (first autonomous scheduled Cowork run) |
| Last refresh date | `2026-07-23` (use for SCAN_AFTER computation — see Step 1) |
| Last feature change | Year Buttons — Jul 19, 2026 (CSS only); Global Search — Jul 17, 2026 (UI + render only) |
| Counts | HB Pipeline: 46 · Gmail Only: 28 · Cal Only: 36 · HB Archived: 32 |
| Narratives | 63 |
| No Cal | 28 (14 HB Pipeline + 14 Gmail Only — Payton Donato added #69) |
| Scan cutoff (#71) | SCAN_AFTER `2026/07/09` (1-day gap, 14-day floor); inbound paginated to Jul 20 overlapping #70. Zapier 8/25 · Outbound 23/30 · no binds |

**Numbering note (#69):** Refreshes #67 (Jul 17 — Courtney Cronin promoted, Sidney Smith decline) and #68 (Jul 19 — quiet) were committed in other sessions, but the project-knowledge copy of this skill stayed at #66 — the skill-runs-BEHIND-file variant. #69 ran in Cowork against the committed #68 base read from the local git clone (`~/Desktop/github-boathouse`) after GitHub became unreachable from the sandbox (see #69 learnings). File-wins rule applied; David confirmed "current state is refresh 68" mid-run.

**Pending items** (check at next refresh).

Split into two tiers. **Active** = something specific is expected to happen next refresh; gets Step 1a cluster coverage. **Watchlist** = tracked for memory only; rechecked when broad scans surface activity, not searched per refresh.

### Active (Step 1a covers these)

- **Jesha Stevens** (`partnerships@jeshastevens.com`, 7/18/26 Wellfleet) — ⚠ **WEDDING DATE PASSED with ZERO contact ever** — still nothing either way at #71 (5 days post-wedding). **Phone contact is the standing recommendation**; outcome unknown.
- **Shelby and Timothy** (`sem273@gmail.com` + `shelby.richards@verizon.net`, Planning, PAID IN FULL, **7/24/26 John Carver Inn — TOMORROW at #71**) — expect past-event auto-complete at #72. Susan offered boutonnière + flat-lay drop-off to the venue.
- **Grace Cioffi** (`quinnwedding2028@gmail.com`, 518-495-7575, Cal Only NEW #71, **6/19/27 Wychmere Beach Club, Harwich Port**; HB `6a610dfe35aea342b75ec9ce`) — vendor referral, Webster NY address, beach ceremony + Ocean Room reception, Pinterest shared, wants a quote. ⚠ **6/19/27 DATE CLUSTER** with Emily Mauck (HB inquiry, The Bohlin) + Ava Kahn-McQueen (Knot lead); HB flagged the conflict. Susan has not replied (inquiry Jul 22 2:37 PM). Watch: reply / call.
- **Krista Fullum / Margaret Grace** (`kristafullum@yahoo.com`, Gmail Only, 10/17/26 — **Watchlist → Active #71**) — Jul 22 personal inbound: can she still use Susan's space the week of her wedding (same week as Susan's daughter's wedding)? Fallback: the market + parents' house. Logistics ask, awaiting Susan's reply.
- **Eve Loftus** (`eelloftus@gmail.com`, 508-404-5915, Cal Only, **6/30/28 Chatham Bars Inn**, ~150 guests, via Instagram; HB `6a5f7532007aefeeb1df3351`) — **Susan REPLIED Jul 22** (date available, offered a call to discuss her vision). Awaiting Eve's response. Watch: call scheduling.
- **Payton Donato** (`paytondonato98@gmail.com`, Gmail Only NEW #69, 9/18/27 Eastward Ho! Chatham) — preliminary proposal sent Jul 20 (call held ~Jun 29). Watch: feedback / deposit.
- **Samantha Barmore** (`sbarmore26@gmail.com`, Retainer Paid, 8/20/27 Wychmere) — Jul 20 revision loop: client wants orchids in bouquet, no blue delphinium, blush-hydrangea garland clarification (Susan said "I will clarify"). No movement since Jul 20 at #71. Watch: Susan's clarified outline.
- **Elizabeth Hagele & Ben** (couple `elizabethandben26@gmail.com`; planner `eileen@eileensmithevents.com`, 8/8/27 Lion Rock Farm) — **PROPOSAL FINAL #71**: Jul 22 outline approved; Elizabeth formally introduced Susan to Eileen with the final proposal; final floor plan in; **credit-card payment authorized for this week**. Eileen's Zoom review call **Thu 7/23 5:00 PM ET**. Watch at #72: call outcome + payment received.
- **Julia Stell** (`juliaastell4@gmail.com`, Proposal Sent, 9/26/26 Hyannis) — **OWED-REPLY RESOLVED #71**: Susan replied Jul 10 (same day as Julia's circle-back; missed by keyword-filtered scans #66-#70) — could not open the photos, asked for a re-send. Awaiting Julia's re-sent photos (~2 weeks). Jun 19 Trash email still unrestored (restore still useful for the change details).
- **Abby Greene & Alex Perry** (`almanoukian@aol.com`; personal `aegreene34@gmail.com`) — ⚠ contract stall **~67 days**; only vendor-on-chain activity (Soulyco Jul 14). **David: ask Susan whether the engagement is reduced or lost.**
- **Courtney Cronin** (`courtneycronin2017@gmail.com`, Proposal Sent #67, 6/26/27; HB `6a4564723d687cf5e3d7c302`) — proposal delivered via HoneyBook Jul 13; **no client response yet (10 days at #71)**. Watch: acceptance / deposit; nudge-worthy at ~2 weeks.
- **Andrew Sulkala** (`rutleysulkalawedding@gmail.com`, Cal Only, **8/22/26 — ~4.5 weeks out**; HB `6a4e7f690bbbf2ccb067a1db`) — still no reply to Susan's Jul 9 details ask. Near-term urgency rising; partner Catie Rutley's Knot lead was noise-labeled.
- **Jan Koss & Kenzie** (`jankoss@comcast.net`, 11/14/26 Granite Links) — back from Scotland Jul 16; no contact since. Watch: deposit / next step.
- **Sarah Clark** (`saraheclark21@gmail.com`, 9/10/27 Wychmere) — Susan replied Jul 7 offering a call; no response in 2 weeks. Watch: call / proposal.
- **Emily Cullett** (`emcullett@gmail.com`, Cal Only, 7/30/27 Ocean Edge) — call held Jul 3; proposal pending.
- **Mackenzie Howe** (`kenziehow3@gmail.com`, Cal Only, 6/11/27 Granite Links) — call held ~Jul 1; proposal pending.
- **Nicole & Joe Moreshead** (`weddingmoreshead@gmail.com`, Gmail Only, 12/11/26 Terrain Gardens) — MOVING FORWARD. Jul 22: Susan proposed a call/visit for the numbers; **Nicole requested Susan's COI (venue requires vendor COIs)** — Susan flagged "need COI" to David. Watch: COI sent + call/visit + updated proposal + $500 deposit.
- **Jean Soucy** (`jkpjsoucy@yahoo.com`, Gmail Only, 9/18/26 The Old Casino) — $250 deposit pending since May 14 acceptance.
- **Pauline & Dwaine** (`pleblanc14@gmail.com`, Gmail Only, 9/26/26 Peabody Pavilion) — table confirmation / deposit / HB project pending.
- **Jack & Paige Soucy** (`jackpaigesoucy@gmail.com`, Retainer Paid, 10/3/26) — check-in call **Mon Aug 17, 12pm** (Google Meet, planner Olivia Brent) — self-closing.
- **Kasey Lombardo** — Susan reply STILL pending (~76 days since May 6 HB inquiry; Hull MA, 9/11/26). *(Cal Only — search by name.)*
- **Knot pre-engagement (all bhb/noise-labeled — regression instances #1-5):** **Lauren Flynn** (Jul 13 lead, **8/21/26 — near-term**, Susan unengaged), **Ava Kahn-McQueen** (Jul 16 lead, 6/19/27 — now shares the date with Grace Cioffi's live HB inquiry), **Madison Kadra** (Jul 20 lead — church + backyard-tent reception, Cohasset MA, date TBD). Single batched search per refresh.

**David to-do (out-of-band, as of #71):** (1) **Archive in HoneyBook** the **10** declined projects still on the HB calendar — Tisha Alie, Olivia Powers, Jessica Sorcher, Kathryn Wickham, Sarah Dwyer, Grace Hickey, Julia Wholey, Sidney Smith, Emma Izydorczak & Mitchell McDonald, **Nicole Zarembovicz (new #71)** — they re-surface in every forward diff until archived. (2) **Noise-filter fix HALF-VERIFIED at #71**: Grace Cioffi's `mailman@honeybook.com` New Inquiry (Jul 22 2:37 PM, first lead-channel arrival after the Jul 22 AM rebuild) landed **WITHOUT** `Label_4` — honeybook channel confirmed clean. `member.theknot.com` still unverified (no new Knot lead since the rebuild); client-side exemption check on that channel stays MANDATORY until one arrives clean. (3) **Restore Julia Stell's Jun 19 email from Gmail Trash** (softened: Susan has since engaged — Jul 10 reply found #71 — but the Trash email holds the change details). (4) Ask Susan: Abby Greene reduced vs lost (~68 days). (5) **Phone Jesha Stevens** for the 7/18 outcome. (6) **Send Susan's COI to the Moreshead venue** (Susan forwarded "need COI" Jul 22). (7) Noise senders still unlabeled (advisory): `DoNotReply@dvfloralgroup.com` (3rd consecutive advisory), `info@stradleydavidson.com`, `email@letschat.oliveandpiper.com`, `info@oliveandpiper.com`, `newsletter@pvolve.com`, `Intuit@mkt.intuit.com` (distinct from the labeled intuit senders). Caution: leave `paycargo.com` senders unblocked — operational freight/import mail. (8) **Revert the scheduled-task gate** from the 12-hour TEST setting to 4 calendar days — the first autonomous run (#71) succeeded.

### Watchlist (not searched per refresh; recheck monthly or when broad scan surfaces)

- **Caitlin Ferreira / Ryan Stefens** (`caitlinstefens@gmail.com`) — wedding EXECUTED 7/10 The Lakehouse; auto-promoted → Completed #66 (Zapier → Planning Jul 8 superseded). Terminal.
- **Lindsey DeRensis**, **Meaghan and Matthew**, **Joanne Doherty**, **Joe & James Carrara**, **Kate Dwyer**, **Alicia Herlihy** — executed/terminal (see #64-#65 notes).
- **Alexa Paiva** (`alexa.j.paiva@gmail.com`, Planning, paid in full, 10/17/26) — healthy.
- **Sasha Rockwell** (`sashavrockwell@gmail.com`, Follow-up, 3/20/27) — silent since May 31.
- **Kellie Cronin** — healthy (deposit Jun 29, green hydrangeas). Sister Courtney inbound.
- **Elizabeth Hagele & Ben McQuaid** (couple `elizabethandben26@gmail.com`; planner `eileen@eileensmithevents.com`, 8/8/27 Lion Rock Farm) — preliminary proposal Jun 29, above budget, Susan adjusting. Watch: revised proposal / acceptance.
- **Alyssa Greenspan** — Knot lead Jun 23-24, noise-labeled; not yet engaged by Susan. Recheck.
- **MGB corporate order** — vendor packet Jun 26 (`mramos8@mgb.org`), forwarded to David Jun 29. Watch: actual order.
- **Sabine Leder** — Susan's Jun 30 re-send to `sabine.leder@tuftsmedicalcenter.org` BOUNCED again. David/Susan: correct address.
- **Katie Escano** (`fridaywedding26@gmail.com`, 6/13/26 passed) — outcome unconfirmed; **David confirm.**
- **Cindy & Amanda Chase** (`cindychase44@gmail.com`, 6/6/26 passed) — outcome unknown; **David confirm executed vs lapsed.**
- **Molly & Mike** (`mikeandmolly2026@gmail.com`, 8/15/26 State Room) — planning call expected.
- **Jen Gray** terminal (`eventDate` 5/24/26 approximate — David confirm); **Erin Goldberg / Union Club** routine; **Mary (Rehearsal)** dropped; **Tessa Bednarz** nudge-worthy (~80 days silent); **Laura McNulty / Bryant**, **Danielle Tata / PMC** terminal corporate; **Winnie Guo** gcal link still missing (since #51).
- Pemmy Friedman, Emily Smith, Caroline Blank, Allinson Brinkhaus, Emma Velozo, Nicole Austin, Mairead Hoye — Knot pre-engagement watchlist (single batched search only on broad-scan activity).
- **Emily Mauck** — app-archived; awaiting HB-side archive. New Emily Mauck HB inquiry (6/19/27 The Bohlin) already tracked.
- **Allison Mazer** (`amazer22@gmail.com`) — ⚠ Question for David: terminal-state GMAIL_ONLY?
- **Caroline & Gerry Barrett** — executed 5/16; ⚠ David to verify retroactive HB project.
- **⚠ Jilly & Billy** (`ebrunelle13@gmail.com`) — untracked repeat-family client, paid outside HB. **David: confirm/backfill.**
- **Samantha Sieger** — CAL_ONLY past-date (5/23/26); re-surfaced again #66 as known no-op. David: archive in HB or confirm completed-untracked.
- **Samantha Zaino** (`sdmarks7525@gmail.com`) — cross-array duplicate (GMAIL_ONLY + CAL_ONLY, 5/22/27 Wychmere). Canonical-array decision still needed from David.

### Promotion rules

- **Active → Watchlist** when a 2-week period passes with no movement and no specific action expected next refresh.
- **Watchlist → Active** when a broad scan surfaces fresh activity, or a calendar event puts something on a near-horizon.
- **Drop entirely** when a scheduled-action date has passed without follow-up and no further action is expected.

*Resolved this refresh (#71): Nicole Zarembovicz (Susan declined Jul 22 — Regretfully Unavailable; removed from Cal Only; Zapier Follow-up masked it, instance #11); Julia Stell owed-reply (Susan's Jul 10 reply found); Eve Loftus awaiting-Susan (replied Jul 22); Hagele finalize-by-Friday (final proposal delivered Jul 22). New this refresh (#71): Grace Cioffi (Cal Only, 6/19/27 date cluster); Moreshead COI request; Krista Fullum space-use ask (Watchlist → Active).*

*Resolved at refresh (#70): Moreshead details wait (beam dimensions in — now Susan owes the proposal). New at refresh (#70): Nicole Zarembovicz (Cal Only, 4-way 6/26/27 collision); noise-filter rebuild completed Jul 22 AM — both Jul 21 labeled inquiries predate it.*

*Resolved at refresh (#69): Samantha Barmore owed reply (visit held Jul 16); Elizabeth Hagele scheduling (Thu 7/23 planner call proposed). New this refresh (#69): Eve Loftus (Cal Only), Payton Donato (Gmail Only), Emma Izydorczak & Mitchell McDonald decline #10, Madison Kadra Knot lead (regression #5), mailman@honeybook.com noise-labeling variant.*

*Resolved at refresh (#66): Shelby final payment (PAID IN FULL Jul 9 → Planning); Caitlin Ferreira wedding executed 7/10 (→ Completed); Jan Koss silence (Jul 8 reply, proposal accepted verbally — Watchlist demotion cancelled); Tisha Alie forward-diff hit (known double-decline, skip).*

*New this refresh (#66): two new CAL_ONLY — Andrew Sulkala (8/22/26, near-term; partner Catie Rutley) and Sidney Smith (9/25/27). New flags: Julia Stell change-request email in Gmail TRASH + owed reply; Meghan Kean lead (6/26/27 — date collision with Courtney Cronin AND Nicole Carroll); Lauren Flynn Knot lead (8/21/26, noise-labeled); Barmore escalation (11-day owed reply). Persistent flags carried: Abby Greene (~59d), Jilly & Billy, Samantha Sieger, Samantha Zaino, Caroline Barrett, Cindy & Amanda Chase, Katie Escano.*

*New this refresh (#64): one new GMAIL_ONLY entry — Pauline & Dwaine (Peabody Pavilion, date TBD). Three Zapier "Follow-up" stages identified as Susan DECLINES (Jessica Sorcher, Kathryn Wickham, Sarah Dwyer) — Kathryn + Sarah removed from Cal Only, Jessica not added. New flag: Jilly & Billy untracked completed wedding (David confirm).*

*⚠ Numbering correction (#61): the prior skill copy described a Refresh #61 (incl. a Mary Finneran / Jean Soucy duplicate-cleanup pass) that was never committed to the live `index.html`. The actual May 26 run — recorded here as #61 — was executed against the #60 + No Cal base and added only one new entry (Krista Fullum / Margaret Grace). No duplicate cleanup occurred this run; the #61 duplicate scan found only the two known pre-existing items (mollymm10 shared email, Samantha Zaino cross-array). The duplicate-detection learning below still stands as a general rule.*

*⚠ Flagged for David (#61): (1) Samantha Sieger — CAL_ONLY entry with a now-past date (5/23/26) surfaced again by reverse diff; per Step 1.5 the past-date CAL_ONLY branch is "flag for review" — confirm archive vs completed-untracked. Carried from #60, still unresolved. (2) Samantha Zaino — pre-existing cross-array duplicate: appears in both GMAIL_ONLY (hbCal:true) and CAL_ONLY (added #59); decide which array is canonical. Carried from #60. (3) Abby Greene contract resend — now 11 days stalled, signature-empty failure mode unresolved. (4) Molly Murphy & Molly & Mike — both in HB_PIPELINE, sharing email `mollymm10@gmail.com`. Surfaced by the new Step 4 email-duplicate scan. They look like two distinct weddings (Molly Murphy: Completed, 4/4/26; Molly & Mike: Retainer Paid, State Room Boston 8/15/26) — likely the same client booking two events, but confirm they should both stand. Pre-existing (present since at least #60), not introduced this refresh.*

*Scheduled-call/visit items auto-close: at the refresh after the scheduled date, confirm outcome via Gmail thread or drop the pending flag.*

### Pre-existing link-map cleanup (informational, not blocking)

The Step 4 link-map check surfaces stale entries that pre-date Refresh #50. Not introduced by current edits, but worth a future cleanup pass. Verified at #60:
- Stale `CAL_LINKS` (6): Brittany Naples, Christina Maheras, Christine Cocce, Dan Varrichio, Molly Doherty, Nicole Carroll — also stale in `HB_LINKS` for Cara Goudy, Molly Murphy, Jamie Menn (Completed past-event entries flagged by reverse-diff).
- Stale `CAL_ONLY_GCAL_LINKS` (10): Brianna Consigli, Elizabeth Callaghan, Emily Feil, John & Jillian, Julia Carr, Katelyn E Flaherty, Kelly Spain, Lucy Yu, Nicole Derosier, Sydney Dazzo.
- Stale `GMAIL_THREADS`: Christina Maheras, Meaghan Keefe (2).
- `cal_no_gcal`: Winnie Guo (1) — known, no gcal link.

These are orphans from past Cal Only → Pipeline promotions or archivals where the link-map cleanup was missed. They don't break the UI but accumulate cruft. Counts unchanged across #60→#61 (no new orphans introduced; the three new GMAIL_ONLY entries this refresh have no calendar entry, so they correctly appear under the No Cal filter rather than in any link map).

- **Manual-calendar reconciliation added (Step 1b sub-scan E + `MANUAL_CAL`).** The No Cal filter only cleared when a HoneyBook event populated `CAL_LINKS`; manually-added calendar events (which HoneyBook cannot create, and which David/Susan add for Gmail Only clients) never reached `CAL_LINKS`, so those clients stayed in No Cal indefinitely. Sub-scan E matches manual events to No Cal entries by email / couple names / date — unambiguous matches auto-migrate the link into `CAL_LINKS`, fuzzy ones flag for David. Key subtlety: a manual event's **title is usually the email author or couple's names, not the app entry name** (e.g. an "Amanda and Emmett" event belongs to the `Cindy & Amanda Chase` entry), so name-only matching fails — email-in-description is the strongest signal. The `MANUAL_CAL` set keeps these names out of the reverse-diff archival logic, since a manual event's ID is not a HoneyBook project ID. **Corrected #61: manual events live on the account's PRIMARY calendar ("Susan Hellman"), NOT the HoneyBook secondary calendar — sub-scan E must scan the primary calendar to find them. See the #61 learning below.**

### Cross-client Gmail link duplication bug (found + fixed June 16, 2026, out-of-band)

David flagged that Lindsey DeRensis's Gmail link was wrong. Investigation: `GMAIL_LINKS["Lindsey DeRensis"]` held thread ID `197126ebd34d323f` — which on inspection actually belongs to **Caitlin Ferreira** (verified via `Gmail:search_threads` against Caitlin's email; subject "Boathouse Blooms Wedding Floral," May 2025). The #63 (or earlier) edit pass appears to have copy-pasted an adjacent entry's thread ID rather than Lindsey's own. Caitlin's own `GMAIL_LINKS` entry was unaffected and correct — this was a one-directional duplication onto Lindsey, not a swap.

Fix applied: searched `to:lindseyaderensis@gmail.com OR from:...` directly, confirmed her real thread history, and set her link to the most recent live thread (`19ed12a4a8abc388` — "Final updates to invoice and payment link," Jun 16, 2026, the active invoice/payment exchange 4 days before her wedding). Caitlin Ferreira's entry left untouched.

**Process learning:** when applying string edits to `GMAIL_LINKS`/`HB_LINKS`/`CAL_LINKS` objects, a thread/event ID adjacency bug (wrong line's value copied into the wrong key) won't be caught by uniqueness-assertion `str_replace` alone, since the resulting string is still syntactically valid and unique-per-line — it just points at someone else's data. **Add a verification step:** after any batch of link-map edits, regex-extract `(name, id)` pairs per link map and group by ID to find any ID shared across two different client names, then spot-check against Gmail/HoneyBook/Calendar directly before declaring the refresh complete. This complements the existing email-is-identity-key rule but targets the link maps specifically, not the client arrays.

A full post-fix scan of all three link maps (June 16) found exactly one other duplicate ID, and it is benign, not a second instance of this bug: `GMAIL_LINKS["Meaghan Keefe"]` and `GMAIL_LINKS["Meaghan and Matthew"]` share thread `19b9a9857b96b53f` — this is the same client under a legacy key (the "Meaghan Keefe" project was archived/renamed to "Meaghan and Matthew" at Refresh #16; see changelog) and is already tracked under *Pre-existing link-map cleanup* as a stale orphan. No action needed beyond the existing cleanup backlog item. `HB_LINKS`/`CAL_LINKS` had no cross-client duplicates.

### Noise filtering moved to a Gmail server-side filter (June 3, 2026)

The inbound `-from:(...)` blocklist was retired in favour of server-side Gmail
filter(s) that label known noise senders `bhb/noise` on arrival; the inbound scan
now subtracts `-label:bhb/noise` (Step 1b/C). **Why:** the inline blocklist had to
be appended-and-recopied into the query every refresh (the #62 dual-copy drift
risk), and inbound binds were mostly blocklist-coverage artifacts, not real signal
(#62). A server-side filter makes filtering always-on, server-side, and consistent
across all of Susan's devices, and removes the per-refresh maintenance.

It keeps **denylist (fail-safe) semantics**: only explicitly-named senders are ever
excluded, so a real lead from a new address can never be silently dropped. The
Gmail **Promotions category** was considered as a zero-maintenance alternative and
**rejected** — it is an ML classifier (fail-unsafe: it can misfile a real inquiry
into Promotions/Updates, which `-category:` would then silently drop), and it only
catches marketing mail, missing the transactional noise (HoneyBook, Intuit, FedEx)
that is a large part of the list.

- Mechanism + how to add senders: see *Inbound noise filtering — Gmail `bhb/noise` filter*.
- Canonical list: `NOISE_SENDERS` in `bhb_noise_filter.gs` (Apps Script "BHB noise filter" + repo copy). 86 tokens / 3 filters at migration.
- The refresh stays **read-only against Gmail** — it never creates or edits filters; slipped senders are surfaced as advisory output (Step 1b/C) for David to apply out of band.

### New learnings from Refresh #71

- **#71 was the first successful autonomous scheduled run** (Cowork safety-net task, no user present): folder access, gate check (CHANGELOG date+time vs 12-hour test gate), full protocol, and clone write-back all worked. The TEST gate should now revert to 4 calendar days.
- **Keyword-filtered outbound scans can miss same-thread Susan replies for multiple refreshes.** Susan's Jul 10 reply to Julia Stell sat undetected through #66-#70 because it matched none of the outbound keywords (proposal/pricing/floral/flowers/invoice) — the owed-reply flag kept escalating against a reply that existed. The #71 keyword-free Step 1a cluster read surfaced it instantly. **Rule (extends the #69 offline-resolution learning): before escalating any owed-reply flag, run a keyword-free `to:X OR from:X` thread read for that client.**
- **Noise-filter verification is per-channel.** The Jul 22 rebuild was verified clean on `mailman@honeybook.com` (Grace Cioffi #71) but `member.theknot.com` remains unverified until a post-rebuild Knot lead arrives. Track each lead channel separately.
- **Outbound small-tier 30 held again (23/30, no bind)** — third consecutive comfortable run (#67 16/30, #69 21/30, #71 23/30). Baseline stable.

### New learnings from Refreshes #67-#69

- **#67:** Courtney Cronin promoted Cal Only → Proposal Sent (call held as scheduled); Sidney Smith Zapier-Follow-up-masks-decline pattern #8; Julia Wholey pattern #9; Meghan Kean available-then-calendar-mixup decline resolved the 6/26/27 triple-collision; Amanda Donohue direct-email decline (no Zapier); Leigh A Keefe post-hoc invoice artifact on Meaghan & Matthew (Doherty pattern).
- **#68:** quiet 2-day refresh, zero array changes — the protocol handles short gaps cheaply. Kellie Cronin tasting + fire-marshal open-flame issue (LED alternatives offered; floor plan pending from planner Michael Boivon).
- **#69 — the noise filter is now mislabeling BOTH lead channels.** `member.theknot.com` (instances #1-5) and now `mailman@honeybook.com` New Inquiry notifications (Eve Loftus Jul 21, Emma Izydorczak Jul 20) arrive carrying `Label_4`. The client-side drop must exempt both senders, and every inbound scan must eyeball Label_4-carrying mail from these two domains. Without that manual check, Eve Loftus (a real 2028 Chatham Bars Inn lead) would have been silently dropped — exactly the fail-loud scenario the denylist design exists to prevent.
- **#69 — owed-reply stalls can resolve offline.** Barmore's Jul 2 "another day?" ask was never answered by email, but the visit happened anyway on the originally-offered Jul 16 date. Before escalating an owed-reply flag, check outbound mail for held-meeting evidence ("so nice to visit with you Thursday") — phone/text scheduling is invisible to Gmail.
- **#69 — Cowork base-file access changed.** `raw.githubusercontent.com`, `api.github.com`, and CDN mirrors are blocked by the sandbox proxy (403), `web_fetch` truncates large files (~88KB), and GitHub HTML pages render empty (client-side JS). The reliable path: **request folder access to `~/Desktop/github-boathouse`** and read/write the clone directly — Claude places the updated `index.html` straight into the working tree, reducing the deploy to `git add/commit/push`. Codify as the standard Cowork opening move.
- **#70 — sandbox git leaves undeletable locks on the mounted clone.** Running `git status`/`git log` from the Cowork sandbox against `~/Desktop/github-boathouse` can create `.git/index.lock` that the sandbox cannot unlink (mount permissions) — David's next commit then fails with 'index.lock: File exists' and he must `rm ~/Desktop/github-boathouse/.git/index.lock` manually. Rule: from the sandbox use **`git --no-optional-locks log/status`** (or read files directly) and never run index-writing git commands; commits/pushes are David's, on the host.
- **#69 — skill-runs-BEHIND-file (3 refreshes).** The project-knowledge skill was stale at #66 while the repo was at #68. `git log --oneline -5` on the mounted clone is the fastest Step 0 truth check.

### New learnings from Refresh #66

- **Post-edit metadata check must enumerate every counts location.** The #65 commit updated the stats strip and changelog but left the version-comment counts line at #64 values (31/26/…/60) — caught at #66 Step 0 when `grep -m1 'Cal Only:'` disagreed with the actual arrays. Rule: Step 4 must diff BOTH the version comment and the stats strip against bracket-balanced array counts before declaring done.
- **Known-decline HB projects persist on the calendar and re-surface in every forward diff until Susan archives them.** #66's forward diff was 8 wide but only 2 were real (Sulkala, Smith); the other 6 were Susan declines from #63-#65 (Tisha Alie, Powers, Sorcher, Wickham, Dwyer, Hickey). Keep a known-decline skip list in the pending items and surface an "archive these in HB" to-do for David rather than re-investigating each run.
- **Client mail can sit in Gmail TRASH and still matter.** Julia Stell's Jun 19 change-request (in-window activity on a Proposal Sent pipeline client) carried `TRASH` — visible only because `to:X OR from:X` searches include trash-adjacent results in thread history. When a client message shows label TRASH, treat it as a likely accidental deletion and flag for restore; Susan probably never saw it.
- **Noise-filter regression is CONFIRMED ONGOING** — two more `member.theknot.com` leads labeled `bhb/noise` in this window (Catie Rutley Jul 8 — who then became the Andrew Sulkala HB project; Lauren Flynn Jul 13, an 8/21/26 near-term lead Susan hasn't seen). The client-side Label_4 drop MUST exempt `member.theknot.com`. David: audit `NOISE_SENDERS` urgently.
- **Outbound small-tier step-down TRIGGERED: 35 → 30 effective #67.** #66 was the awaited sub-15-day data point and ran 20/35 — well under cap. Apply 30 next small-tier run; the doubled re-run remains the safety net.
- **Knot lead → HB project correlation.** A Knot lead (Catie Rutley, 8/22/26) and a same-window HB inquiry under the partner's name (Andrew Sulkala, 8/22/26) are one couple — match Knot leads against new HB inquiries by wedding date before treating them as two prospects.

### New learnings from Refresh #65 (historical)

- **Verify the recipient address before assigning an outbound thread to a client — the #64 Alicia misattribution.** #64 recorded that the "8→6 tables" wedding-week thread belonged to a *different* client than Alicia Herlihy, and her URGENT call-owed flag was carried on that basis. #65's full thread read showed the thread was addressed to `amherlihy@yahoo.com` — it was Alicia's all along, and her situation had actually resolved (proposal Jun 21, approval same day, call held, wedding executed). **Rule:** any claim that "thread X belongs to client Y, not client Z" must cite the actual To: address; if the recipient wasn't captured, re-read the thread before carrying the flag forward.
- **The Zapier decline pattern now includes the no-signal variant.** Instances 5-7 this run: Olivia Powers and Grace Hickey were classic Follow-up-masks-decline (Zapier advanced, outbound read showed Susan declined); Victoria McManmon was a **direct-email decline with NO Zapier signal at all** (no HB project ever existed). The outbound scan is the only net that catches this third variant — another reason the outbound read is mandatory regardless of what Zapier says.
- **The GCal enrichment model worked end-to-end for the first time (Pauline & Dwaine).** David manually created a primary-calendar event (Jun 22) with the proposal PDF attached; #65's sub-scan read the event, resolved the null wedding date (9/26/26), migrated the gcal link into `CAL_LINKS`, and added the name to `MANUAL_CAL`. Treat this as the template for future null-date Gmail Only entries: David enriches the calendar, the refresh harvests it.
- **Noise-filter regression: `member.theknot.com` leads are being labeled bhb/noise.** Alyssa Greenspan's Jun 23-24 Knot lead notifications arrived carrying `Label_4` despite Knot leads being expressly do-not-block. An over-broad sender token in `NOISE_SENDERS` (in `bhb_noise_filter.gs`) is the likely cause — David to audit. Until fixed, the client-side Label_4 drop must **exempt `member.theknot.com`** senders (manual scan of dropped mail caught this one).
- **Second client emails are real: track them in notes.** Shelby (of Shelby and Timothy, entry email `sem273@gmail.com`) is actively using `shelby.richards@verizon.net`. The email-is-identity-key rule needs the corollary: when a client's *second* address surfaces, record it in the entry's notes so future duplicate-greps match both.
- **Pre-existing HB_LINKS cruft: identical duplicate keys can lurk silently.** The mandatory duplicate-ID scan surfaced `HB_LINKS["Amanda Papavasiliou"]` present twice with the identical URL — pre-existing in the base (not introduced by any recent refresh's edits), syntactically valid (last-wins), invisible to `node --check`. Removed at #65. The scan already covers this class; this is the record that it fired usefully.
- **Inbound full-window coverage is achievable with date-bounded pagination.** ~201 threads paginated across the entire Jun 22 → Jul 8 window using `before:` date bounding (7 pages, ~93% noise). Unlike #62/#64 where depth was partial, #65 covered the full window — zero missed direct leads, verified. Use `before:` cursors rather than raising `pageSize`.
- **Outbound sat at 22/40 (15-30 tier).** The #64 note suggested stepping the small-tier baseline 35 → 30 if #65 also ran under cap — #65 ran the *larger* tier, so the small-tier question stays open for the next sub-15-day run.

### New learnings from Refresh #64

- **Zapier "Follow-up" can mask a Susan decline — outbound cross-check is mandatory.** Three Inquiry→Follow-up Zapier hits this refresh (Jessica Sorcher, Kathryn Wickham, Sarah Dwyer) were all actually Susan *declines* — confirmed only by reading the matching outbound thread ("I am not available" / "not available on your wedding date" / "riding the Pan Mass Challenge"). The Zapier stage signal alone would have mis-promoted all three into the pipeline/Cal Only. This is the Melanie-Guerra pattern at scale (3 in one run). **Rule reinforced:** never act on a Zapier Follow-up advance without confirming against the outbound thread; a Follow-up with a same-window decline email is a decline, not a lead. Kathryn + Sarah were already in Cal Only from #63 (added as forward-diff inquiries) — the #64 outbound read caught the declines and removed them.
- **Past-event auto-promotion fired cleanly for two Retainer-Paid clients.** Lindsey DeRensis (6/20) and Meaghan and Matthew (6/13) were past-dated this run and flipped Retainer Paid → Completed in place. They still hold CAL_LINKS entries, so No Cal was unaffected and HB_PIPELINE length stayed 45 (Completed entries live in the array, hidden behind the filter). Reverse diff saw their IDs but they were already resolved by the promotion — no double-handling.
- **Post-hoc HB invoice on an executed one-off ≠ pipeline promotion.** Joanne Doherty's rehearsal dinner executed 6/12, then a Zapier Inquiry→Proposal Sent fired Jun 15 — a HoneyBook invoice generated *after* the event. Kept Gmail Only terminal (Jen Gray precedent). A Proposal-Sent Zapier signal that post-dates an executed event is an invoicing artifact, not a live pipeline lead.
- **Outbound elevated cap (35) did not bind (26/35).** First run on the elevated cap; headroom is comfortable. Marginal yield of the elevation was again low (the extra threads were the three declines, which *are* genuinely actionable this time). Consider stepping the cap back toward 30 at #65 if it keeps sitting well under 35.
- **Inbound partial-depth honesty.** The inbound stream is ~92% `bhb/noise`; paginated to ~Jun 14 per the documented noise-artifact pattern and stopped. Zero new direct leads beyond what targeted reads captured. Flagged the partial depth honestly rather than claiming full coverage — fail-loud over false-complete.
- **Untracked-completed family client (Jilly & Billy / `ebrunelle13@gmail.com`).** Another Caroline-Barrett-pattern client: wedding executed, paid outside HoneyBook, no HB project / calendar / array entry. Surfaced via outbound sent-mail. Did NOT create a speculative entry (no date/venue/payment captured) — flagged for David to confirm and backfill. The periodic older-sent-mail deposit/payment audit remains worthwhile precisely for this pattern.

- **The Gmail MCP `search_threads` tool does NOT honor `-label:` negation.** Tested at #63 with both the label ID form (`-label:Label_4`) and the name form (`-label:bhb-noise`): results still included threads carrying `Label_4`. The server-side `bhb/noise` filter itself works (new mail arrives labeled); only the query-side subtraction fails through the MCP tool. **Workaround codified into Step 1b/C:** run the inbound scan without the label term, paginate `nextPageToken` until results reach SCAN_AFTER (or overlap the previous refresh's coverage), and filter client-side by dropping any thread whose messages carry `Label_4`. Coverage continuity with the prior refresh's window substitutes for the cap-bind tripwire on this scan.
- **Outbound cap elevated 25 → 35 (effective #64).** Third consecutive bind at #63 (25/25; doubled re-run 26 unique — the one extra was a decline). The 3-streak rule fired even though this run's marginal yield was negligible; 35 is insurance. Revisit if it sits far under cap.
- **A cross-array duplicate can self-resolve through email evidence (Molly & Mike).** The #61 shared-email flag (mollymm10 on both Molly Murphy and Molly & Mike) resolved when the live Molly & Mike thread showed the client (Molly O'Leary) writing from `mikeandmolly2026@gmail.com` — two distinct clients, wrong stored email on one. Fix the email field (it is the identity key) and log the prior value in notes.
- **Near-date silence closed out as predicted (Cindy & Amanda Chase).** The 6/6/26 wedding passed with zero Gmail activity at any point. Annotated as outcome-unknown for David rather than guessed at — the repurpose-silence pattern covers unanswered questions, not never-answered proposals, so executed-vs-lapsed needs human confirmation.
- **Mass "Bid Proposal Invitation" emails to undisclosed-recipients are a solicitation-spam pattern** (Whitney McDuff, À La Carte Events, both Jun 8, both "Due June 30"). Do not create entries; mention once as advisory.

#### Noise senders to add (advisory — David applies to `NOISE_SENDERS` + `rebuildNoiseFilter()`)

Seen unlabeled in the #63 window (some may already be in the #62 advisory batch of ~40 — dedupe when applying): `weddingchicks.com`, `kjbm.floweringminds.education`, `mg.homedepot.com`, `shoppeamberinteriors.com`, `email2.faire.com`, `mail.faire.com`, `e.thereformation.com`, `service.tiktok.com`, `business.amazon.com`, `m2.panerabread.com`, `express.sea1.medallia.com`, `newsletter@x.com`, `no-reply@youtube.com`, `pila-barre.com`, `email@weddingpro.com`, `no-reply@intuit.com` (distinct from `notices.intuit.com`). Do NOT block: `member.theknot.com` (lead channel), `mailman@honeybook.com` (payment/contract confirmations are signal), `dvflora.com`/`dvfloralgroup.com` human-sender mail (supplier coordination; the bulk `webteam@dvflora.com` newsletter is already labeled).

### New learnings from Refresh #62

- **Inbound 40-cap binding can be a blocklist-coverage artifact, not signal truncation — do NOT auto-elevate on a bind alone.** In #62 the inbound scan hit 40/40 and fired the tripwire, but the doubled re-run at 50 surfaced **zero** new real client signal — the only reason it bound was marketing senders that slipped the blocklist (Reformation ×4, Mapfre ×2, MayArts ×2, OpenTable, Sara Campbell, WGBH `m.wgbh.org`, Intuit `notices.intuit.com`). The fix is to expand the blocklist, not raise the cap. **Codified:** when an inbound bind re-runs and the extra results are all noise, treat it as a filter-coverage problem and expand the blocklist; reserve cap elevation for binds where the doubled re-run yields additional *real* threads. The 40 baseline is correctly sized; held for #63. (Blocklist expanded this refresh with the 7 domains above.)
- **When expanding the inbound blocklist, ADD to the existing list — never rewrite it from scratch.** During #62 a re-run query was rebuilt by hand and dropped the original ~60 domains, re-exposing all the previously-filtered noise. The blocklist in this skill is the canonical copy; append new domains to it and copy the whole block into the query. Rebuilding from memory silently re-floods the scan. **SUPERSEDED (June 3, 2026):** the inline blocklist was retired; noise filtering moved to the server-side `bhb/noise` Gmail filter, and the canonical list is now `NOISE_SENDERS` in `bhb_noise_filter.gs`. The "add, never rewrite from scratch" caution now applies to that array. See *Inbound noise filtering* and the June 3 migration note.
- **Reverse-diff past-wedding auto-complete vs. archive (Erin Daly).** A reverse-diff hit that is an *active HB_PIPELINE* entry whose wedding date is now in the past (and that HoneyBook has not archived) is a **Completed-stage promotion**, not an HB_ARCHIVED move. Erin Daly (5/30/26, Planning, paid in full $4,985.69) surfaced because her HB calendar event rolled off after the wedding; correct action is `stage: Planning → Completed`. Distinguish three reverse-diff branches: CAL_ONLY future-date → auto-archive; CAL_ONLY past-date → flag-for-review; active-pipeline past-date → mark Completed.
- **Primary-calendar manual events are a durable date/venue/planner backfill source — read them even when sub-scan E migration is a no-op.** Two long-null `eventDate` fields were resolved this refresh from David's manually-added primary-calendar events: Katie Escano → 6/13/26 (Black Rock CC, Hingham) and Jan Koss & Kenzie → 11/14/26 (Granite Links; partner Anthony, planner Theresa McWaters). The 9-event migration backlog had already cleared at #61, so sub-scan E was a clean *migration* no-op — but the events still carry facts worth reading into matching entries.
- **Terminal-completed Gmail-Only one-offs get a full entry + narrative even with no calendar event (Jen Gray).** A HoneyBook project with a paid single-retainer invoice and an event that has already happened, but no calendar event, belongs in GMAIL_ONLY with `hbCal:false` and a short terminal narrative; it correctly surfaces under No Cal. Flag any approximate `eventDate` for David to confirm.

### New learnings from Refresh #61

- **Sub-scan E must scan the PRIMARY calendar, not the HoneyBook secondary calendar — corrected #61.** The `boathouseblooms@gmail.com` account holds multiple calendars; two matter. The **HoneyBook secondary** calendar (`h4tmrcv18kkhts6g1a2401j5c4@…`) is where HoneyBook auto-writes project events — every event on it is a HoneyBook event. The **primary** calendar ("Susan Hellman", ID `boathouseblooms@gmail.com`) is where *manually-added* events land — and the No Cal "+ Add to Calendar" deep link can only target the primary calendar (a `render?action=TEMPLATE` URL cannot force a non-primary calendar). The original sub-scan E scanned only the HoneyBook calendar for "manual events" — but manual events never appear there, so sub-scan E could never find them and No Cal entries with a manually-added event stayed in No Cal forever. Caught when David's manually-added "Amanda and Emmett" wedding event (Jun 6 2026, primary calendar, traces to the `Cindy & Amanda Chase` Gmail Only entry) was invisible to the #61 scan. Fix applied to Step 1b: scan D now fetches **both** calendars (HoneyBook feeds the diff, primary feeds sub-scan E); sub-scan E sources its manual-events bucket from the primary calendar. The primary calendar carries personal-event noise, but sub-scan E's migrate-only-on-unambiguous-match rule absorbs it — unmatched personal events are simply ignored. **One-time effect:** the first refresh under the new logic will surface the full backlog of manual events already sitting on the primary calendar at once (a small cluster of migrations/flags).

- **The file's CHANGELOG is the authority on what refresh number you are running — not this skill's state table.** Refresh #61 opened with a conflict: this skill's current-state table claimed #61 was already done (counts 45/24/30/32, 57 narratives), but the uploaded `index.html` had no #61 changelog entry — its newest entries were Refresh #60 (May 24) and the No Cal feature (May 26), with counts 45/23/30/32 and 56 narratives. The skill had been edited to *predict* the #61 end-state before #61 was committed. Step 0 must therefore always cross-check: read the top CHANGELOG entry's label and compare its counts to the skill's table. If they disagree, the file wins, and the run in progress takes the next unused number. A cheap guard: `grep -c 'Refresh #N' index.html` for the number the skill claims — if zero, that refresh was never committed. Do not edit the skill's state table to a future refresh number until that refresh's changelog entry actually exists in the file.

- **Before adding any GMAIL_ONLY entry, match the client email against every existing entry across ALL arrays.** Refresh #61's first pass added Mary Finneran / Amanda & Emmet and Jean Soucy as "new" GMAIL_ONLY entries when both already existed — Mary as "Mary (Rehearsal)" (`emjjep6@aol.com`, added #55) and Jean Soucy (`jkpjsoucy@yahoo.com`, added #57, identical name). The outbound scan surfaced fresh proposal activity for both, and that activity was misread as a first-time booking rather than continued activity on a tracked client. The display name differed slightly ("Mary (Rehearsal)" vs "Mary Finneran / Amanda & Emmet") so a name-only check missed it; the email address was identical and would have caught it. **Codified rule:** when an outbound proposal looks like a new client, FIRST grep the file for the recipient's email address. If it appears in any array (`HB_PIPELINE`, `GMAIL_ONLY`, `CAL_ONLY`, `HB_ARCHIVED`), it is NOT a new client — append to that entry's narrative/notes instead of creating a record. Only create a new entry when the email appears nowhere. The email is the identity key; the display name is not.
- **Step 4 must include a same-email duplicate scan across all four arrays.** The count-coherence check should additionally extract every `email`/contact value and flag any value appearing more than once. Refresh #61's two duplicates passed `node --check` and array-length coherence cleanly — only a same-email scan would have caught them automatically. This is distinct from the cross-array duplicate check (Samantha Zaino) which compares names; add an email-keyed pass alongside it.
- **Inbound small-tier baseline elevated 30 → 40 (effective #62).** The inbound 30-cap bound on its first scan in #61 (30/30 → re-ran 50, 42 unique). This is the binding pattern across #57, #58, #59, #60, and #61 — five consecutive refreshes, far past the 3-consecutive-bind threshold in the tripwire-escalation rule, and every doubled re-run yielded materially more unique results than the cap. The #60 learning explicitly named #61 as the elevation trigger if inbound bound again; it did. **Action taken: the ≤14d tier Inbound cap is raised from 30 to 40** (see the maxResults tier table). Re-evaluate after #62: if 40 binds, the doubled re-run is the safety net; if it sits comfortably under 40, the elevation was correctly sized.
- **Outbound 25-cap bound again in #61 (25/25 → re-ran 50, 42 unique) — but streak is only 1.** Outbound bound in #59, did NOT bind in #60 (24/25), bound again in #61. The #60 non-bind reset the consecutive-bind counter, so #61 is bind #1 of a new streak — **not** 3 consecutive, so **no outbound elevation.** Keep the 25 baseline for ≤14d-gap refreshes. Note: the 42-unique doubled re-run includes the two duplicate-proposal threads that should have mapped to existing clients — outbound volume is genuinely near the cap but a fraction of "unique results" can be continued activity on tracked clients, not new leads.
- **Reverse-diff CAL_ONLY past-date flag persists across refreshes until David acts (Samantha Sieger).** Samantha Sieger's CAL_ONLY entry (date 5/23/26) was flagged for review in #60 and surfaced *again* in the #61 reverse diff because the entry is still in CAL_ONLY and the date is still past. This is correct behavior — a "flag for review" item is not self-resolving; it re-surfaces every refresh until David archives it in HoneyBook (or confirms it as completed-untracked). When carrying a flagged-for-review CAL_ONLY item forward, expect it in the next reverse diff as a known no-op.
- **Step 4 narrative count must include HB_ARCHIVED.** The header "Narratives" count is the total `narrative:{` count across HB_PIPELINE + GMAIL_ONLY + CAL_ONLY + HB_ARCHIVED. HB_ARCHIVED entries retain their `narrative` field after archival. Count the literal `narrative:{` brace form (not a loose `narrative:` match) to exclude the word appearing inside CHANGELOG prose strings.

### On-demand backfill — Cindy & Amanda Chase (May 26, 2026)

Not part of a refresh — a standalone narrative backfill. The `Cindy & Amanda Chase` GMAIL_ONLY entry (added #57) had no `narrative`. First-pass backfill per the protocol: keyword-free `to:X OR from:X` search on both client emails (`cindychase44@gmail.com`, `amanda.chase4@gmail.com`) plus a name search ("Amanda"/"Emmet[t]", "Cindy/Amanda Chase"). The Gmail history is genuinely a single outbound thread (`19e23f3e0e4378d6`, one message, May 14 preliminary proposal, no client reply). Narrative authored from that thread; two-entry timeline (May 14 gmail-out + Jun 6 calendar). **Data-quality byproduct:** the wedding date — absent from all Gmail — was resolved to **Jun 6 2026** from the David-added primary-calendar event "Amanda and Emmett" (the same event the #61 sub-scan-E learning describes); `eventDate` corrected `null → 2026-06-06` and `notes` rewritten. The proposal PDF title "Amanda & Emmet Wedding Blooms" confirms the wedding is Amanda Chase & Emmett with Cindy as the mother. Venue remains unknown — not in Gmail or the calendar event. Narrative count 57 → 58.

### Removed (historical from #60)

The #60 learnings (outbound 24/25 non-bind ending the streak, inbound 30/30 bind with #61 named as the elevation trigger, planner-mediated booking as a confirmed 2nd-instance pattern, reverse-diff CAL_ONLY past-date branch exercised by Samantha Sieger, cross-array duplicate detection via Samantha Zaino, bracket-balanced extraction over VM eval for Step 4) are now historical. The inbound elevation watch resolved: #61's bind triggered the 30 → 40 elevation. The planner-mediated, past-date-branch, cross-array-duplicate, and bracket-balanced-extraction findings are all codified in 'Judgment calls', Step 1.5, and Step 4 respectively.


## Key constants

| Item | Value |
|---|---|
| Live URL | https://bhb-david.github.io/boathouse-blooms |
| Password hash | `-874608686` (password: `blooms2026`) |
| GitHub repo | `BHB-David/boathouse-blooms` · file `index.html` at root |
| Cloudflare Worker | `https://boathouse-proxy.david-9bd.workers.dev` |
| HB Calendar ID | `h4tmrcv18kkhts6g1a2401j5c4@group.calendar.google.com` (HoneyBook secondary — feeds the diff) |
| Primary Calendar ID | `boathouseblooms@gmail.com` (a.k.a. `primary`, labeled "Susan Hellman" — holds manual events, feeds sub-scan E) |
| Gmail account | `boathouseblooms@gmail.com` |

**ID equivalence:** an HB calendar event's `id` and the HoneyBook project ID are the **same 24-char hex string**. A Cal Only entry's `hbEventId` becomes the ID inside `HB_LINKS` when the client moves to pipeline.

---

## Narrative field (Full History feature)

Added at the end of Refresh #46. Every entry in `HB_PIPELINE`, `GMAIL_ONLY`, `CAL_ONLY`, `ACCEPTED_NO_HB`, and `HB_ARCHIVED` can optionally carry a `narrative` field. If present, a `📖 Full History` button appears in the card's expanded detail and toggles a pane showing the summary + dated timeline.

### Schema

```js
narrative: {
  summary: "Short prose paragraph — 50–150 words. Italic display. No markdown.",
  timeline: [
    {date: "YYYY-MM-DD", source: "gmail-out", text: "What happened in ~1 sentence."},
    {date: "YYYY-MM-DD", source: "gmail-in",  text: "..."},
    // ...
  ]
}
```

**Source vocabulary** (these render as color-coded tags in the UI):

| `source` | Tag | Color | Meaning |
|---|---|---|---|
| `gmail-out` | OUT | gold | Outbound Gmail from Susan / boathouseblooms@gmail.com |
| `gmail-in` | IN | green | Inbound Gmail from client or third party |
| `zapier` | HB | purple | Zapier `[HB Update]` stage change |
| `calendar` | CAL | blue | HoneyBook calendar event creation / change |
| `note` | NOTE | muted | Manual / operational note (phone calls, in-person meetings, etc.) |

**Content rules:**
- **Summary** is prose, written in third person, 1–2 sentences of context then the current status. No bullet points, no dates in prose (those belong in the timeline).
- **Timeline** entries are dated. Multiple entries can share a date. Order matters — they render in array order (which should be chronological).
- **Escape nothing manually** — the renderer runs `escapeHtml()` on both summary and timeline text. Just write natural text with straight quotes (`'` and `"`), em-dashes, etc.
- **Keep timeline text terse** — one sentence, action-oriented. "Proposal sent," "Client replied with questions," not "Susan sent a detailed proposal to the client on this date."

### When narratives are authored

- **During a refresh:** when a Gmail outbound or inbound scan reveals substantive activity for a client, build or update the narrative at the same time the notes are updated. Don't let the narrative fall behind notes. **Refresh-time updates use the SCAN_AFTER window only — never re-fetch the full thread at refresh time.**
- **On-demand backfill, first-pass (no existing narrative):** do targeted `to:X OR from:X` Gmail searches per client (no keyword filter, no date restriction) and author from the full thread history.
- **On-demand backfill, incremental update (existing narrative):** read the entry's current `narrative.timeline` and find the most recent timeline `date`. Set `BACKFILL_AFTER = (latest_timeline_date − 7 days)` and search `(to:X OR from:X) after:BACKFILL_AFTER`. The 7-day overlap catches ordering edge cases and any messages that arrived between the last narrative author and the previous timeline cutoff. Anything older than that is already represented in the existing timeline — do not re-ingest it.
- **Backfill progress:** track completed narratives in the refresh changelog and in the current-state table at the top of this skill.

### Data-quality byproducts

Scanning a full client thread to author a narrative often surfaces facts missing from or inconsistent with the card's other fields (wedding dates, paid deposits, venue names). **Fix the card fields at the same time** — don't silo the findings to narrative-only. Log both the narrative addition and the field backfill in the refresh summary so the user can spot-check.

### Current backfill roster

Roster maintained in the file's CHANGELOG; not duplicated here. The skill's responsibility is to keep narratives current for active clients via Step 1c.

### Priority queue (next sessions)

**⚠ Always verify priority-queue names against the live file before each session.** Run `grep -nE 'stage:"Retainer Paid"' index.html | grep -v 'narrative:'` to enumerate the real un-narrated Retainer Paid entries.

**Retainer Paid backfill is essentially complete.** Only one un-narrated Retainer Paid client remains:

- **Samantha Barmore** — Aug 20 2027 (long horizon, low immediate operational value) — *Actually now narrated*. Roster is fully covered through the active priority tiers.

Next-priority backfill tier: **active HB Pipeline clients at Follow-up / Proposal Sent / Proposal Signed stages**. Verify via:

```bash
grep -nE 'stage:"(Follow-up|Proposal Sent|Proposal Signed)"' index.html | grep -v 'narrative:'
```

---

## No Cal filter (+ Add to Calendar)

Added May 26, 2026. A cross-cutting filter — **not** a fifth array.

**What it shows.** Every `HB_PIPELINE` or `GMAIL_ONLY` client with no calendar entry, i.e. whose name is not a key in `CAL_LINKS`. `CAL_ONLY` clients have a calendar event by definition; `HB_ARCHIVED` is historical — both are excluded. The membership test is a per-row `noCal` flag computed in `buildAllRows()`: `noCal:!CAL_LINKS[name]`. The filter button label shows the live count.

**+ Add to Calendar button.** Each No Cal card's expanded detail carries a green pill that opens Google Calendar's own event form, prefilled via a `render?action=TEMPLATE` URL built by `buildGCalAddUrl(row)` — client name (`text`), event date (`dates`, all-day single day, omitted if `date` is null), a venue hint (`location`, best-effort first `·`-segment of `notes` via `extractVenue`), and a `details` string. It is a **deep link only** — no API call, no Cloudflare proxy. This is deliberate: the proxy is unreliable and a static page can't reach the Google Calendar API.

**Known limitations (documented in the UI, not bugs):**
- A `render?action=TEMPLATE` URL **cannot force a target calendar**. The form defaults to the user's primary calendar; Susan/David must switch the dropdown to **Boathouse Blooms** before saving. The card shows a note saying so.
- Creating the event does **not** populate `CAL_LINKS` immediately. The new gcal link is captured into `CAL_LINKS` at the next refresh by the **manual-calendar reconciliation sub-scan** (Step 1b, scan E): it scans the account's **primary calendar** ("Susan Hellman") for non-HoneyBook events and matches them to No Cal entries by email / couple names / date. A matched event's link is migrated into `CAL_LINKS` and the client drops out of No Cal. Because a manually-added event's title is often the email author or couple's names rather than the app entry name, the match is multi-signal and only unambiguous matches auto-migrate — fuzzy ones are flagged for David.

**Maintenance.** `buildGCalAddUrl`, `extractVenue`, the `noCal` flag, the `f-nocal` button, the `nocal` branch in `getDisplayRows`, and `noCalCount` in `render()` are the moving parts. The `noCal` flag is `noCal:!CAL_LINKS[name]` — manual-event links live in `CAL_LINKS` so they clear the flag identically to HoneyBook links. Names of manual-sourced links are also tracked in the `MANUAL_CAL` set, which the reverse-diff archival logic (Step 1.5) must skip. The count drifts as `CAL_LINKS` grows; that's expected and self-correcting.

---

## Working base rule

> **The live file is truth.** Never use `/mnt/project/index.html` — it's a stale snapshot. Start every refresh by `web_fetch`ing https://bhb-david.github.io/boathouse-blooms to confirm counts. For the source file, use the user's upload or fetch the latest commit diff from `https://github.com/BHB-David/boathouse-blooms/commits/main` → commit page. `web_fetch` on the live URL returns stripped text — good for count verification, not as a file base.

---

## Deploy command (never the in-app Redeploy button)

**Cowork sessions (updated #69 — preferred):** request folder access to `~/Desktop/github-boathouse` at the start of the refresh. Claude reads the committed base from the clone AND writes the updated `index.html` directly into it — no cp step needed; David only runs the git commands. (The session-outputs mount proved read-only from the sandbox at #69.)

**Git-lock check (mandatory before emitting the deploy command, added #70):** run `ls .git/index.lock` on the clone. If it exists, a sandbox git command created it and the sandbox cannot delete it — David's commit would fail with 'index.lock: File exists'. Prepend this line to the deploy block so David clears it first:

```bash
rm -f ~/Desktop/github-boathouse/.git/index.lock
```

(Prevention: from the sandbox use only `git --no-optional-locks log/status` — never index-writing git commands.)

Fallback if the folder is not connectable — legacy outputs-folder pattern:

```bash
cp "/Users/davidrhellman/Library/Application Support/Claude/local-agent-mode-sessions/1931585c-e968-454f-a7bd-7170877864a8/ebb88579-c208-413c-8487-1aa0ae2e2bf5/local_d12a190e-a2f3-4543-91b6-d5278143cf52/outputs/index.html" ~/Desktop/github-boathouse/index.html
cd ~/Desktop/github-boathouse
git add index.html && git commit -m "Refresh #N — description" && git push origin main --force
```

The path contains spaces — keep the quotes. Legacy fallback (only if David manually downloaded the file): `cp ~/Downloads/index.html ~/Desktop/github-boathouse/index.html`.

`--force` is always required; the in-app button causes divergence.

### The `--force` → Pages-trigger desync (learned May 26, 2026)

A `git push --force` rewrites history, and GitHub Pages **silently fails to
fire its `pages-build-deployment` workflow** for force-pushed commits. The
commit lands on `main` correctly, but no build runs and the live site keeps
serving the previous deploy. Symptoms: the repo shows the new commit, but
`Actions` shows no new run and `Settings → Pages` still says "Last deployed"
with the old run number.

Things that do **not** reliably re-arm the trigger:
- An empty commit (`git commit --allow-empty`) + normal push — confirmed to NOT trigger a build in this state.
- Toggling the Pages **Source** type (Deploy-from-branch ↔ GitHub Actions) and back — the **Save** button stays dimmed because the net value is unchanged, so nothing re-binds.

What **does** work — a commit carrying a real content change to `index.html`:
```bash
cd ~/Desktop/github-boathouse
printf '\n<!-- pages redeploy %s -->\n' "$(date +%s)" >> index.html
git add index.html && git commit -m "Force Pages redeploy: <description>" && git push origin main
```
The appended HTML comment sits after `</html>` — invisible to the browser and
harmless; it is overwritten at the next refresh. The genuine `index.html` diff
is what wakes the Pages trigger. A `pages-build-deployment` run appears in
`Actions` within ~30s.

Last-resort re-arm (only if a real content push still produces no build):
`Settings → Pages → change the publishing **folder** from `/ (root)` to
`/docs` → Save` (this un-dims because the value genuinely changed) → then
change it **back** to `/ (root)` → Save again. Re-binds Pages to current HEAD.

### Mandatory post-deploy verification

A deploy is **not** confirmed until the live site is checked. After pushing:

1. `Actions` tab → confirm a new `pages-build-deployment` run appeared, is
   **green**, and (open it) was triggered by the **just-pushed commit SHA** —
   not its parent. A green run for the *parent* commit means the build is stale.
2. `Settings → Pages` or the `Deployments` panel → newest deployment is marked
   **Active** for the new commit.
3. `web_fetch` `https://bhb-david.github.io/boathouse-blooms/` and grep the
   filter row / changelog for the feature just shipped. Note: GitHub Pages'
   CDN and `web_fetch` both cache — a stale fetch right after a green deploy is
   expected; advise David to hard-refresh (Cmd+Shift+R) or use an incognito
   window. A green+Active #N run is authoritative over a stale fetch.

Report the deploy as **done** only when the run is green for the correct SHA
*and* the live serve is confirmed (by fetch or by David). If only the commit
is verified, say so explicitly — "committed, deploy not yet confirmed."

---

## The refresh protocol

### Step 0 — Fetch live deployment, confirm counts, copy base, compute SCAN_AFTER

```
web_fetch: https://bhb-david.github.io/boathouse-blooms
cp [uploaded_file_or_github_fetch] /home/claude/index.html
```

**Compute the scan window once, reuse everywhere downstream.**

```python
from datetime import date, timedelta
LAST_REFRESH = date(2026, 7, 8)             # ← read from "Last refresh date" in current-state table
TODAY = date.today()
gap_days = (TODAY - LAST_REFRESH).days
window_days = max(gap_days, 14)             # 14-day floor catches lagging inbound replies
SCAN_AFTER = (TODAY - timedelta(days=window_days)).strftime("%Y/%m/%d")
print(f"gap={gap_days}d  window={window_days}d  SCAN_AFTER={SCAN_AFTER}")
```

**Why a 14-day floor with no ceiling beyond the actual gap:** clients reply, vendors cc, and deposit confirmations land on their own schedule — a same-day refresh still needs ~2 weeks of look-back to catch what arrived after the previous scan window closed. The actual gap caps the upper bound so a 30-day silence doesn't widen the floor unnecessarily.

**`maxResults` tier table** (scales with window so long gaps don't silently truncate):

| `window_days` | Outbound | Inbound | Zapier |
|---|---|---|---|
| ≤ 14 | 25 | 40 | 25 |
| 15–30 | 40 | 50 | 50 |
| > 30 | 60 | 75 | 100 |

**Baseline state for Refresh #72:**
- **Outbound: small-tier baseline 30** (held: #67 16/30, #69 21/30, #71 23/30 — no binds). Tripwire/doubled re-run unchanged.
- **Inbound 40** (nominal). ⚠ The `-label:bhb/noise` subtraction CANNOT be expressed in the scan query — the Gmail MCP search tool does not honor `-label:` negation (see #63 learning). Run the inbound query without the label term, paginate until the SCAN_AFTER window is covered, and drop results carrying `Label_4` (bhb/noise) client-side. Judge truncation by whether the window is covered, not by the count. (#64: stream ~92% noise; paginated to ~Jun 14, zero new direct leads — partial depth is the expected steady state, flag it honestly.)

**Truncation tripwire:** if any scan returns *exactly* `maxResults` items, re-run that scan with double the cap. The first hit is the warning that you're at the edge of the window.

**Tripwire-escalation rule (codified from #58):** If the same scan cap binds for 3 consecutive refreshes (and the doubled re-run consistently yields more unique results than the cap), elevate that scan's small-tier baseline. Document in the New learnings section of the skill at the time the elevation is recommended.

### Inbound noise filtering — Gmail `bhb/noise` filter

Noise filtering no longer lives in this skill as a `-from:(...)` blocklist. As of
June 3, 2026 it runs as **server-side Gmail filter(s)** on the
`boathouseblooms@gmail.com` account that label known marketing/transactional
senders `bhb/noise` on arrival. The inbound scan subtracts that label
(Step 1b/C: `-label:bhb/noise`).

- **Canonical sender list:** the `NOISE_SENDERS` array in `bhb_noise_filter.gs`
  (Apps Script project "BHB noise filter", with the version-controlled copy in
  the GitHub repo). This is the **single source of truth** — do NOT recreate the
  list in this skill (that dual-copy drift is exactly the #62 failure).
- **At migration:** 86 sender tokens, split into 3 filters (Gmail rejects an
  over-long single query; the script chunks at 40). Tokens include a few
  substring matches (`noreply`, `concierge`, `drhellman`, `cutflowers@quinlanwasserman`),
  not just clean domains — kept verbatim from the old blocklist so matching is identical.
- **To add a sender:** edit `NOISE_SENDERS` (Apps Script editor or the repo copy),
  Save, and Run `rebuildNoiseFilter()`. Idempotent — it deletes the existing
  `bhb/noise` filters and rebuilds. Filters act on **new** mail only; they do not
  retro-label mail already in the box.
- **The label is the contract, not the filter count** — `-label:bhb/noise` works
  regardless of how many filters feed the label.
- **`SKIP_INBOX=false`** at migration (label only; noise still reaches Susan's
  inbox, scan just ignores it). Flipping to true archives noise on arrival —
  Susan's inbox-view call, not a scan requirement.

### Step 1 — Targeted reads first, then four parallel scans

#### Step 1a — Pending-item targeted reads (grouped, not per-item)

The pending-items list at the top of this skill is the highest-precision scan target. Cluster pending items by **theme** and fire ≤5 grouped Gmail searches — one per cluster.

**Clustering rule of thumb** — group by what would appear in the same email thread or domain:

- **Planner-mediated** — Andria/Bloom & Grace, Soulyco coordinations, stationer-on-chain threads
- **Scheduled-call stalled** — clients with a documented call date that passed without follow-up
- **Proposal sent, awaiting reply** — items where Susan sent a proposal in the previous 1–4 weeks
- **Pre-engagement watchlist** — Knot/HB leads with no Susan engagement yet (single batched search)
- **Repeat-corporate post-event** — Bryant, PMC, Union Club, etc. (often one search per active event)
- **Cal Only / Pipeline awaiting reply** — clients where Susan has not yet replied to a recent inquiry

**Format:** each search query OR's together the names + emails for that cluster.

For each cluster's results, walk the threads and resolve each pending item to one of:
- **Resolved** — outcome confirmed → drop pending flag, update notes/narrative
- **Carry forward** — still in flight → keep pending flag, refresh date in pending-item description
- **Stalled** — no movement past the scheduled-action date → flag for user review

**Pending-item format requirement.** Every pending-items entry below must include an inline `(email@…)` parenthetical so cluster queries can be built directly without round-tripping through the app file. Items with no known email cluster into the pre-engagement watchlist search by name only.

**Skip individual reads when** an item appears in a cluster result. Only fall back to a one-off `(to:EMAIL OR from:EMAIL)` thread search if a cluster fetched the wrong thread or returned nothing for an item known to be active.

#### Step 1b — Run all four broad scans in parallel

Fire all four simultaneously; don't wait.

**A. Zapier [HB Update] scan** — `subject:[HB Update] after:SCAN_AFTER maxResults:<tier>`

For each email parse: `Client:`, `New Stage:`, `Event Date:`, `Project Url:` (contains HB project ID).

| Stage code | Display |
|---|---|
| `_INQUIRY_` | Inquiry |
| `_FOLLOW_UP_` | Follow-up |
| `_PROPOSAL_SENT_` | Proposal Sent |
| `_PROPOSAL_SIGNED_` | Proposal Signed |
| `_RETAINER_PAID_` | Retainer Paid |
| `_PLANNING_` | Planning |
| `_COMPLETED_` | Completed |
| `_CLOSED_` | REMOVE from pipeline |

Rapid-fire double-updates (e.g. `_RETAINER_PAID_` → `_PLANNING_` same day): take the highest stage only.

**B. Gmail outbound scan** — `from:boathouseblooms@gmail.com (proposal OR pricing OR floral OR flowers OR invoice) after:SCAN_AFTER maxResults:<tier>`

Look for: new proposals (→ Gmail Only), deposit confirmations / "I received your deposit" / "You are in my book" (→ Retainer Paid), "Regretfully Unavailable" or "not available on your wedding date" (→ remove/skip), full-payment invoices (`X of X` → confirm Planning), forwards to `drhellman@gmail.com` (operational notes, extract info only).

**C. Gmail inbound scan** — `to:boathouseblooms@gmail.com after:SCAN_AFTER maxResults:<tier>`, then **client-side label subtraction**: drop every thread whose messages carry `Label_4` (`bhb/noise`). ⚠ Do NOT put `-label:bhb/noise` (or `-label:Label_4`) in the query — the Gmail MCP search tool does not honor `-label:` negation (#63 learning); the term silently does nothing. Paginate via `nextPageToken` until results reach SCAN_AFTER or overlap the previous refresh's covered window; judge truncation by window coverage, not by the result count.

Critical for: event dates and venues that clients state in replies (not in Susan's outbound), acceptance confirmations, decline-to-book, deposit/payment confirmations from client side.

**Noise that slips the filter (advisory only — do NOT act on Gmail during a refresh):** if the inbound scan or its doubled re-run returns marketing/transactional senders not yet caught by `bhb/noise`, do NOT edit Gmail filters mid-refresh and do NOT reinstate an inline `-from:` blocklist. List those senders in the refresh summary under **"Noise senders to add"** so David can append them to `NOISE_SENDERS` and re-run `rebuildNoiseFilter()` out of band. This is the current form of the #62 "expand the blocklist" fix; the refresh stays read-only against Gmail.

**D. HB Calendar scan** — `gcal_list_events` with the HB calendar ID, startTime today, endTime `today + 3 years`, pageSize 250.

The calendar response is ~24K tokens for 70 events but only the IDs matter for the diff (~400 tokens). For forward-diff hits, look up the full event description by ID from the response.

**Two calendars, not two event types.** The `boathouseblooms@gmail.com` account holds several calendars. Two matter:
- **HoneyBook secondary calendar** — ID `h4tmrcv18kkhts6g1a2401j5c4@group.calendar.google.com`, labeled "HoneyBook Calendar - Boathouse Blooms". HoneyBook writes its project events here automatically. **Every event on this calendar is a HoneyBook event** — `description` carries the boilerplate `"edit/save changes to this calendar event via your HoneyBook"` and a `honeybook.com/app/event/<ID>` link; the event `id` IS the HoneyBook project ID.
- **Primary calendar** — ID `boathouseblooms@gmail.com` (a.k.a. `primary`), labeled "Susan Hellman". This is where **manually-added events** land — including every event created via the No Cal "+ Add to Calendar" deep link, which cannot target a non-primary calendar. Manual events have no HoneyBook boilerplate and an arbitrary Google event ID. Their title is usually the couple's names, not the app entry name (e.g. an "Amanda and Emmett" event traces to the `Cindy & Amanda Chase` Gmail Only entry).

**Scan D fetches both calendars** (two `list_events` calls, same time window). The HoneyBook calendar feeds the bidirectional diff; the primary calendar feeds sub-scan E. Do not merge them. The primary calendar is Susan's working calendar and will contain personal events — sub-scan E tolerates this because it only migrates on an unambiguous match and flags everything else for David (see scan E).

**The calendar is truth.** Run the diff in both directions, **using the HoneyBook calendar only** (every event on it is a HoneyBook event, so no per-event classification is needed):

- All HoneyBook-event IDs currently on the calendar → `cal_now`
- All 24-char hex IDs found anywhere in `/home/claude/index.html` → `app_ids`
- Forward diff (cal_now − app_ids) = potential new entries
- Reverse diff (app_ids − cal_now) = HoneyBook archived them OR past events

The broad grep catches IDs in `hbEventId`, `HB_LINKS` URLs, and `CAL_ONLY_GCAL_LINKS` eids. Because the diff fetches only the HoneyBook calendar, `cal_now` is inherently HoneyBook-only — no manual-event IDs can leak in. (Manual-event Google IDs do appear in `CAL_LINKS` URLs for migrated entries, so they are in `app_ids`; they correctly fall into the reverse diff and are skipped via the `MANUAL_CAL` set — see Step 1.5's manual-calendar guard.)

For each ID in the reverse diff, resolve to a client name by bracket-balancing each data array (`CAL_ONLY`, `HB_PIPELINE`, `HB_ARCHIVED`, etc.) and finding which one contains the ID. IDs found in `HB_ARCHIVED` alone are no-ops (already archived).

**E. Manual-calendar reconciliation (No Cal cleanup)** — after the HB diff, reconcile manual events against the No Cal set.

The No Cal filter shows every HB Pipeline or Gmail Only client with no `CAL_LINKS` key. A manually-added calendar event for such a client genuinely exists but never reaches `CAL_LINKS` (only HoneyBook events populate it automatically), so the client wrongly stays in No Cal. This sub-scan fixes that.

1. Take the **primary-calendar events** from scan D (the second `list_events` call against `boathouseblooms@gmail.com` / `primary`). Filter to events with no HoneyBook boilerplate in the `description` — this is the manual-events bucket. (Events with the boilerplate, if any appear, are HoneyBook's and are ignored here.) Take the current **No Cal set** — every `HB_PIPELINE` or `GMAIL_ONLY` entry with no `CAL_LINKS` key.
2. For each manual event, attempt to match it to a No Cal entry using **multiple signals**, because the event title is usually NOT the entry name:
   - any email address in the event `description` vs the entry's `email` (strongest signal — exact email match);
   - client/partner/couple names in the event `summary` vs names in the entry's `client`/`name` or `notes`;
   - the event `start.date` vs the entry's `eventDate`.
3. **Auto-migrate** the event's gcal link into `CAL_LINKS` (under the app entry's name) ONLY when the match is unambiguous — an exact email match in the description, OR the title contains the full entry name AND the date matches. The entry then drops out of No Cal automatically.
4. **Flag for David** every fuzzy or multi-candidate match — title is just a venue, a bare first name matching two clients, a date-only signal, etc. Never guess; never auto-migrate a fuzzy match.
5. Manual-event links live in `CAL_LINKS` (same map as HoneyBook links — they behave identically for the No Cal filter and the Calendar button). BUT also add the entry's name to the **`MANUAL_CAL` set** so the reverse-diff archival logic skips it (see Step 1.5). Log each migration in the changelog, noting it was manual-sourced.

#### Step 1c — Refresh-time narrative updates use the same window

When a refresh-time scan reveals substantive activity for a client with an existing narrative, append timeline entries from the *same SCAN_AFTER window* — do **not** re-fetch the full thread.

### Step 1.5 — Handle archived IDs (reverse-diff results)

HoneyBook archival is a stage that can **only** be detected via absence from the calendar — but absence has **two possible causes**:

1. **HoneyBook archived it.** Client is truly gone from the calendar → move to `HB_ARCHIVED`.
2. **The event already happened.** The HB calendar only shows future events, so any entry whose `date` is past will naturally fall off. This is **not** archival — it's a completed wedding.

**Manual-calendar guard.** A `CAL_LINKS` entry whose name is in the `MANUAL_CAL` set was migrated from a manually-added calendar event (Step 1b sub-scan E), not a HoneyBook event. Its link does not correspond to a HoneyBook project ID, so it never appears in `cal_now` and would always show up in the reverse diff as a false archival signal. **Reverse-diff resolution must skip any name in `MANUAL_CAL`** — these are not archival candidates. Only HoneyBook-sourced IDs drive archival.

The skill distinguishes the remaining cases by checking the entry's `date` field before deciding. Branch table:

| Resolved from | Entry `date` | Current stage | Action |
|---|---|---|---|
| `CAL_ONLY` | future | n/a | **Auto-move** to `HB_ARCHIVED` with `source:"CAL_ONLY"`; remove from `CAL_ONLY` + `CAL_ONLY_GCAL_LINKS` |
| `CAL_ONLY` | past | n/a | **Flag for review** — unusual; confirm with user. |
| `HB_PIPELINE` | future | Inquiry, Follow-up, Questionnaire | **Auto-move** to `HB_ARCHIVED` with `source:"HB_PIPELINE"`; remove from `HB_PIPELINE`, `HB_LINKS`, `CAL_LINKS`, `GMAIL_THREADS` |
| `HB_PIPELINE` | future | Proposal Sent / Signed / Retainer Paid / Planning | **Flag for review** — surface as warning; do NOT move until user confirms |
| `HB_PIPELINE` | past | any non-Completed | **Auto-promote stage to Completed** — wedding happened. Update notes; no array move. |
| `HB_PIPELINE` | past | Completed | **Ignore** — already Completed. No action. |
| `HB_PIPELINE` | null | any | **Flag for review** — can't determine past vs future. Ask user. |

Entries moved to `HB_ARCHIVED` carry forward their full context. Shape:

```js
{name:"...", email:"...", date:"YYYY-MM-DD", hbEventId:"...",
 archivedAt:"YYYY-MM-DD",            // refresh date of detection
 source:"CAL_ONLY" | "HB_PIPELINE",
 prevStage:"..." | null,
 notes:"..."}
```

**Past-date rule rationale:** Without the past-date check, naturally-rolled-off past weddings would be auto-archived as suspicious. Always check `date` first.

Log in changelog as: `"HB archived (auto): N Cal Only, M early-pipeline · auto-completed (past-event): K · flagged for review: P"`.

### Step 2 — Reconcile (map every change before touching the file)

Decision rules:

| Finding | Action |
|---|---|
| `[HB Update]` + client in `GMAIL_ONLY` | Move to `HB_PIPELINE` at new stage |
| `[HB Update]` + client in `CAL_ONLY` | Move to `HB_PIPELINE`, remove from `CAL_ONLY` + `CAL_ONLY_GCAL_LINKS` |
| `[HB Update]` + client in `HB_PIPELINE` | Update stage |
| `[HB Update]` stage = `_CLOSED_` | Remove from `HB_PIPELINE` |
| ID missing from calendar (reverse diff) | Per Step 1.5 branching table |
| Outbound proposal, possibly new client | **FIRST grep the file for the recipient's email across all arrays.** If found → append activity to that existing entry's notes/narrative. Only if the email appears nowhere → add to `GMAIL_ONLY`. Display names vary; the email is the identity key. |
| Outbound "Regretfully Unavailable" / decline | Remove from Cal Only if present; don't add if new |
| Inbound confirmation of date/venue for existing entry | Update `date` + `notes` |
| New calendar ID (not a duplicate, not a dead test) | Add to `CAL_ONLY` |
| Null-date pipeline client | Run `to:EMAIL OR from:EMAIL` thread search; extract date/venue/details |

### Step 3 — Apply edits to `/home/claude/index.html` via `str_replace`

**Arrays** (object shapes):

| Array | Shape |
|---|---|
| `HB_PIPELINE` | `{name, email, stage, date, notes}` |
| `GMAIL_ONLY` | `{client, email, gmailDate, eventDate, hbCal, notes}` |
| `CAL_ONLY` | `{name, date, hbEventId, notes?}` |
| `HB_ARCHIVED` | `{name, email?, date, hbEventId, archivedAt, source, prevStage?, notes?}` |
| `HB_LINKS` | `"Name": "https://app.honeybook.com/app/event/ID"` |
| `GMAIL_THREADS` | `"Name": "<gmail thread URL>"` |
| `CAL_LINKS` | `"Name": "<gcal URL>"` (pipeline clients, plus manual-event migrations) |
| `CAL_ONLY_GCAL_LINKS` | `"Name": "<gcal URL>"` (Cal Only clients) |
| `MANUAL_CAL` | `["Name", ...]` — set of entry names whose `CAL_LINKS` URL came from a manually-added (non-HoneyBook) calendar event. Used to exclude them from reverse-diff archival. |

`hbCal:true` in `GMAIL_ONLY` = client also has an HB calendar Inquiry.

`HB_ARCHIVED` is populated only by the reverse-diff logic in Step 1.5. Entries never leave `HB_ARCHIVED` once placed.

**Client moves** (which arrays change):

| Move | Remove from | Add to | Also touch |
|---|---|---|---|
| Gmail Only → Pipeline | `GMAIL_ONLY` | `HB_PIPELINE`, `HB_LINKS` | Keep `GMAIL_THREADS`; update `CAL_LINKS` if HB cal entry exists |
| Cal Only → Pipeline | `CAL_ONLY`, `CAL_ONLY_GCAL_LINKS` | `HB_PIPELINE`, `HB_LINKS`, **`CAL_LINKS` (migrate URL — mandatory)** | Add `GMAIL_THREADS` if known |
| Pipeline stage change | — | — | Edit `stage` + `notes` only |
| New Cal Only | — | `CAL_ONLY`, `CAL_ONLY_GCAL_LINKS` | — |
| Cal Only → HB Archived (auto) | `CAL_ONLY`, `CAL_ONLY_GCAL_LINKS` | `HB_ARCHIVED` (source:"CAL_ONLY") | — |
| Early Pipeline → HB Archived (auto) | `HB_PIPELINE`, `HB_LINKS`, `CAL_LINKS`, `GMAIL_THREADS` | `HB_ARCHIVED` (source:"HB_PIPELINE", prevStage set) | — |
| Late Pipeline → HB Archived (confirmed) | same as above | same as above | Requires user confirmation first |

**Post-edit metadata** (must be mutually consistent):

1. Version comment (top of file): `Cal Only: N · Gmail Only: N · HB Pipeline: N · HB Archived: N`
2. Stats strip (search `Pipeline: <span`): first three Ns must match the version comment
3. Timestamp (`const built = new Date`): use a real ET time, not midnight; displays as "Apr DD, YYYY, H:MM AM/PM"
4. `CHANGELOG` entry at TOP of array — plain `"` double quotes, never escaped `\"` (the #1 source of JS syntax errors)

### Step 4 — Verify

```bash
# Count coherence: the Ns must match the actual array lengths (use bracket-balanced array extraction)
# Syntax check (mandatory): node --check on each <script> block
# Link-map coverage check (catches Cal Only → Pipeline URL migration failures)
```

**Narrative count.** The header "Narratives" N is the total `narrative:{` count across **all four** arrays — HB_PIPELINE + GMAIL_ONLY + CAL_ONLY + HB_ARCHIVED. HB_ARCHIVED entries retain their narrative after archival, so omitting that array under-counts. Count the literal `narrative:{` brace form (not a loose `narrative:` match) to exclude the word appearing inside CHANGELOG prose strings.

**Duplicate scan (mandatory).** Two passes: (a) extract every `email` value across all four arrays and flag any value appearing more than once — this catches a new entry that duplicates an existing client under a different display name; (b) extract every `name`/`client` value across all four arrays and flag cross-array name collisions. Refresh #61 added two same-email duplicates (Mary Finneran, Jean Soucy) that passed `node --check` and length-coherence cleanly — only the email scan catches that class of error.

**Reading the link-map output:**
- `pipe_no_cal` — non-empty is expected (Pipeline clients without an HB calendar entry: Completed weddings, GMAIL_ONLY promotions where Susan never created a calendar entry). **Red flag:** any client that appeared in this refresh's Cal Only → Pipeline promotions. That means the gcal URL was dropped.
- `cal_no_gcal` — should be zero or only pre-existing known issues (Winnie Guo). Every Cal Only entry was discovered via the HB calendar and has an eid.
- `stale_cal` / `stale_gcal` — should be zero. Non-zero means a client was removed from the data array but their link-map entry wasn't cleaned up. **Mandatory check for current refresh: confirm any client promoted Cal Only → Pipeline this refresh appears in the stale_gcal list (means they got removed from CAL_ONLY but their gcal link wasn't migrated/cleaned).**

Fix any failures before proceeding.

### Step 5 — Output and summarise

```bash
cp /home/claude/index.html /mnt/user-data/outputs/index.html
```

Also output an updated BHB_SKILL.md to `/mnt/user-data/outputs/` with current state (last refresh number/date, counts, scan cutoff, pending items) updated and any new learnings incorporated. Present both files together.

Then provide: summary table of changes, archival decisions made, updated pending-items list, and the deploy command with refresh number — after running the git-lock check (see Deploy command section: if `.git/index.lock` exists on the clone, prepend `rm -f ~/Desktop/github-boathouse/.git/index.lock` to the deploy block) — built from the CURRENT session's outputs path (see Deploy command section), never `~/Downloads`.

---

## Skip list

Apply at ingestion — these never create entries.

| Pattern | Reason |
|---|---|
| `[HB Update] David Hellman →` | Internal HB test project |
| To `cutflowers@quinlanwasserman.com` or similar supplier | Flower order, not a client proposal |
| HoneyBook auto-emails ("Contract complete", "All signatures collected") | System-generated; confirm stage only, no new entry |
| Second HB calendar entry for a name already in any list | Duplicate (confirmed cases: Suzy Malone, Natalie Leone, Kellie Cronin, Olivia Hardy) |
| Forward to `drhellman@gmail.com` | Operational note; extract info, no new entry |
| Subject "Regretfully Unavailable" / body "not available on your wedding date" | Decline; remove from Cal Only if present |

---

## Judgment calls

**Real lead vs noise in outbound scan.** If Susan replied warmly and scheduled a call/visit → real, add to Gmail Only. If one-line "thanks, we're booked" → skip.

**Repeat / corporate / non-wedding clients.** `GMAIL_ONLY` is terminal for Bryant University, Union Club, PMC, Judy DeFusco (baby shower), Deadra Doku-Gardner (party), Danielle Tata (Heavy Hitters), Allison Thomas, etc. These never move to HB because Susan doesn't use HB for repeat/non-wedding work. Don't flag as stale. Don't try to move them.

**Null-date backfill.** When a client reaches Retainer Paid or higher with `date: null`, add to pending items. Next refresh's Step 1a (pending-item targeted reads) handles it: `(to:EMAIL OR from:EMAIL) after:SCAN_AFTER` extracts date/venue/details from recent activity. If the SCAN_AFTER window doesn't reach the original date-bearing message (uncommon), promote to a one-off full-thread read for that client only.

**Scheduled calls and studio visits.** When notes contain a specific date ("call week of Apr 20", "studio visit May 28 4:30 PM"), treat as a self-closing pending item: at the first refresh after the date, confirm outcome via Gmail thread or drop the pending flag.

**CAL_ONLY_GCAL_LINKS stale entries.** When a Cal Only client is removed and later re-added with a new ID, check for an old link under the same name in `CAL_ONLY_GCAL_LINKS` and remove it.

**Cal Only → Pipeline URL migration.** When promoting a client from Cal Only to HB Pipeline, the gcal URL must be **moved** (not dropped) from `CAL_ONLY_GCAL_LINKS` into `CAL_LINKS` under the same client name. The rendering logic falls back to `CAL_ONLY_GCAL_LINKS` only for `type==='cal'` rows — once a client is Pipeline, the card reads `CAL_LINKS` exclusively, so a missed migration leaves the Calendar button invisible with no error. Christina Maheras (promoted Refresh #15, caught Apr 19) is the known failure. Include the `CAL_LINKS` insertion alphabetically-sorted in the same `str_replace` batch as the other promotion edits. **Always verify both: (a) URL inserted in CAL_LINKS, (b) old entry removed from CAL_ONLY_GCAL_LINKS.** Step 4's link-map check is the last line of defense.

**Third-party-via-client coordination (Jean/Soucy pattern).** A tracked pipeline client (Paige Soucy) may coordinate a *separate* proposal for a third party (Jean's 9/18/26 rehearsal dinner) through their own Gmail thread. Rule: do **not** create a new Gmail Only entry until Susan actually sends the third party's proposal. Until then, annotate the coordinating client's notes field with a brief pointer. Once the proposal goes out, create the third-party as a proper Gmail Only (or Cal Only, if HB inquiry is created).

**Zapier fires Follow-up but Susan declines same-day.** When a new inquiry moves Inquiry → Follow-up via [HB Update] but Susan sends "Regretfully Unavailable" within hours, the net effect is a decline, not a pipeline entry. Remove from Cal Only if present, do not promote to HB Pipeline, document in changelog. Melanie Guerra (Apr 21) is the canonical case.

**Vendor-on-chain emails (Soulyco / MTH-Marketing pattern).** Sometimes Boathouse is CC'd on a thread by another wedding vendor (stationer, planner's assistant, AV/lighting coordinator) about logistics for a *tracked* client's event. These vendors are **not** Boathouse clients — do not create their own entries. Fold the email into the affected client's narrative timeline as a `gmail-in` entry and note the vendor + their role briefly. Distinguish from the Jean/Soucy pattern: Jean is a prospective *client* the existing client is referring; Soulyco/MTH are vendors on the same event.

**Org-cancelled events (Hannah Loewen pattern).** When a client confirms via Gmail that their organization has cancelled an event, HoneyBook may not be archived immediately by Susan. Apply a `⚠ CANCELLED [date]` flag in notes + add a `gmail-in` cancellation entry, but do not move the entry to `HB_ARCHIVED` in the same refresh — the next reverse-diff (Step 1.5) will catch it once Susan archives in HB. Flag in pending items so you can verify the archive moves through within 1–2 refreshes; if it doesn't, manually archive.

**Signature-empty contract failure mode (Abby Greene pattern).** For multi-party contracts mediated by an external planner, 'contract sent' ≠ 'contract complete' even after weeks of silence — there's no Zapier signal because the HB project is on the planner's side, not Susan's. **Generalizable rule:** for any contract that flows through a planner with no Zapier `_PROPOSAL_SIGNED_` event, treat the absence of a signal beyond ~7 days as a possible signature-routing failure, not as 'still being signed'. Add to the pending-items watch when relevant.

**Repurpose-question silence pattern (Caroline Barrett, confirmed #58).** When a client asks an operational question 4-7 days before a wedding and Susan's reply is warm but doesn't address the specific question, the question is usually resolved by phone, in person at delivery, or implicitly. This is the normal mode, not a failure mode. Do not flag these as unresolved unless the wedding date passes and there's an indication something actually went wrong.

**Cluster-archival pattern (3+ CAL_ONLY in one refresh, new #58).** When 3+ CAL_ONLY entries archive simultaneously in a short-gap refresh, it's almost certainly an explicit cleanup pass by Susan or David, not coincidence. Document the names in changelog and treat as routine — no individual case-by-case investigation needed unless one of the names has recent Gmail activity that contradicts the archival.

---

## Ad-hoc archival review (not part of the refresh)

When Cal Only feels bloated or the calendar is cluttered with dormant inquiries, run the archival filter to produce a **HoneyBook to-do list** — not an app-edit list.

```bash
python3 /home/claude/bhb/archive_filter.py /home/claude/index.html
```

The filter emits candidates grouped by four rules (Rule A through D). Give the output to Susan or David, who opens each HB project and archives it in HoneyBook. The next refresh's reverse calendar diff (Step 1.5) detects the archival and moves those entries into `HB_ARCHIVED` automatically.

---

## `str_replace` tips

Use enough surrounding context (adjacent lines or full object) to make the match unique. After any successful `str_replace`, previous `view` output for that file is stale — re-view before further edits.

---

## Appendix: Recovery patterns

**Mid-refresh Continue.** Re-fetch `https://bhb-david.github.io/boathouse-blooms` to confirm no deploy happened since the pause. The in-progress `/home/claude/index.html` already has the edits — keep using it. Don't re-copy from `/mnt/project/index.html`.

**Fresh session, no upload.** Ask the user to upload the current `index.html`, or fetch the latest commit page:
```
https://github.com/BHB-David/boathouse-blooms/commits/main  → pick latest commit
https://github.com/BHB-David/boathouse-blooms/commit/<SHA>  → shows the diff
```

**Base file looks wrong (stale DOM).** If it references `statHB`/`statGmail`/`statCal`/`statShowing`, the stat-grid was removed in Refresh #38 — fetch from GitHub instead.
