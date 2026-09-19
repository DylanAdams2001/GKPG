# Golden Key Property

The public website and marketing funnels for Golden Key Property, a trading
name of Asbach Enterprises Ltd (company number 16016190).

Served by GitHub Pages from the root of this repository at
**www.gkpg.co.uk**. Every tracked file is publicly reachable at
its own path, so nothing private belongs in here.

## Layout

One folder per funnel. Each folder's `index.html` is the entry page, so the
folder name is the public URL: `hong-kong/index.html` is served at
`/hong-kong/`.

| Path | URL | What it is |
| --- | --- | --- |
| `index.html` | `/` | Homepage |
| `hong-kong/index.html` | `/hong-kong/` | Hong Kong direct-to-offer landing page |
| `hong-kong/resource.html` | `/hong-kong/resource.html` | Hong Kong lead magnet delivery |
| `singapore/index.html` | `/singapore/` | Singapore direct-to-offer landing page |
| `singapore/resource.html` | `/singapore/resource.html` | Singapore lead magnet delivery |
| `booking/index.html` | `/booking/` | Call booking, shared by both direct funnels |
| `booking/confirmation.html` | `/booking/confirmation.html` | Booking confirmation |
| `uk-workshop/index.html` | `/uk-workshop/` | Workshop registration, the split test against direct-to-offer |
| `uk-workshop/confirmation.html` | `/uk-workshop/confirmation.html` | Holding page. Counts down to the session, then hands over |
| `uk-workshop/live.html` | `/uk-workshop/live.html` | The workshop room itself: player, one-way chat, watch tracking |
| `uk-workshop/booking.html` | `/uk-workshop/booking.html` | Call booking for workshop attendees |
| `uk-workshop/resource.html` | `/uk-workshop/resource` | Workshop companion guide. Sent to attendees who reach `watched-complete` |
| `uk-workshop/calculator.html` | `/uk-workshop/calculator` | Investor calculator. Sent to attendees alongside the guide |
| `uk-workshop/recap.html` | `/uk-workshop/recap` | The short version, for people who left the room early. Tags the contact `recap-opened` when reached from the email |
| `uk-workshop/workbook.pdf` | `/uk-workshop/workbook.pdf` | The fill-in workbook. Downloadable from the confirmation and live pages, and linked from the opt-in email |
| `uk-workshop/watch.html` | `/uk-workshop/watch` | The workshop on-demand, for people who never made it into a live session. No countdown, no live badge, no simulated chat — just the recording, with normal player controls. Runs the same watch tags as the room |
| `uk-workshop/video.js` | `/uk-workshop/video.js` | The recording's Wistia media ID, poster and runtime. Read by both `live.html` and `watch.html`, so the video is only ever pointed at from one place |
| `reservation-agreement.html` | `/reservation-agreement.html` | Reservation paperwork |

Supporting folders:

| Path | What it is |
| --- | --- |
| `images/` | Photography used by the pages |
| `icons/` | Favicons and the Apple touch icon (`favicon.ico` stays at the root, where browsers look for it) |
| `marketing/ad-creative/` | Finished ad creative, by market |
| `marketing/ad-templates/`, `marketing/brand/` | Source artwork and brand assets |
| `docs/GHL-AUTOMATION-SPEC.md` | How the pages talk to GoHighLevel and Meta. Read before changing either |
| `working-files/` | Local only, never committed. Source documents, archives, design references |

### Linking between pages

Pages now sit at different depths, so **every internal link and asset path is
root-relative** — `/images/hero-skyline.jpg`, not `images/hero-skyline.jpg`.
A relative path will break as soon as it is used from a page one folder down.

## The UK workshop funnel

Sessions run just in time on the quarter hour. The registration page picks the
next slot and stores it; the confirmation page counts down to it; the live page
opens the player at the scheduled moment and autoplays.

Someone arriving after their start time is dropped into the session already in
progress rather than being handed a fresh countdown. Past ten minutes late, or
past the length of the session if that is shorter, a new session starts from the
beginning instead.

Watch progress is real playback, not time on the page, and is posted to
GoHighLevel as tags at 25 / 50 / 75 / 100 per cent. A backgrounded tab still
accrues nothing: the live room pauses the video on hide and resumes it on show,
so nobody inflates their progress and nobody misses content either. On
`watch.html`, which has a scrubber, played seconds are *accumulated* rather than
read off the playhead, so dragging to the end does not earn a
`watched-complete`. `docs/GHL-AUTOMATION-SPEC.md` has the payloads and the
workflows they drive.

## The recording

31:26, hosted on Wistia as `es2v424yt5` and pointed at from
`uk-workshop/video.js`. It is not in this repository and never can be: the
master is 3840x2160 HEVC at 1.02 GB, GitHub rejects any file over 100 MB, and a
committed video would block the push carrying everything else. `.gitignore`
blocks `*.mp4` and `*.mov` outright. HEVC also does not play in Firefox and only
conditionally in Chrome, so serving the master raw was never an option either —
Wistia re-encodes it and serves adaptive bitrate, so a viewer on a phone is not
pulling a 4K stream.

Both pages build their embed from the media ID, so a re-upload only needs the
new ID pasted into `video.js`. Runtime is read back from Wistia on load, so a
re-edit corrects itself and nothing downstream has to be told.

The live room switches **every Wistia control off individually** — no progress
bar, no play button, no settings, no quality picker — and lays a transparent
shield over the video so a stray click cannot pause it. That is the whole point:
player chrome is what gives away that a live session is a file. `watch.html`
keeps the full controls, because that page says out loud that it is a recording
and people arriving from the "you missed it" email want to skip to the numbers.

The chat feed in `HOST_MESSAGES` is timed against the delivered presenter
script, scaled from its ~34 minutes of section budgets to the real 31:26. It is
a starting point in Oliver's voice, meant to be edited — one array, one place.

## Loose ends

- `styles.css` is not referenced by any page. Every page carries its own inline
  styles instead. It is kept for reference, not served.
- `images/guide-consultant.jpg` is not used by any page.
- The recording tells viewers four times to put answers in the chat, and Oliver
  reads answers back. The room's chat takes typed messages so the prompt is not
  a dead end, but they are shown only to the person who typed them: no other
  attendee is ever simulated. Manufacturing an audience for an investment pitch
  is a line we do not cross, so the gap stays.
- `uk-workshop/recap.html` and the welcome video on `uk-workshop/confirmation.html`
  are still on the stand-in Tella embed. Both are separate, shorter cuts that do
  not exist yet, so neither takes the full workshop file.
- The workshop companion guide carries `CONFIRM` and `PLACEHOLDER` markers for
  figures and terms only Oliver can supply. Search the file for them before it
  goes out; they are styled amber so they are impossible to miss on screen.
