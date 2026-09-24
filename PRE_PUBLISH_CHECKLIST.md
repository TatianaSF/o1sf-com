# O1SF — обязательные предупреждения перед публичной публикацией

## Статус документа

- **Назначение:** обязательный информационный checklist перед любой публикацией в интернете.
- **Источник требований:** `v3.1_DRAFT_o1sf_US_Market_Entry_Program_Knowledge_Base.txt` от 15 июля 2026 года.
- **Текущий статус базы знаний:** `DRAFT`.
- **Правило:** незакрытые пункты этого документа не блокируют публикацию автоматически. Перед каждой публикацией необходимо полностью прочитать checklist, зафиксировать все актуальные предупреждения в отчёте о публикации и продолжить публикацию, если нет отдельного статуса `BLOCKED`.
- **Ограничение:** этот документ не разрешает публиковать секреты, персональные данные, банковские реквизиты или иной контент, публикация которого нарушает закон, договорные обязательства либо правила безопасности платформы.

### Правило для design preview и production — с 15 июля 2026

- Design preview и production deployment разрешается выполнять при наличии незакрытых пунктов, если все актуальные предупреждения зафиксированы в отчёте о публикации.
- Наличие опубликованной страницы само по себе не означает официальный запуск программы, юридическое утверждение условий, открытие application flow или payment flow.
- Перед каждой новой публикацией, включая обновление уже доступного сайта, необходимо снова проверить предупреждения и перечислить их в отчёте. Отдельное подтверждение владельца для продолжения deployment не требуется.

> Каждый deployment через Sites считается публикацией и требует этой информационной проверки, даже если URL ещё не рекламируется.

## Завершённые авторские задачи — не повторять как content-writing check

- [x] Самостоятельно подготовлен публичный draft `Privacy & Security Baseline`.
- [x] Самостоятельно подготовлен публичный `Claims & Promises Standard`.
- [x] Самостоятельно подготовлены публичные `Participant Requirements`.
- [x] Все три документа встроены в закрытый preview сайта и связаны общей страницей `Program Standards`.

> По решению владельца проекта повторная проверка самого факта написания этих трёх материалов исключена из следующего check. Это **не** заменяет counsel approval, vendor/security review, настройку реальных процессов, проверку Evidence Registry и подписание документов участниками. Пока такие подтверждения отсутствуют, они показываются как предупреждения повышенного риска.

## Как использовать checklist

Перед публикацией необходимо:

1. Прочитать этот файл полностью.
2. Для каждого применимого пункта по возможности указать ответственного, подтверждение и статус.
3. Не считать устное предположение документальным подтверждением.
4. Составить краткий список всех незакрытых пунктов и связанных рисков.
5. Продолжить публикацию, если нет отдельного статуса `BLOCKED`.
6. В отчёте о публикации указать, что checklist проверен, перечислить оставшиеся предупреждения и итоговый статус.

Допустимые статусы:

- `WARNING` — подтверждение отсутствует или пункт ещё не закрыт; публикация разрешена, предупреждение обязательно перечисляется в отчёте;
- `IN REVIEW` — проверка продолжается; публикация разрешена, предупреждение обязательно перечисляется в отчёте;
- `APPROVED` — есть проверяемое подтверждение;
- `NOT APPLICABLE` — указано письменное обоснование.

Незаполненный checkbox (`[ ]`) автоматически считается статусом `WARNING`. Наличие `WARNING` или `IN REVIEW` не останавливает deployment и не требует отдельного подтверждения владельца на эту публикацию. Такие пункты должны быть явно перечислены в отчёте о публикации. Публикацию останавливает только явный статус `BLOCKED` либо отдельное нарушение безопасности, закона, договорных обязательств или правил платформы.

## 1. Юридическое лицо и бренд

- [ ] Точное юридическое наименование `OpenAISF Inc.` сверено с Certificate of Incorporation и актуальными корпоративными документами.
- [ ] Подтверждены business address и authorized signer.
- [ ] Утверждены official program, billing, refund, legal-notice и emergency contact channels.
- [ ] Завершена проверка названия и товарных знаков.
- [ ] Публичные материалы не создают впечатление аффилированности с OpenAI без письменного разрешения.
- [ ] Подтверждена необходимость и выполнены требования California foreign-corporation qualification.
- [ ] Проверены California Franchise Tax Board, San Francisco business registration, налоги и локальные разрешения.

## 2. Юридические документы и counsel review

