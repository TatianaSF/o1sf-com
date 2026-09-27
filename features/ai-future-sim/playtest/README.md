# Founder v1 human playtest package

This folder contains development-only materials for five independent, first-time participant sessions. It is not production content and contains no participant results by default.

## Run a session

1. Read `moderator-protocol.md` before the session.
2. Copy that participant's file from `templates/` to `results/` with the same filename.
3. Start the site using the existing local workflow and open `/ai-future-sim` with no query string.
4. Take notes in the copied JSON file. Keep unanswered fields `null` or empty; do not infer a response.
5. Set `status` to `COMPLETED` only when the session is complete.

Templates use stable scenario identifiers for recording. They do not include scenario answers, expected outcomes, or moderator hints.

For `replay.preference`, record `RESTART`, `RETURN_DIRECTLY`, `NO_PREFERENCE`, or `UNSURE`; leave it `null` if unanswered. Keep the participant's explanation in `expected_result_if_changed` or the relevant notes field.

For each encountered lock, append an object to that stage's `locked_options` with `choice_id`, `participant_explanation_before_clarification`, and `classification` (`CLEAR`, `PARTIALLY_CLEAR`, `CONFUSING`, or `FEELS_ARBITRARY`). For each revealed consequence, append an object to `delayed_consequences` with `consequence_id`, `revealed_level_id`, `origin_choice_id` if the participant names one, `remembered_origin_choice` (`true`, `false`, or `null`), `classification` (`IMMEDIATE_CONNECTION`, `CONNECTION_AFTER_READING`, `WEAK_CONNECTION`, or `NO_CONNECTION`), and `notes`.

Add issue objects only for observed issues. Each object should include `issue_key`, `participant_id`, `level_id`, `relevant_ids`, `observation`, `participant_quote`, `classification` (`KEEP`, `COPY`, `UX`, `GAMEPLAY`, or `FOUNDER_V2`), `severity` (`low`, `medium`, or `high`), and `participants_same_issue_count` left `null`. The aggregator calculates distinct participant counts by exact `issue_key`; it does not infer that two differently keyed observations are the same problem.

## Aggregate results

After sessions, run from the repository root:

```powershell
node features/ai-future-sim/playtest/aggregate.mjs
```

The script reads completed `results/participant_*.json` files and prints a deterministic Markdown summary. It excludes unanswered fields and never supplies missing feedback. Use `--input <directory>` to read another local results directory, or `--output <file>` to save the report. With no completed sessions, it prints an explicit empty state.

The report template is `Founder-v1-Human-Playtest-Report.md`. Do not record participant names, contact details, or other unnecessary personal information.

## Frozen scenario

This package is for `founder_ai_organization`, version `1`. Playtest findings are observations only. Apply the repeat-problem rule in the moderator protocol; no finding changes the scenario automatically.
