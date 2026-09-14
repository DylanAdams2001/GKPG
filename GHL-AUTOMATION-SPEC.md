# UK Workshop Funnel — GHL Automation Spec

Everything needed to build the GoHighLevel side of the UK workshop funnel.

## Pages

| Page | URL | Purpose |
|---|---|---|
| Registration | `/uk-workshop` | Opt-in form |
| Confirmation | `/uk-workshop-confirmation` | Countdown, welcome video, checklist, join button |
| Workshop room | `/uk-workshop-live` | The session: player, chat, engagement tracking |
| Booking | `/uk-workshop-booking` | Call calendar |

**Link people straight to the room, with the contact id appended:**

```
https://www.goldenkeypropertyco.com/uk-workshop-live?c={{contact.id}}
```

Without `?c=`, anyone arriving from an email is anonymous to the page and no
progress ping fires for them.

Paste the whole URL including the merge field into the link field in GHL's
email editor. Then send yourself a test and click it: the address bar should
show a real id. If it shows `{{contact.id}}` or `%7B%7Bcontact.id%7D%7D` the
merge did not resolve, and the page will ignore it rather than pass a bad
identifier to GHL.

### GHL build gotchas

- **Dynamic tags:** the Add Tag field has a hidden Standard/Dynamic toggle
  behind the three dot menu. Switch to Dynamic before the merge field is
  accepted.
- **Number fields:** a Number custom field rejects typed merge syntax. Insert
  through the merge picker instead.

## Identifiers

- **Meta pixel / dataset:** `1397390558441912`
- **Inbound webhook:** `https://services.leadconnectorhq.com/hooks/HEOut7IJQ2GxJIUq9qIb/webhook-trigger/66366cf1-032d-4417-bcf0-8c34466d24c3`
- **Workshop calendar:** `uxBRx9V87WyYV6BOr8Ac`

## Do not rebuild these

Built and in use. Leave in place:

- **Conversions API** (sub-workflow)
- **Booked Call — UK Workshop**
- **The email content inside Custom Webhook — Lead Capture**
- **Custom**

Two caveats, both fixable without rebuilding anything:

**The Conversions API actions currently map only FBCLID**, pointed at a
contact field that does not exist and that nothing writes to. So both
`CompleteRegistration` and `Schedule` go out with no click ID, no browser ID
and no `event_id`. That is a parameter mapping bug rather than a design
choice, and leaving it means the funnel cannot attribute a booked call back
to the ad that produced it. Add `event_id`, `fbc`, `fbp`, email and phone to
the existing actions. The workflows themselves stay as they are.

**The emails send six copies in two minutes.** Three email actions sit back
to back with no wait or branch between them, all carrying the subject "Your
workshop link". The copy is fine and stays. What needs changing is the
sequencing around it: one email on registration, the rest behind waits and
the `session_is_just_in_time` branch.

## The three payloads

**Each type has its own inbound webhook**, so a workflow can only ever receive
what it handles. The `type` field is still sent on every payload as a sanity
check and so the data is self describing, but it is no longer load bearing.

| Payload | Webhook |
|---|---|
| `workshop_registration` | ends `66366cf1` |
| `workshop_progress` | ends `42c95c56` |

Chat questions are not collected for this funnel. The live chat is a one way
feed with no input.

### 1. `workshop_registration`

Sent when the form is submitted.

| Field | Notes |
|---|---|
| `type` | `workshop_registration` |
| `first_name`, `last_name`, `email`, `phone` | Standard contact |
| `country`, `country_code` | From the phone field. Stops GHL defaulting to UK |
| `fbc` | **Meta click ID, formatted. Required for attribution** |
| `fbp` | **Meta browser ID. Required for attribution** |
| `fbclid` | Raw click ID, for GHL's native FBCLID field |
| `event_id` | **Deduplication. Required** |
| `user_agent` | Match quality |
| `session_choice` | e.g. `Today at 4:15 pm` |
| `session_time_iso` | ISO timestamp of the session |
| `session_is_just_in_time` | `true` = watching now, `false` = booked later |
| `marketing_consent` | Always `true`, form cannot submit without it |
| `consent_text` | The exact wording agreed to |
| `source` | `UK Workshop Funnel` |
| `market` | `United Kingdom` |
| `funnel_type` | `Workshop` |

### 2. `workshop_question`

Sent when a viewer types a question in the live chat. May fire several times
per contact.

`type` · `contact_id` · `question` · `first_name` · `email` · `source` · `asked_at`

### 3. `workshop_progress`

Sent each time a viewer passes a milestone. Up to five per contact, in order.
The `tag` is sent ready-made so the workflow just applies it, no branching
needed.

