# Language boundary

Production is English only. Do not add Russian copy, locale detection, public locale routes, query-string language switching, or language controls. `config/language.js` resolves to English by default; Russian can be resolved only when internal code explicitly passes `mode: "manual_development"` and `developmentLanguage: "ru"`. This configuration is not connected to production UI or routing. No Russian content is included.