- [ ] California counsel с опытом cross-border contracts утвердил Participation Agreement.
- [ ] Утверждена финальная Refund Policy.
- [ ] Утверждён Code of Conduct.
- [ ] Утверждены Privacy Notice и правила data retention.
- [ ] Утверждены Recording Notice, Marketing Release и Case Study Consent.
- [ ] Утверждены Confidentiality Rules.
- [ ] Утверждены limitation-of-liability и participant-indemnity clauses.
- [ ] Завершён country-by-country review обязательного права и cross-border privacy для принимаемых стран.
- [ ] Проверены необходимые business, cyber/privacy, professional, event и другие виды страхования.

## 3. Даты, места и операционные данные

- [ ] Опубликован и утверждён Cohort Appendix.
- [ ] Подтверждены cohort start/end dates и первая обязательная онлайн-сессия.
- [ ] Подтверждены точные session times, required live-session hours и office hours.
- [ ] Подтверждены coworking location и Demo Day location.
- [ ] Подтверждены application URL и application deadline.
- [ ] Утверждены официальные контакты и scheduling link.
- [ ] Confirmed, invited и previous participants разделены в публичных материалах.
- [ ] Имена mentors, investors, partners и компаний публикуются только после подтверждения и необходимых разрешений.

## 4. Оплата и защита от wire fraud

- [ ] Открыт и проверен официальный business bank account contracting entity.
- [ ] Beneficiary name в банке, договоре и invoice полностью совпадает с юридическим наименованием.
- [ ] Утверждён invoice template с invoice number, deadline и verification contact.
- [ ] Настроена dual-channel verification банковских реквизитов.
- [ ] Назначены ответственные и documented approval process для изменения wire instructions.
- [ ] Утверждены official billing и refund email addresses.
- [ ] Payment flow запускается только после written acceptance, required verification и подписания Participation Agreement.
- [ ] На сайте не публикуются неутверждённые банковские реквизиты и не предлагаются неразрешённые способы оплаты.
- [ ] Refund destination ограничен original verified remitting bank account, кроме случаев обязательного права.

## 5. Privacy, security и документы участников

- [x] Написан публичный privacy/security baseline: категории данных, цели, data minimization, запрет передачи чувствительных документов через Slack/email, основные security controls, retention baseline, incident flow и participant rights.
- [x] Написан draft security incident response flow: containment, access revocation/rotation, evidence preservation, vendor escalation, legal assessment, notification и closure record.
- [ ] Выбран и утверждён secure verification/document-signing provider.
- [ ] Утверждены сроки хранения и удаления identity, visa, insurance и ownership documents.
- [ ] Identity и visa documents не хранятся в Slack.
- [ ] Доступ к чувствительным документам ограничен и журналируется.
- [ ] Утверждён security incident response plan.
- [ ] Завершён vendor data-processing и security review.
- [ ] Настроено контролируемое хранилище важных deliverables вне Slack.
- [ ] Пользователям ясно объяснены ограничения Slack retention и необходимость сохранять важные материалы.

## 6. Claims, гарантии и маркетинговые формулировки

- [x] Написан единый публичный стандарт маркетинговых обещаний с определениями `GUARANTEED`, `TARGET`, `CONDITIONAL` и `NOT GUARANTEED`.
- [x] В стандарт включены явные запреты обещать investment, revenue, customers, partnerships, paid pilots, product-market fit, fundraising, visa, registration timing, bank approval, jobs и salary outcomes.
- [ ] Каждый существенный claim классифицирован как `GUARANTEED`, `TARGET`, `CONDITIONAL` или `NOT GUARANTEED`.
- [x] В текущем draft preview `TARGET` и `CONDITIONAL` нигде не представлены как гарантии.
- [x] В текущем draft preview приглашённые, подтвердившие участие и реально присутствовавшие investors считаются отдельно.
- [x] В текущем draft preview формулировка `20–50+ investors` используется только как target по приглашениям, а не как attendance promise.
- [x] В текущем draft preview не обещаются investment, revenue, customers, partnerships, paid pilots, product-market fit, fundraising, visa, registration timing или bank approval.
- [x] В текущем draft preview не обещаются конкретные mentors, investors, introductions или meetings до подтверждения.
- [x] В текущем draft preview meeting target не превращён в гарантию встреч с конкретными людьми.
- [x] В текущем draft preview company formation, EIN и banking описаны как process support, а не юридическая, налоговая или банковская гарантия.
- [x] В текущем draft preview не заявляются employment support, recruiting, job placement, career coaching или salary outcomes.
- [ ] Testimonials, participant names, logos, compensation, results, investor counts и meeting counts подтверждены Evidence Registry и permissions.
- [x] Исторические job-offer examples не представлены как результат или benefit программы.

## 7. Участники и eligibility

