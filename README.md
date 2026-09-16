# Golden Key Property

The public website and marketing funnels for Golden Key Property, a trading
name of Asbach Enterprises Ltd (company number 16016190).

Served by GitHub Pages from the root of this repository at
**www.goldenkeypropertyco.com**. Every tracked file is publicly reachable at
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

Watch progress is measured as *visible* time on the page, so a backgrounded tab
does not accrue, and is posted to GoHighLevel as tags at 25 / 50 / 75 / 100 per
cent. `docs/GHL-AUTOMATION-SPEC.md` has the payloads and the workflows they drive.

## Before the real recording goes in

Two markers in `uk-workshop/live.html` are both commented `TEMPORARY`:

- the stand-in Tella video in `WORKSHOP_SRC`
- `WORKSHOP_SECONDS`, currently `90` to match it, to be put back to `30 * 60`

Three `PLACEHOLDER` entries in `HOST_MESSAGES` also need real copy timed to the
recording.

## Loose ends

- `styles.css` is not referenced by any page. Every page carries its own inline
  styles instead. It is kept for reference, not served.
- `images/guide-consultant.jpg` is not used by any page.
- The workshop companion guide carries `CONFIRM` and `PLACEHOLDER` markers for
  figures and terms only Oliver can supply. Search the file for them before it
  goes out; they are styled amber so they are impossible to miss on screen.