| `tag` | `percent` | Fires when |
|---|---|---|
| `watched-start` | 0 | Player opened |
| `watched-25` | 25 | A quarter watched |
| `watched-50` | 50 | Half watched |
| `watched-75` | 75 | Three quarters watched |
| `watched-complete` | 100 | Effectively finished |

Fields: `type` · `tag` · `percent` · `contact_id` · `email` · `first_name` ·
`seconds_watched` · `watched_at`

Measured on **visible** time, so a tab left open in the background does not
accumulate progress.

`type` · `contact_id` · `email` · `first_name` · `seconds_watched` · `watched_at`

## Custom fields to create

**Required** — without these, a call booked days later cannot be attributed
back to the ad:

- `fbc`
- `fbp`
- `event_id`

**Recommended:** `marketing_consent`, `consent_text`, `session_choice`,
`session_is_just_in_time`, `source`, `funnel_type`, `workshop_questions`

## Workflow 1 — Registration

**Trigger:** Inbound Webhook
**First action:** If/Else → `type` equals `workshop_registration`
Everything below sits on the YES branch.

1. Create / update contact, mapping all fields above
2. Add tag `uk-workshop`
3. **Meta Conversions API:** event `CompleteRegistration`, passing `event_id`,
   `fbc`, `fbp`, `email`, `phone`
4. If/Else on `session_is_just_in_time`:
   - **true** → send email A
   - **false** → send email B, then SMS C 15 minutes before `session_time_iso`
5. Wait 2 hours → if no appointment booked, send email D

## Workflow 2 — Booked call

**Trigger:** Appointment Booked, on calendar `uxBRx9V87WyYV6BOr8Ac`
No filter needed, the calendar is exclusive to this funnel.

**Meta Conversions API:** event `Schedule`, value `3950`, currency `USD`,
passing `fbc`, `fbp`, `email`, `phone` from the contact record.

Then: confirmation email + SMS, reminder 24h before, SMS 1h before, and a task
for Oliver due 1 hour before the call.

## Workflow 3 — Question asked

**Trigger:** Inbound Webhook
**Filter:** `type` equals `workshop_question`

Find contact by `contact_id`, append `question` to the `workshop_questions`
field, notify Oliver.

## Workflow 4 — Watch progress

**Trigger:** Inbound Webhook
**Filter:** `type` equals `workshop_progress`

Find contact by `contact_id`, then **add the tag from the payload** —
`{{inboundWebhookRequest.tag}}`. One action, no branching.

Contacts accumulate tags as they watch, so the furthest tag present is how
far they got.

### Branching the follow-up on it

| Tags present | Read | Send |
|---|---|---|
| none | Registered, never opened the room | "You missed it, here's the link" |
| `watched-start` only | Opened, left almost immediately | Re-engage, something put them off |
| up to `watched-25` / `watched-50` | Dropped part way | Address what comes after that point |
| `watched-75` or `watched-complete` | Saw the offer | Push the booking |

Those groups behave nothing alike. Sending them the same sequence is the
usual reason webinar follow-up underperforms.

## Meta events summary

| Event | Fired by | Notes |
|---|---|---|
| `PageView` | Page | All three pages |
| `ViewContent` | Page | Live room load, i.e. chose to attend |
| `WorkshopStart` | Page | Player opened |
| `Workshop25/50/75/Complete` | Page | Watched-time marks |
| `CompleteRegistration` | **GHL** | **Optimise the campaign on this** |
| `Schedule` | **GHL** | Value `3950` USD. Track, do not optimise on |

`Purchase` is deliberately not sent. The sales cycle runs 60 to 90 days, well
outside Meta's 7 day attribution window, so the event would arrive unattributed.
The expected value sits on `Schedule` instead.

## Testing

1. In a private window, register via `/uk-workshop?fbclid=test001`
2. Contact appears with `fbc`, `fbp` and `event_id` populated
3. Events Manager shows **one** `CompleteRegistration`, with `fbc`, `fbp` and
   `event_id` among the matched parameters
4. Wait out the countdown, click through to `/uk-workshop-live`, and leave the
   tab **in the foreground**. The tab must stay visible: progress runs on
   visible time
5. Contact collects `watched-start`, `watched-25`, `watched-50`, `watched-75`,
   `watched-complete`, and `watch_percent` reads `100`
6. Book a test call → `Schedule` arrives at `3950 USD`
7. Delete the test contact and cancel the appointment

`event_id` is generated unconditionally by the page, so if it is empty on the
contact the mapping is broken rather than the page. `fbc` and `fbp` can
legitimately be empty if the visit had no ad click or the pixel was blocked,
which is why step 1 uses a private window and a test click id.
