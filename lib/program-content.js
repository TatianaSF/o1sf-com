export const programBasePath = "/923hy";

export const programNav = [
  { label: "Program", href: `${programBasePath}/program` },
  { label: "Results", href: `${programBasePath}/results` },
  { label: "Pricing", href: `${programBasePath}/pricing` },
  { label: "AI Guide", href: `${programBasePath}/guide` },
  { label: "Standards", href: `${programBasePath}/standards` },
];

export const quickQuestions = [
  "Who is the program for?",
  "What happens in three weeks?",
  "What results should I expect?",
  "What does investor access mean?",
  "What is included in $4,999?",
  "How can I participate?",
];

export const guideAnswers = [
  {
    id: "overview",
    keywords: ["what is", "overview", "o1sf", "program for", "who is", "что такое", "кому", "подходит"],
    status: "CONFIRMED IN v3.1 DRAFT",
    tone: "confirmed",
    title: {
      en: "A three-week U.S. market-entry program for founders",
      ru: "Трёхнедельная программа выхода на рынок США для founders",
    },
    body: {
      en: "O1SF combines two weeks of online preparation with one intensive week in San Francisco. Founders at any stage may apply, including teams with only an idea, without an MVP or traction.",
      ru: "O1SF объединяет две недели онлайн-подготовки и одну интенсивную неделю в Сан-Франциско. Подать заявку могут founders на любой стадии, включая команды только с идеей, без MVP или traction.",
    },
    note: {
      en: "International founders must already have valid U.S. entry authorization for the in-person week.",
      ru: "Международным founders заранее требуется действующее разрешение на въезд в США для очной недели.",
    },
    source: "Core Program Summary · Who the Program Is For",
  },
  {
    id: "format",
    keywords: ["three weeks", "3 weeks", "format", "happens", "schedule", "week", "три недели", "формат", "расписание", "недел"],
    status: "GUARANTEED STRUCTURE",
    tone: "guaranteed",
    title: {
      en: "Two online weeks, followed by one week in San Francisco",
      ru: "Две онлайн-недели, затем одна неделя в Сан-Франциско",
    },
    body: {
      en: "Across the online weeks, each startup receives four group program meetings of at least 60 minutes and two company-level individual strategy sessions of at least 30 minutes. The San Francisco week focuses on executing the meeting plan and preparing for Demo Day.",
      ru: "За две онлайн-недели каждый startup получает четыре групповые встречи не менее 60 минут и две индивидуальные company-level strategy sessions не менее 30 минут. Неделя в Сан-Франциско посвящена выполнению meeting plan и подготовке к Demo Day.",
    },
    note: {
      en: "Exact dates, daily times and locations are not currently confirmed.",
      ru: "Точные даты, ежедневное расписание и места пока не подтверждены.",
    },
    source: "Program Format · Online Schedule · In-Person Week",
  },
  {
    id: "results",
    keywords: ["result", "outcome", "receive", "get", "deliverable", "результат", "получу", "итог"],
    status: "EXPECTED OUTCOMES",
    tone: "target",
    title: {
      en: "A structured, tested and documented U.S. market-entry plan",
      ru: "Структурированный, проверенный и документированный план выхода на рынок США",
    },
    body: {
      en: "Expected deliverables include a U.S.-ready pitch deck, three one-minute pitches, tested positioning, customer and investor target lists, outreach messages, a North Star Metric, and a 3-, 6- and 12-month roadmap.",
      ru: "Ожидаемые deliverables включают U.S.-ready pitch deck, три one-minute pitches, проверенное positioning, customer и investor target lists, outreach messages, North Star Metric и roadmap на 3, 6 и 12 месяцев.",
    },
    note: {
      en: "These outcomes do not guarantee investment, customers, revenue, product-market fit or market success.",
      ru: "Эти результаты не гарантируют инвестиции, клиентов, выручку, product-market fit или успех на рынке.",
    },
    source: "Expected Participant Outcomes · Program Success Definition",
  },
  {
    id: "investors",
    keywords: ["investor", "investment", "demo day", "fundraising", "инвестор", "инвестиц", "демо"],
    status: "CONDITIONAL · NOT GUARANTEED",
    tone: "conditional",
    title: {
      en: "Investor access means preparation, targeting and conditional meetings",
      ru: "Investor access означает подготовку, targeting и встречи при выполнении условий",
    },
    body: {
      en: "O1SF helps founders prepare for investor conversations, build a relevant investor target list and may organize meetings when investors are available and interested. Demo Day invitations target 20 to 50 or more investors, but invited, confirmed and attended counts are different.",
      ru: "O1SF помогает founders подготовиться к investor conversations, собрать релевантный investor target list и может организовать встречи при наличии доступности и интереса. Цель — пригласить на Demo Day 20–50+ investors, но invited, confirmed и attended counts различаются.",
    },
    note: {
      en: "A specific meeting, written feedback, due diligence, a term sheet or investment is not guaranteed.",
      ru: "Конкретная встреча, письменный feedback, due diligence, term sheet или инвестиция не гарантируются.",
    },
    source: "Demo Day · Investor Access · Investor Matching",
  },
  {
    id: "pricing",
    keywords: ["price", "pricing", "4999", "2,500", "2500", "included", "cost", "стоим", "цен", "входит"],
    status: "CONFIRMED BUSINESS TERMS",
    tone: "confirmed",
    title: {
      en: "$4,999 per company for one primary founder",
      ru: "$4,999 за одну компанию и одного primary founder",
    },
    body: {
      en: "One paid additional founder may join for $2,500. O1SF takes no equity. The price includes the three-week program, guaranteed online sessions, mentor matching, go-to-market and pitch work, Demo Day, coworking and listed program materials.",
      ru: "Один additional founder может присоединиться за $2,500. O1SF не получает equity. Цена включает трёхнедельную программу, гарантированные онлайн-сессии, mentor matching, go-to-market и pitch work, Demo Day, coworking и указанные материалы.",
    },
    note: {
      en: "Travel, housing, visas, insurance, formation, registered-agent, banking and other third-party costs are paid separately.",
      ru: "Перелёт, проживание, визы, страховка, formation, registered-agent, banking и другие third-party costs оплачиваются отдельно.",
    },
    source: "Standard Pricing Language · What Is Included",
  },
  {
    id: "application",
    keywords: ["apply", "application", "participate", "join", "interview", "заяв", "участв", "подать"],
    status: "PROCESS CONFIRMED · DATES PENDING",
    tone: "confirmed",
    title: {
      en: "Application, interview, verification and final selection",
      ru: "Заявка, интервью, verification и final selection",
    },
    body: {
      en: "The process has four steps: submit an application, complete a 20-minute interview, complete required identity and eligibility checks, and receive the final selection decision. Each cohort is limited to nine startups.",
      ru: "Процесс состоит из четырёх шагов: подать заявку, пройти 20-минутное интервью, завершить необходимые identity и eligibility checks и получить final selection decision. В каждой когорте не более девяти startups.",
    },
    note: {
      en: "The official application URL, deadline and cohort dates are not currently confirmed.",
      ru: "Официальный application URL, deadline и даты когорты пока не подтверждены.",
    },
    source: "Application Process · Information Not Yet Confirmed",
  },
  {
    id: "payment",
    keywords: ["pay", "payment", "card", "wire", "bank", "оплат", "карт", "перевод", "банк"],
    status: "DRAFT BUSINESS POLICY",
    tone: "draft",
    title: {
      en: "Payment is by verified U.S. dollar bank wire only",
      ru: "Оплата принимается только проверенным банковским переводом в долларах США",
    },
    body: {
      en: "Payment follows written acceptance, required verification and signature of the Participation Agreement. OpenAISF Inc. then issues an official invoice. Cards, cash, checks, cryptocurrency and informal person-to-person payments are not accepted.",
      ru: "Оплата производится после written acceptance, required verification и подписания Participation Agreement. Затем OpenAISF Inc. выставляет официальный invoice. Карты, наличные, чеки, cryptocurrency и неформальные person-to-person payments не принимаются.",
    },
    note: {
      en: "Final bank details and official payment contacts are not published in the current draft.",
      ru: "Финальные банковские реквизиты и официальные payment contacts в текущем draft не опубликованы.",
    },
    source: "Bank-Wire-Only Payment · Wire-Fraud Prevention",
  },
  {
    id: "refund",
    keywords: ["refund", "cancel", "cancellation", "возврат", "отмен"],
    status: "DRAFT POLICY · AGREEMENT CONTROLS",
    tone: "draft",
    title: {
      en: "The signed Participation Agreement controls final refund terms",
      ru: "Финальные refund terms определяются подписанным Participation Agreement",
    },
    body: {
      en: "The current business-policy draft allows cancellation at least 14 calendar days before the first required online session, subject to a $250 administration and bank-processing fee plus permitted documented deductions. Later cancellations have no contractual refund except where mandatory law requires otherwise.",
      ru: "Текущий business-policy draft допускает отмену не менее чем за 14 календарных дней до первой обязательной онлайн-сессии с удержанием $250 administration and bank-processing fee и разрешённых документированных расходов. При более поздней отмене contractual refund не предусмотрен, кроме случаев обязательного права.",
    },
    note: {
      en: "This is not final legal advice or a substitute for the signed agreement.",
      ru: "Это не финальная юридическая консультация и не замена подписанного соглашения.",
    },
    source: "Refund Policy Summary · Counsel Review Required",
  },
  {
    id: "partners",
    keywords: ["partner", "mentor", "support", "sponsor", "партнер", "партнёр", "ментор", "поддерж"],
    status: "CONDITIONAL",
    tone: "conditional",
    title: {
      en: "Partnership and mentor opportunities are reviewed individually",
      ru: "Возможности partnership и mentoring рассматриваются индивидуально",
    },
    body: {
      en: "Potential contributions include mentoring founders, joining investor panels, leading workshops, sharing U.S. market expertise, making ecosystem introductions and supporting Demo Day.",
      ru: "Возможный вклад включает mentoring founders, участие в investor panels, проведение workshops, передачу опыта рынка США, ecosystem introductions и поддержку Demo Day.",
    },
    note: {
      en: "A formal sponsorship package and official contact channel are not currently confirmed.",
      ru: "Формальный sponsorship package и официальный contact channel пока не подтверждены.",
    },
    source: "Partnerships and Support",
  },
];

