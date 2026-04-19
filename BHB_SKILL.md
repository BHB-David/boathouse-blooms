---
name: bhb-refresh
description: "Use this skill whenever the user says 'refresh', 'run a refresh', or asks to update the Boathouse Blooms proposal reconciliation app. Contains the complete protocol for scanning Gmail (outbound + inbound), Google Calendar (bidirectional diff), and Zapier [HB Update] emails. The app mirrors HoneyBook — entries archived in HB are auto-detected via reverse calendar diff and moved to HB_ARCHIVED. Also carries forward the pending-items state so Claude orients instantly."
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

Single `index.html` file. All data is hardcoded JS arrays. No server, no build step.

---

## Current state

| Item | Value |
|---|---|
| Last refresh | #45 — Apr 18, 2026, 3:30 PM ET |
| Counts | HB Pipeline: 49 · Gmail Only: 17 · Cal Only: 36 · HB Archived: 20 |
| Last scan cutoff | `2026/04/18` (use as `after:` date) |

**Pending items** (check at next refresh):
- Tessa Bednarz (`tessa.colby27@gmail.com`) — Susan was to send updated proposal Apr 17; still no signal as of Apr 18. Check for send + response.
- Katie Escano (`fridaywedding26@gmail.com`) — call scheduled week of Apr 20; check thread after the 20th.
- Jesha Stevens (`partnerships@jeshastevens.com`) — call scheduled Apr 20 at 2:30 PM; check for studio visit or proposal.
- Maddie Bovi (`maddiebovi21@gmail.com`) — new 2027-08-07 inquiry (Chatham Bars Inn) re-submitted after Susan declined her earlier 2027-04 date Apr 16. Monitor for Susan's response to the new date.
- Diann Crugnale, Sarah Checkosky — kept alive from Refresh #45's archive pass. If no engagement shows up, they'll re-surface on the next archival review.

*Scheduled-call/visit items auto-close: at the refresh after the scheduled date, confirm outcome via Gmail thread or drop the pending flag.*

---

## Key constants

| Item | Value |
|---|---|
| Live URL | https://bhb-david.github.io/boathouse-blooms |
| Password hash | `-874608686` (password: `blooms2026`) |
| GitHub repo | `BHB-David/boathouse-blooms` · file `index.html` at root |
| Cloudflare Worker | `https://boathouse-proxy.david-9bd.workers.dev` |
| HB Calendar ID | `h4tmrcv18kkhts6g1a2401j5c4@group.calendar.google.com` |
| Gmail account | `boathouseblooms@gmail.com` |

**ID equivalence:** an HB calendar event's `id` and the HoneyBook project ID are the **same 24-char hex string**. A Cal Only entry's `hbEventId` becomes the ID inside `HB_LINKS` when the client moves to pipeline.

---

## Working base rule

> **The live file is truth.** Never use `/mnt/project/index.html` — it's a stale snapshot. Start every refresh by `web_fetch`ing https://bhb-david.github.io/boathouse-blooms to confirm counts. For the source file, use the user's upload or fetch the latest commit diff from `https://github.com/BHB-David/boathouse-blooms/commits/main` → commit page. `web_fetch` on the live URL returns stripped text — good for count verification, not as a file base.

---

## Deploy command (never the in-app Redeploy button)

```bash
cp ~/Downloads/index.html ~/Desktop/github-boathouse/index.html
cd ~/Desktop/github-boathouse
git add index.html && git commit -m "Refresh #N — description" && git push origin main --force
```

`--force` is always required; the in-app button causes divergence.

---

## The refresh protocol

### Step 0 — Fetch live deployment, confirm counts, copy base

```
web_fetch: https://bhb-david.github.io/boathouse-blooms
cp [uploaded_file_or_github_fetch] /home/claude/index.html
```

### Step 1 — Run all four scans in parallel

Fire all four simultaneously; don't wait.

**A. Zapier [HB Update] scan** — Gmail search `subject:[HB Update] after:LAST_SCAN_DATE`

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

**B. Gmail outbound scan** — `from:boathouseblooms@gmail.com (proposal OR pricing OR floral OR flowers OR invoice) after:LAST_SCAN_DATE maxResults:15`

Look for: new proposals (→ Gmail Only), deposit confirmations / "I received your deposit" / "You are in my book" (→ Retainer Paid), "Regretfully Unavailable" or "not available on your wedding date" (→ remove/skip), full-payment invoices (`X of X` → confirm Planning), forwards to `drhellman@gmail.com` (operational notes, extract info only).

**C. Gmail inbound scan** — `to:boathouseblooms@gmail.com after:LAST_SCAN_DATE -from:(honeybook.com OR noreply) maxResults:20`

