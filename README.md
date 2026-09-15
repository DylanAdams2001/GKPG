# Golden Key Property

The public website and marketing funnels for Golden Key Property, a trading
name of Asbach Enterprises Ltd (company number 16016190).

Served by GitHub Pages from the root of this repository at
**www.goldenkeypropertyco.com**. Every tracked file is publicly reachable at
its own path, so nothing private belongs in here.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | Homepage |
| `hong-kong.html`, `singapore.html` | Direct-to-offer landing pages |
| `hong-kong-resource.html`, `singapore-resource.html` | Lead magnet delivery pages |
| `booking.html`, `booking-confirmation.html` | Call booking for the direct funnel |
| `uk-workshop.html` | UK workshop registration, the split test against direct-to-offer |
| `uk-workshop-confirmation.html` | Holding page. Counts down to the session, then hands over |
| `uk-workshop-live.html` | The workshop room itself: player, one-way chat, watch tracking |
| `uk-workshop-booking.html` | Call booking for workshop attendees |
| `reservation-agreement.html` | Reservation paperwork |
| `styles.css` | Shared design system for every page |
| `images/` | Photography used by the pages |
| `ad-creative/` | Finished ad creative, by market |
| `ad-templates/`, `brand/` | Source artwork and brand assets |
| `GHL-AUTOMATION-SPEC.md` | How the pages talk to GoHighLevel and Meta. Read before changing either |
| `working-files/` | Local only, never committed. Source documents, archives, design references |

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
cent. `GHL-AUTOMATION-SPEC.md` has the payloads and the workflows they drive.

## Before the real recording goes in

Two markers in `uk-workshop-live.html` are both commented `TEMPORARY`:

- the stand-in Tella video in `WORKSHOP_SRC`
- `WORKSHOP_SECONDS`, currently `90` to match it, to be put back to `30 * 60`

Three `PLACEHOLDER` entries in `HOST_MESSAGES` also need real copy timed to the
recording.
