export const privacySecurityPolicy = {
  slug: "privacy-security",
  eyebrow: "Program standard",
  title: "Privacy & security baseline",
  summary:
    "How O1SF intends to collect, use, protect and delete participant information before any application or payment flow is opened.",
  status: "DRAFT OPERATIONAL BASELINE · COUNSEL AND VENDOR REVIEW PENDING",
  updated: "July 15, 2026",
  notice:
    "This preview does not accept applications, payments or identity documents. The AI Guide is currently a local rules-based prototype and does not send questions to an external AI provider.",
  sections: [
    {
      title: "What the live program may collect",
      paragraphs: [
        "Only information reasonably needed to assess fit, contract with a company, verify eligibility, deliver the program, protect participants and meet legal obligations should be collected.",
      ],
      bullets: [
        "Contact, founder, company, ownership, authority and payer information.",
        "Application answers, interview notes and program deliverables.",
        "Identity, U.S. entry authorization, travel-insurance and emergency-contact evidence when required.",
        "Invoices, wire confirmations, refunds, disputes and compliance records.",
        "Session recordings, transcripts and optional marketing permissions when separately disclosed and agreed.",
      ],
    },
    {
      title: "Purpose and minimization",
      paragraphs: [
        "Information may be used for selection, contracting, verification, sanctions screening, billing, program delivery, safety, support, dispute handling and legal compliance. O1SF should not collect information merely because it may be useful later.",
        "Never send passwords, one-time codes, complete card credentials or online-banking credentials. Do not send passports, visas, insurance records or other identity documents through Slack or ordinary email.",
      ],
    },
    {
      title: "Security controls",
      bullets: [
        "Use an approved restricted-access verification and signing provider for sensitive documents.",
        "Encrypt sensitive information in transit and at rest; require multi-factor authentication for privileged access.",
        "Limit access to trained people with a documented business need and retain access logs.",
        "Review vendors for confidentiality, security, deletion, incident response and cross-border processing before launch.",
        "Keep durable program deliverables in a controlled repository rather than treating Slack as the system of record.",
      ],
    },
    {
      title: "Retention baseline",
      bullets: [
        "Raw identity, entry-authorization and insurance copies: normally delete within 30 days after final verification or cohort end, whichever is later.",
        "Session recordings and transcripts: normally retain for 12 months after the cohort ends, subject to the disclosed recording terms.",
        "Signed agreements, invoices, wire, refund, dispute, delivery and compliance records: retain for the legally required period; applicable OFAC records must be retained for at least 10 years.",
        "Longer retention is allowed only for a documented legal hold, dispute, fraud, sanctions, safety or other legal requirement.",
      ],
    },
    {
      title: "Incidents and participant choices",
      paragraphs: [
        "The response process is to contain the incident, revoke or rotate access, preserve evidence, involve affected vendors, assess legal obligations and notify affected people or authorities when required. Material incidents must be documented through closure.",
        "Before collection begins, O1SF must publish an official privacy contact and a process for access, correction, deletion and objection requests. Some records may need to be retained despite a request when required by law or needed to establish or defend legal claims.",
      ],
    },
    {
      title: "International participation and age",
      paragraphs: [
        "Program operations may involve cross-border processing in the United States. The final notice must identify relevant processors and transfer safeguards. The program is for participants aged 18 or older and is not designed for children.",
      ],
    },
  ],
  sources: [
    ["FTC · Protecting Personal Information", "https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business"],
    ["FTC · Cybersecurity for Small Business", "https://www.ftc.gov/business-guidance/small-businesses/cybersecurity"],
    ["NIST SP 800-61r3 · Incident Response", "https://csrc.nist.gov/pubs/sp/800/61/r3/final"],
    ["U.S. Treasury · OFAC recordkeeping rule", "https://ofac.treasury.gov/recent-actions/20250320"],
  ],
};