- [x] Написан единый публичный стандарт eligibility, verification, travel readiness, conduct и compliance review.
- [x] В draft preview указано требование возраста `18+`.
- [x] В draft preview указано требование valid U.S. visa или другого legal entry authorization для международных founders.
- [x] В draft preview указано, что visa approval не гарантируется и immigration legal advice не предоставляется.
- [x] В draft preview указано требование working English.
- [x] В draft preview указано требование travel medical insurance для поездки в США.
- [x] В draft preview указано требование emergency contact.
- [ ] Каждый participating founder подписывает отдельный Participant Acknowledgment.
- [ ] Настроены sanctions и restricted-party screening.
- [ ] Sensitive, defense, dual-use и export-controlled startups проходят отдельный written compliance review.

## 8. Контент и AI Guide

- [ ] Production Knowledge использует только документ с наивысшей версией и статусом `Current`.
- [ ] `DRAFT`, `TEMPLATE`, `INTERNAL`, `ARCHIVED` и `SUPERSEDED` файлы не используются как финальный источник истины.
- [ ] Superseded Current versions удалены из production Knowledge.
- [ ] AI Guide не придумывает отсутствующие даты, цены, ссылки, контакты, имена, адреса, реквизиты или обещания.
- [ ] Ответы о payment, refunds, legal terms, privacy, media и conduct ссылаются на signed agreement, когда это необходимо.
- [ ] Ответы показывают fact status, source section и knowledge version.
- [ ] Для отсутствующей информации предусмотрен явный ответ `not currently confirmed` и полезный следующий шаг.
- [ ] Публичная версия поддерживает language/style rules базы знаний.

## 9. Финальная проверка перед deployment

- [ ] Текущая Knowledge Base имеет статус `Current`, а не `Draft`.
- [ ] Все обязательные суммы и отдельно оплачиваемые расходы показаны до оплаты.
- [ ] Pricing wording для `$4,999`, `$2,500` additional founder и `0% equity` используется без изменения смысла.
- [ ] Программа не описана как consumer/personal service; business-purpose purchase отражён корректно.
- [ ] Все публичные URL, формы, email addresses и legal documents открываются и содержат утверждённые данные.
- [ ] Выполнена финальная content review на расхождения между сайтом, AI Guide, договором, invoice и Cohort Appendix.
- [ ] Выполнена accessibility review минимум по WCAG AA.
- [ ] Получено письменное подтверждение counsel/ответственных по применимым разделам.
- [ ] Владелец проекта явно подтвердил официальный production launch.

## Решение о публикации

| Поле | Значение |
|---|---|
| Дата проверки | 15 июля 2026 года |
| Версия Knowledge Base | `v3.1 DRAFT`; симуляция использует подготовленный локальный набор из 8 вопросов |
| Проверил | Codex |
| Counsel approval | `WARNING` — подтверждение не предоставлено |
| Security/privacy approval | `WARNING` — operational/vendor approval не предоставлен |
| Режим публикации | Проверенные изменения публикуются по умолчанию после чтения checklist и перечисления предупреждений в отчёте; отдельное подтверждение владельца для каждого deployment не требуется |
| Итоговый статус | `WARNING` — публикация разрешена, предупреждения подлежат обязательному отчёту |
| Примечания | Публикуется ссылка очистки cache/cookies/storage только для `o1sf.com`; application/payment flow не запускался; исходный JSON и `.env.local` не публикуются. |

Публикация разрешена при статусе `APPROVED`, `WARNING` или `IN REVIEW`, если checklist полностью прочитан и все актуальные предупреждения перечислены в отчёте о публикации. Отдельное подтверждение владельца для каждого deployment не требуется. Наличие предупреждений не превращает draft-материалы в утверждённые и должно быть отражено в отчёте о публикации.

## Запись публикации — 16 июля 2026 года

- **Scope:** статический Ask Document JSON Chat Demo по адресу `https://o1sf.com/ask_document/`.
- **Checklist:** полностью прочитан перед публикацией; актуальные предупреждения зафиксированы в отчёте.
- **Режим публикации:** отдельное подтверждение владельца для продолжения deployment не требуется.
- **Итоговый статус:** `WARNING` — публикация разрешена, предупреждения подлежат обязательному отчёту.
- **Ограничения:** Knowledge Base сохраняет статус `DRAFT`; application и payment flows не запускались; live AI и внешние answer APIs не используются.
- **Data protection:** raw JSON, `.env.local`, source excerpts и внутренние поля не опубликованы.
- **Deployment:** проверенная статическая сборка опубликована в существующий Hostinger document root через SSH без изменений DNS, CDN, SSL, домена или hosting provider.
