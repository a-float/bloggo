import { canUserCreateGoal } from "@/data/access";
import { getGoalsForUser, getGoalTagCounts } from "@/lib/service/goal.service";
import { getSession } from "@/lib/session";
import GoalsClient from "./GoalsClient";

export default async function Goals() {
  const { user } = await getSession();
  const [goals, tagCounts] = await Promise.all([
    getGoalsForUser(user),
    getGoalTagCounts(user),
    // TODO maybe fetch it from the client?
  ]);

  return (
    <GoalsClient
      goals={goals}
      canCreate={canUserCreateGoal(user)}
      tagCounts={tagCounts}
    />
  );
}
