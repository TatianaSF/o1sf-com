import { getSectionsFeed } from "../../lib/ai-feeds";

export const dynamic = "force-static";

export function GET() {
  return Response.json(getSectionsFeed());
}
