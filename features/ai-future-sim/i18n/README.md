# AI Future Sim localization

English remains the default. The only Russian activation is the hidden bare query flag `?ru` on `/ai-future-sim`; the client reads that explicit URL flag and does not inspect browser locale or `Accept-Language`. There is no language selector, separate route, or public navigation link.

Russian copy is authored in `ru.js` and keyed by stable scenario, role, mission, level, choice, consequence, ending, condition, resource, and world-state IDs. The localization layer changes presentation only; the engine always consumes the canonical English scenario data and produces the same deterministic state.

`validateLocaleCompleteness` is part of `npm run validate:ai-future-sim`. It rejects missing normal player-facing Russian copy. Developer diagnostics remain English and are exposed only by the existing development-only playtest gate. No runtime translation, LLM, or model dependency is used.
