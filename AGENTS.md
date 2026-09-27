# Project Instructions

## TatianaSF Linking

- Every visible `TatianaSF` text on the site should link to `https://www.google.com/search?q=TatianaSF`.
- Prefer the shared `TatianaLink` or `TatianaText` components instead of hand-writing the URL in page components.
- Metadata, JSON-LD, manifests, and machine-readable feeds may keep `TatianaSF` as plain text when HTML links are not valid.

## AI Future Sim

- The public route is `/ai-future-sim`.
- English (`en`) is always the default production language. Russian must never appear in normal production UI; do not add Russian content, production navigation, language URLs, settings, automatic locale detection, or user-facing language controls. A future Russian development mode may only be activated by an explicit manual launch/configuration mechanism.
- Keep product code isolated in `features/ai-future-sim/` whenever practical. The route in `app/ai-future-sim/` must stay thin and only mount feature UI.
- Game content must be data-driven. Keep the game engine independent from presentation components, and keep core game rules out of UI components.
- Analytics is a first-class product subsystem. Add a consistently named analytics event for every meaningful product interaction; do not use Google Analytics as the primary AI Future Sim product analytics system.
- AI Future Sim runtime must remain fully precomputed and deterministic. Never call, embed, or depend on an LLM or generative model at runtime; all scenarios, choices, consequences, insights, events, and endings must be authored before production and validated through `npm run validate:ai-future-sim`.
- Cloudflare D1 is the primary structured persistence layer for this product. Reserve R2 for media/assets when required. Put the Worker/API boundary in `cloudflare/ai-future-sim-api/` and keep database changes in versioned migrations.
- Do not modify unrelated O1SF.com behavior. Every milestone must leave the repository runnable and buildable.
