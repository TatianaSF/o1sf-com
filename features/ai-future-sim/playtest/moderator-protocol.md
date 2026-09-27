# Founder v1 moderator protocol

## Purpose

Observe how a first-time participant understands and experiences the frozen Founder v1 scenario. The moderator records what the participant notices and predicts; the moderator does not teach the simulation.

Run five independent sessions, one participant per session. Participants should not have played Founder v1 or discussed its content with another participant. Use anonymous IDs `participant_01` through `participant_05`. Collect no names, contact information, demographics, or other personal information.

## Before the session

- Copy the assigned JSON from `templates/` to `results/`.
- Start the local site using the repository's normal development workflow.
- Open exactly `/ai-future-sim`. Do not use `?playtest=1`, fixtures, debug panels, or diagnostics.
- Confirm the participant can see and operate the ordinary product route. Do not show this protocol, scenario source, balance report, canonical path fixtures, or prior participant notes.
- Take notes in the assigned JSON template. Do not record audio/video unless the participant has separately agreed; written notes are sufficient.

## Neutral opening script

> Thanks for trying this experience. I’m interested in what is clear or unclear as you use it. There are no right answers, and I’m evaluating the experience rather than you. Please say what you are noticing and thinking as you go. I may occasionally ask what you expected or what a message means to you. I won’t explain the simulation during the session. You can pause or stop at any time.

## During play

Let the participant start, select Founder and the mission, and continue through the experience at their own pace. Do not explain the engine, what any resource means, how options unlock, why a choice is locked, what a hidden consequence will be, or how endings are selected.

Use non-leading prompts only when the participant becomes quiet or asks what to do:

- “What are you noticing right now?”
- “What are you thinking about as you decide?”
- “What do you expect will happen if you choose that?”
- “What does that message mean to you?”
- “What, if anything, feels unclear?”
- “What would you like to do next?”

Do not praise, correct, suggest a choice, or paraphrase the participant's answer as if it were confirmed. Record their explanation before offering any clarification. Prefer not to clarify at all; if a technical issue prevents continuation, document the exact issue and keep it separate from gameplay feedback.

### At each decision stage

Record the selected stable choice ID, participant's stated reason, expected consequence, cost awareness and interpretation, whether locked options were noticed and understood, confusion, hesitation, spontaneous reaction, and sense of agency. Ask neutrally about a cost or lock only if the participant has not commented on it, and record the answer as prompted rather than spontaneous.

### When a lock appears

Before any moderator response, ask: “What do you think this message means?” Record the participant's own explanation verbatim when practical, otherwise as a clearly marked paraphrase. Classify the encountered lock as `CLEAR`, `PARTIALLY_CLEAR`, `CONFUSING`, or `FEELS_ARBITRARY`. Do not reveal the underlying condition.

### When a delayed consequence appears

Do not identify its source. Ask: “Does this connect to anything you remember choosing earlier?” Record the answer before asking any follow-up. Classify it as `IMMEDIATE_CONNECTION`, `CONNECTION_AFTER_READING`, `WEAK_CONNECTION`, or `NO_CONNECTION`; record whether the participant remembers the earlier choice and its stable ID if they name it.

### Before the ending explanation

When the Future World ending appears, do not direct attention to the explanation yet. Ask these questions in order and record both answers before the participant reads the product explanation:

1. “Why do you think you reached this future?”
2. “Which decisions do you think mattered most?”

Then allow the participant to read the product's “Why this future?” explanation without commentary. Ask: “How well does that explanation fit your understanding?” Record their explanation and classify comprehension as `STRONG`, `PARTIAL`, `WEAK`, or `RANDOM_FEELING`. Do not expose developer diagnostics.

### After the ending

Ask:

- “Would you play again?” Record `YES`, `MAYBE`, or `NO`.
- “Which decision, if any, would you change?” Record the participant's own choice or stable ID.
- “What do you expect would happen if you changed it?”
- “Would you rather restart or return directly to that decision?”

Then complete the end-of-session review in the participant file, including what kind of experience it felt like to them.

## Repeat-problem rule

- One participant showing a problem is an **observation**.
- Two independent participants showing the same problem is a **likely issue**.
- Three or more participants showing the same problem is a **strong candidate for change**.

Use the issue taxonomy `KEEP`, `COPY`, `UX`, `GAMEPLAY`, or `FOUNDER_V2`. A count is based on distinct participant IDs attached to the same explicitly assigned `issue_key`; do not merge issues based only on similar wording. The threshold is a review aid, not an automatic decision. Do not modify Founder v1 as part of this playtest.

## After the session

Set the file status to `COMPLETED` only when all session sections have been reviewed. Preserve null/blank answers as missing. Do not fill gaps from memory, diagnostics, or another participant. Aggregate only after all five sessions are complete, or label the interim aggregate clearly.