Critical for: event dates and venues that clients state in replies (not in Susan's outbound), acceptance confirmations, decline-to-book, deposit/payment confirmations from client side. *This is the scan that catches what the outbound-only scan misses — e.g. Arianna's Jul 16 2027 date that stayed null for multiple refreshes.*

**D. HB Calendar scan** — `gcal_list_events` with the HB calendar ID, startTime today, endTime 2027-12-31, pageSize 250.

`orderBy: lastModified` does **not** filter — don't bother with it.

Response parsing:
```python
raw = json.load(sys.stdin)
inner = json.loads(raw[0]['text'])
events = inner.get('events', [])
```

**The calendar is truth.** Run the diff in both directions:

```bash
# All IDs currently on the HB calendar (from the MCP response)
sort -u /tmp/cal_ids.txt > /tmp/cal_now.txt

# All IDs referenced anywhere in the app
grep -oP '[0-9a-f]{24}' /home/claude/index.html | sort -u > /tmp/app_ids.txt

# Forward diff: on calendar, not in app → potential new entry
comm -23 /tmp/cal_now.txt /tmp/app_ids.txt > /tmp/ids_new.txt

# Reverse diff: in app, not on calendar → HoneyBook archived it
comm -23 /tmp/app_ids.txt /tmp/cal_now.txt > /tmp/ids_archived.txt
```

The broad grep catches IDs in `hbEventId`, `HB_LINKS` URLs, and `CAL_ONLY_GCAL_LINKS` eids — the narrow version (hbEventId only) produces false "new" results.

For each ID in `/tmp/ids_archived.txt`, resolve it to a client name: look it up in `CAL_ONLY` (hbEventId field) or `HB_LINKS` (URL contains the ID). The resolution tells Claude which array the entry lives in.

### Step 1.5 — Handle archived IDs (reverse-diff results)

HoneyBook archival is a stage that can **only** be detected via absence from the calendar — but absence has **two possible causes** that the skill must disambiguate:

1. **HoneyBook archived it.** Client is truly gone from the calendar → move to `HB_ARCHIVED`.
2. **The event already happened.** The HB calendar only shows future events, so any entry whose `date` is past will naturally fall off after the event occurs. This is **not** archival — it's a completed (or near-completed) wedding.

The skill distinguishes these by checking the entry's `date` field before deciding. Branch table:

| Resolved from | Entry `date` | Current stage | Action |
|---|---|---|---|
| `CAL_ONLY` | future | n/a | **Auto-move** to `HB_ARCHIVED` with `source:"CAL_ONLY"`; remove from `CAL_ONLY` + `CAL_ONLY_GCAL_LINKS` |
| `CAL_ONLY` | past | n/a | **Flag for review** — an inquiry-only entry whose date passed is unusual (normally Cal Only entries either progress to Pipeline or get archived before the event). Confirm with user. |
| `HB_PIPELINE` | future | Inquiry, Follow-up, Questionnaire | **Auto-move** to `HB_ARCHIVED` with `source:"HB_PIPELINE"`; remove from `HB_PIPELINE`, `HB_LINKS`, `CAL_LINKS`, `GMAIL_THREADS` |
| `HB_PIPELINE` | future | Proposal Sent, Proposal Signed, Retainer Paid, Planning | **Flag for review** — surface as `⚠️ <stage> client <n> vanished from calendar; confirm archive or investigate` — do NOT move until user confirms |
| `HB_PIPELINE` | past | Inquiry, Follow-up, Questionnaire, Proposal Sent, Proposal Signed, Retainer Paid, Planning | **Auto-promote stage to Completed** — wedding happened, HB calendar dropped the past event naturally. Update `notes` with "Wedding completed · HB calendar entry auto-dropped (detected via reverse diff DATE)". No array move; stays in `HB_PIPELINE`. |
| `HB_PIPELINE` | past | Completed | **Ignore** — already Completed, calendar naturally dropped past event. No action needed. |
| `HB_PIPELINE` | null | any | **Flag for review** — can't determine past vs future without a date. Ask user. |

Entries moved to `HB_ARCHIVED` carry forward their full context. Shape:

```js
{name:"...", email:"...", date:"YYYY-MM-DD", hbEventId:"...",
 archivedAt:"YYYY-MM-DD",            // refresh date of detection
 source:"CAL_ONLY" | "HB_PIPELINE",
 prevStage:"..." | null,              // stage before archival (pipeline only)
 notes:"..."}                          // original notes + any archive context
```

**Why the past-date rule matters:** this edge case appeared in the first real reverse-diff refresh (Refresh #45). Three Retainer Paid / Proposal Signed pipeline clients whose weddings had just occurred (Cara Goudy 3/28, Molly Murphy 4/4, Jamie Menn 4/4) appeared in the reverse diff because their calendar entries had rolled off naturally. Without the past-date check, the skill would have flagged them as suspicious archival — or worse, auto-archived them. Always check `date` first.

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
| Outbound proposal, new client | Add to `GMAIL_ONLY` |
| Outbound "Regretfully Unavailable" / decline | Remove from Cal Only if present; don't add if new |
| Inbound confirmation of date/venue for existing entry | Update `date` + `notes` |
| New calendar ID (not a duplicate, not a dead test) | Add to `CAL_ONLY` |
| Null-date pipeline client | Run `to:EMAIL OR from:EMAIL` thread search; extract date/venue/details from history |

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
| `CAL_LINKS` | `"Name": "<gcal URL>"` (pipeline clients) |
| `CAL_ONLY_GCAL_LINKS` | `"Name": "<gcal URL>"` (Cal Only clients) |

`hbCal:true` in `GMAIL_ONLY` = client also has an HB calendar Inquiry. Gmail Only is the operative state because the proposal is the meaningful action.

`HB_ARCHIVED` is populated only by the reverse-diff logic in Step 1.5. Hidden from the default UI; revealed by clicking the "📦 HB Archived" filter button. Preserves historical record without cluttering active work. Entries never leave `HB_ARCHIVED` once placed — archived means archived.

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
# Count coherence: the Ns must match the actual array lengths
python3 -c "
import re
c = open('/home/claude/index.html').read()
def count(name):
    m = re.search(rf'const {name}\s*=\s*\[(.*?)^\]', c, re.DOTALL|re.MULTILINE)
    return m.group(1).count('{name:') + m.group(1).count('{client:') if m else 0
print('HB_PIPELINE:', count('HB_PIPELINE'))
print('GMAIL_ONLY:', count('GMAIL_ONLY'))
print('CAL_ONLY:', count('CAL_ONLY'))
print('HB_ARCHIVED:', count('HB_ARCHIVED'))
"

# Syntax check (mandatory)
python3 -c "
import re, subprocess
content = open('/home/claude/index.html').read()
scripts = re.findall(r'<script>(.*?)</script>', content, re.DOTALL)
ok = True
for i, s in enumerate(scripts):
    open('/tmp/check.js','w').write(s)
    r = subprocess.run(['node','--check','/tmp/check.js'], capture_output=True, text=True)
    if r.returncode: print(f'Script {i} ERROR: {r.stderr.strip()}'); ok = False
    else: print(f'Script {i}: OK')
print('ALL CLEAR' if ok else 'FIX ERRORS')
"

# Link-map coverage check — catches Cal Only → Pipeline URL migration failures
# (Rendering falls back to CAL_ONLY_GCAL_LINKS only for type==='cal' rows, so a
# missed CAL_LINKS insert leaves the Calendar button silently invisible.)
python3 -c "
import re
c = open('/home/claude/index.html').read()
def names(arr, key):
    m = re.search(rf'const {arr}\s*=\s*\[(.*?)^\];', c, re.DOTALL|re.MULTILINE)
    return set(re.findall(rf'{key}:\"([^\"]+)\"', m.group(1))) if m else set()
def keys(obj):
    m = re.search(rf'const {obj}\s*=\s*\{{(.*?)^\}};', c, re.DOTALL|re.MULTILINE)
    return set(re.findall(r'^\s*\"([^\"]+)\":', m.group(1), re.MULTILINE)) if m else set()
pipeline = names('HB_PIPELINE','name')
cal_only = names('CAL_ONLY','name')
cal_links = keys('CAL_LINKS')
cal_only_gcal = keys('CAL_ONLY_GCAL_LINKS')
# Pipeline clients missing a CAL_LINKS entry (informational — not all Pipeline clients have a gcal URL)
pipe_no_cal = pipeline - cal_links
# Cal Only clients missing a CAL_ONLY_GCAL_LINKS entry (should be empty; every Cal Only has an event)
cal_no_gcal = cal_only - cal_only_gcal
# CAL_LINKS entries orphaned (not a current pipeline client → stale)
stale_cal = cal_links - pipeline
# CAL_ONLY_GCAL_LINKS entries orphaned (not a current Cal Only client → stale, likely from promotion)
stale_gcal = cal_only_gcal - cal_only
print(f'Pipeline clients w/o CAL_LINKS ({len(pipe_no_cal)}):', sorted(pipe_no_cal))
print(f'Cal Only clients w/o gcal link ({len(cal_no_gcal)}):', sorted(cal_no_gcal))
print(f'Stale CAL_LINKS entries ({len(stale_cal)}):', sorted(stale_cal))
print(f'Stale CAL_ONLY_GCAL_LINKS entries ({len(stale_gcal)}):', sorted(stale_gcal))
"
```

**Reading the link-map output:**
- `pipe_no_cal` — non-empty is expected (Pipeline clients without an HB calendar entry: e.g. Completed weddings, or `GMAIL_ONLY` promotions where Susan never created a calendar entry). **Red flag:** any client that appeared in this refresh's Cal Only → Pipeline promotions. That means the gcal URL was dropped.
- `cal_no_gcal` — should be zero. Every Cal Only entry was discovered via the HB calendar and has an eid.
- `stale_cal` / `stale_gcal` — should be zero. Non-zero means a client was removed from the data array but their link-map entry wasn't cleaned up.

Fix any failures before proceeding.

### Step 5 — Output and summarise

```bash
cp /home/claude/index.html /mnt/user-data/outputs/index.html
```

Present file, then: summary table of changes, archival decisions made, updated pending-items list, deploy command with refresh number.

---

## Skip list

Apply at ingestion — these never create entries.

| Pattern | Reason |
|---|---|
| `[HB Update] David Hellman →` | Internal HB test project |
| To `cutflowers@quinlanwasserman.com` or similar supplier | Flower order, not a client proposal |
| HoneyBook auto-emails ("Contract complete", "All signatures collected") | System-generated; confirm stage only, no new entry |
| Second HB calendar entry for a name already in any list | Duplicate (confirmed cases: Suzy Malone, Natalie Leone, Kellie Cronin) |
| Forward to `drhellman@gmail.com` | Operational note; extract info, no new entry |
| Subject "Regretfully Unavailable" / body "not available on your wedding date" | Decline; remove from Cal Only if present |

---

## Judgment calls

**Real lead vs noise in outbound scan.** If Susan replied warmly and scheduled a call/visit → real, add to Gmail Only. If one-line "thanks, we're booked" → skip.

**Repeat / corporate / non-wedding clients.** `GMAIL_ONLY` is terminal for Bryant University, Union Club, PMC, Judy DeFusco (baby shower), Deadra Doku-Gardner (party), Danielle Tata (Heavy Hitters), Allison Thomas, etc. These never move to HB because Susan doesn't use HB for repeat/non-wedding work. Don't flag as stale. Don't try to move them.

**Null-date backfill.** When a client reaches Retainer Paid or higher with `date: null`, add to pending items. Next refresh: targeted `to:EMAIL OR from:EMAIL` search for the full thread; extract event date/venue/details the outbound keyword scan missed. (Root cause of Arianna's date staying TBD across refreshes.)

**Scheduled calls and studio visits.** When notes contain a specific date ("call week of Apr 20", "studio visit May 28 4:30 PM"), treat as a self-closing pending item: at the first refresh after the date, confirm outcome via Gmail thread or drop the pending flag.

**CAL_ONLY_GCAL_LINKS stale entries.** When a Cal Only client is removed and later re-added with a new ID (e.g. Samantha Sieger), check for an old link under the same name in `CAL_ONLY_GCAL_LINKS` and remove it.

**Cal Only → Pipeline URL migration.** When promoting a client from Cal Only to HB Pipeline, the gcal URL must be **moved** (not dropped) from `CAL_ONLY_GCAL_LINKS` into `CAL_LINKS` under the same client name. The rendering logic falls back to `CAL_ONLY_GCAL_LINKS` only for `type==='cal'` rows — once a client is Pipeline, the card reads `CAL_LINKS` exclusively, so a missed migration leaves the Calendar button invisible with no error. The only surfacing is via manual spot-checks. Christina Maheras (promoted Refresh #15, caught Apr 19) is the known failure. Include the `CAL_LINKS` insertion alphabetically-sorted in the same `str_replace` batch as the other promotion edits.

---

## Ad-hoc archival review (not part of the refresh)

When Cal Only feels bloated or the calendar is cluttered with dormant inquiries, run the archival filter to produce a **HoneyBook to-do list** — not an app-edit list.

```bash
python3 /home/claude/bhb/archive_filter.py /home/claude/index.html
```

The filter emits candidates grouped by four rules:

| Rule | Trigger | Meaning |
|---|---|---|
| A | Cal Only with `date` > 30 days past | Event already happened, never progressed |
| B | Cal Only, event within 120 days, no Gmail thread and no changelog mention >90 days | Cold inquiry, wedding approaching with no engagement |
| C | Pipeline stage ∈ {Inquiry, Follow-up, Questionnaire} with past date OR no contact >120 days | Ghosted early-stage pipeline |
| D | Pipeline stage = Completed with date >60 days past OR null date | Finished jobs cluttering HB |

**What to do with the output:** give it to Susan or David, who opens each HB project and archives it in HoneyBook. The next refresh's reverse calendar diff (Step 1.5) detects the archival and moves those entries into `HB_ARCHIVED` automatically. **Claude does not edit the app based on the filter output** — the calendar is truth; the app mirrors what HoneyBook does.

Rule D candidates are a special case: Completed projects aren't on the calendar anyway, so archiving them in HB has no mirror effect on the app. They're flagged purely so Susan can keep HB itself tidy.

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