export const fallbackGuideAnswer = {
  id: "missing",
  status: "NOT CURRENTLY CONFIRMED",
  tone: "missing",
  title: {
    en: "That detail is not included in the available official program information",
    ru: "Этой детали нет в доступной официальной информации о программе",
  },
  body: {
    en: "The guide will not guess a date, link, name, price, policy or promise that is not present in the current knowledge base.",
    ru: "Guide не будет придумывать дату, ссылку, имя, цену, policy или обещание, которых нет в текущей базе знаний.",
  },
  note: {
    en: "Try asking about program fit, format, outcomes, investor access, pricing, payment or refunds.",
    ru: "Попробуйте спросить о program fit, формате, результатах, investor access, стоимости, оплате или возврате.",
  },
  source: "Response Rules for Missing Information",
};

export function matchGuideAnswer(question) {
  const normalized = question.toLocaleLowerCase();
  const matches = guideAnswers.flatMap((answer) =>
    answer.keywords
      .filter((keyword) => normalized.includes(keyword))
      .map((keyword) => ({ answer, specificity: keyword.length })),
  );

  matches.sort((first, second) => second.specificity - first.specificity);

  return matches[0]?.answer || fallbackGuideAnswer;
}

export function isRussianQuestion(question) {
  return /[А-Яа-яЁё]/.test(question);
}
