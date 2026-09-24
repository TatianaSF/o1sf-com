export const initialStep = { id: "start", choices: ["attend", "active", "sponsor", "hire", "partnership"] };

export function buildHandoff(state, t) {
  const subject = state.category === "active" ? `${state.role.toLowerCase()} role at a ${state.eventType}` : state.category === "sponsor" ? "event sponsorship" : state.category === "hire" ? "hiring TatianaSF" : `${state.partnershipType.toLowerCase()}`;
  return `Hi TatianaSF, I'm interested in ${subject}. We have an approved paid partnership budget of ${state.budget}. I'd be happy to discuss the next step if this is relevant.`;
}
