import { exerciseRoute } from "@/lib/exercise-route";

export async function POST(request: Request) {
  return exerciseRoute(request, "career-plan");
}