export const claimsPolicy = {
  slug: "claims",
  eyebrow: "Communication standard",
  title: "Claims & promises standard",
  summary:
    "A public rule for distinguishing O1SF-controlled commitments from targets, conditional opportunities and outcomes the program cannot promise.",
  status: "DRAFT COMMUNICATION STANDARD · SIGNED TERMS CONTROL",
  updated: "July 15, 2026",
  notice:
    "The current knowledge base is a draft. Prices, format and controlled commitments remain subject to the final Participation Agreement and Cohort Appendix.",
  sections: [
    {
      title: "Every material statement has a status",
      bullets: [
        "GUARANTEED — a deliverable O1SF controls and commits to provide under the signed terms.",
        "TARGET — a measurable goal O1SF will work toward, without promising the result.",
        "CONDITIONAL — depends on readiness, relevance, availability or a third party's independent decision.",
        "NOT GUARANTEED — a business outcome or third-party action O1SF does not promise.",
      ],
    },
    {
      title: "Current controlled program commitments",
      paragraphs: [
        "The draft program structure is two online weeks followed by one intensive week in San Francisco for a cohort of nine startups. The draft company price is $4,999, an additional approved founder is $2,500 and O1SF takes 0% equity.",
      ],
      bullets: [
        "At least four group online meetings totaling at least 60 minutes.",
        "At least two company-level individual online sessions of at least 30 minutes each.",
        "Program work on positioning, market research, outreach, pitch preparation and a U.S. entry roadmap.",
      ],
    },
    {
      title: "Investor access",
      paragraphs: [
        "O1SF may prepare founders, invite relevant people, make conditional introductions and organize Demo Day. The current 20–50+ investor figure is an invitation target, not an attendance promise.",
      ],
      bullets: [
        "No promise of a meeting with a named or specific investor.",
        "No promise of feedback, due diligence, a term sheet or investment.",
        "Invited, confirmed and actually attending investors must be counted separately.",
      ],
    },
    {
      title: "Outcomes O1SF does not promise",
      bullets: [
        "Investment, fundraising, customers, revenue, partnerships, paid pilots or product-market fit.",
        "Visa approval, company-registration timing, EIN timing or bank-account approval.",
        "A specific mentor, investor, introduction, meeting, job, salary or recruiting outcome.",
        "Market success or any third party's decision.",
      ],
      paragraphs: [
        "Formation, EIN and banking are described only as process support. They are not legal, tax, immigration, financial or banking advice or guarantees.",
      ],
    },
    {
      title: "Evidence and correction rule",
      paragraphs: [
        "Names, logos, testimonials, compensation, results, investor counts and meeting counts may be published only when supported by an evidence record and the required permission. If a material public claim is inaccurate or loses support, O1SF should correct or remove it promptly and preserve the change record.",
      ],
    },
  ],
};

export const participantRequirements = {
  slug: "requirements",
  eyebrow: "Participation standard",
  title: "Participant requirements",
  summary:
    "The minimum eligibility, verification, conduct and travel conditions for founders who want to join the U.S. Market Entry Program.",
  status: "DRAFT REQUIREMENTS · FINAL AGREEMENT AND COHORT APPENDIX CONTROL",
  updated: "July 15, 2026",
  notice:
    "Submitting an application or completing an interview does not guarantee acceptance. Each cohort is limited to nine startups.",
  sections: [
    {
      title: "Core eligibility",
      bullets: [
        "Be at least 18 years old.",
        "Have working English for sessions, outreach, meetings and pitches.",
        "Commit to both online weeks and the full in-person San Francisco week.",
        "For international founders, hold valid U.S. entry authorization before travel. O1SF does not provide immigration legal advice or guarantee visa approval.",
        "Carry travel medical insurance covering emergency treatment, hospitalization and medical evacuation, and provide an emergency contact.",
      ],
    },
    {
      title: "Application and verification",
      bullets: [
        "Provide accurate founder, company, ownership, authority and payer information.",
        "Complete the application, a 20-minute interview and required identity and eligibility checks.",
        "Complete sanctions and restricted-party screening when applicable.",
        "Disclose sensitive, defense, dual-use or export-controlled activities for written compliance review before acceptance.",
        "Each participating founder must sign an individual Participant Acknowledgment in addition to the company agreement.",
      ],
    },
    {
      title: "Participation and conduct",
      bullets: [
        "Participate professionally and follow confidentiality, anti-harassment, safety and lawful-use rules.",
        "Respect privacy, platform terms and applicable outreach rules.",
        "Do not place controlled technology, regulated data or sensitive identity documents in Slack, group sessions or recordings without written approval.",
        "Accept that direct market feedback may require revising the offer, message or target segment.",
      ],
    },
    {
      title: "Travel and company responsibility",
      paragraphs: [
        "Participants are responsible for visas or other entry authorization, flights, lodging, local transportation, insurance and personal health decisions. O1SF does not provide medical advice.",
        "The company participates as one team. An additional founder may join only under the published pricing and written approval rules. Missing a required condition may prevent acceptance or in-person participation and does not create an automatic refund right, subject to mandatory law and the signed agreement.",
      ],
    },
    {
      title: "Accessibility and accommodations",
      paragraphs: [
        "O1SF intends to consider reasonable accommodation requests. The official request channel, response process and venue-specific accessibility information must be confirmed before applications open.",
      ],
    },
  ],
};

export const programPolicies = [privacySecurityPolicy, claimsPolicy, participantRequirements];
