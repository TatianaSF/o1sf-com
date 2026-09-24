export const CONTENT_LAST_MODIFIED = "2026-07-16";
export const PROFILE_LAST_MODIFIED = "2026-07-24";

export const HOME_POSITIONING_TITLE =
  "O1SF | U.S. Market Entry for International Founders From Assumptions to Paying Customers";

export const HOME_POSITIONING_DESCRIPTION =
  "O1SF helps international founders test U.S. market-entry assumptions and build an evidence-based path toward paying customers. Customers and revenue are not guaranteed.";

export const publicPageIndex = [
  {
    path: "/",
    title: HOME_POSITIONING_TITLE,
    description: HOME_POSITIONING_DESCRIPTION,
    type: "WebPage",
  },
  {
    path: "/program",
    title: "Three-Week U.S. Market Entry Program",
    description:
      "See how O1SF combines two online preparation weeks with one intensive San Francisco week to test an evidence-based path toward paying customers.",
    type: "WebPage",
  },
  {
    path: "/methodology",
    title: "O1SF Market Validation Methodology",
    description:
      "Learn how O1SF turns a market-entry assumption into an asset, a real interaction, recorded feedback, an iteration, and a measurable action plan.",
    type: "WebPage",
  },
  {
    path: "/pricing",
    title: "O1SF Pricing and Program Inclusions",
    description:
      "O1SF costs $4,999 per company for one primary founder, takes 0% equity, and clearly separates program inclusions from travel and third-party costs.",
    type: "WebPage",
  },
  {
    path: "/resources",
    title: "U.S. Market Entry Resources for International Founders",
    description:
      "Practical O1SF guides for evaluating U.S. market readiness, running customer discovery, and building a 3-, 6-, and 12-month go-to-market plan.",
    type: "CollectionPage",
  },
  {
    path: "/resources/us-market-entry-checklist",
    title: "U.S. Market Entry Checklist for International Startups",
    description:
      "A practical readiness checklist for international founders preparing to test positioning, customer demand, outreach, and operating assumptions in the United States.",
    type: "Article",
  },
  {
    path: "/resources/customer-discovery-us",
    title: "Customer Discovery in the U.S. for International Founders",
    description:
      "A field guide to planning U.S. customer interviews, separating evidence from encouragement, and turning conversations into market-entry decisions.",
    type: "Article",
  },
  {
    path: "/resources/us-go-to-market-plan",
    title: "How to Build a U.S. Go-to-Market Plan",
    description:
      "Build an evidence-based U.S. go-to-market plan with clear 3-, 6-, and 12-month decisions, metrics, target accounts, and learning loops.",
    type: "Article",
  },
  {
    path: "/tatianasf",
    title: "TatianaSF and O1SF - Program Host Profile",
    description:
      "Learn how TatianaSF is connected to O1SF as its program host and public author, and find the program, methodology, and founder resources published on o1sf.com.",
    type: "ProfilePage",
    lastModified: PROFILE_LAST_MODIFIED,
  },
].map((page) => ({
  ...page,
  lastModified: page.lastModified ?? CONTENT_LAST_MODIFIED,
}));

export const resourceGuideIndex = publicPageIndex.filter(
  (page) => page.type === "Article",
);

export function getPublicPage(path) {
  return publicPageIndex.find((page) => page.path === path);
}
