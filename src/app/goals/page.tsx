import { canUserCreateGoal } from "@/data/access";
import { getSession } from "@/lib/session";
import { getGoalsForUser, getGoalTagCounts } from "@/lib/service/goal.service";
import GoalsClient from "./GoalsClient";

export default async function Goals() {
  const { user } = await getSession();
  const [goals, tagCounts] = await Promise.all([
    getGoalsForUser(user),
    getGoalTagCounts(user),
  ]);

  return (
    <GoalsClient
      goals={goals}
      canCreate={canUserCreateGoal(user)}
      tagCounts={tagCounts}
    />
  );
}
