import { GoalDto } from "@/data/goal-dto";
import dayjs from "dayjs";

function niceFloat(x: number) {
  return parseFloat(x.toFixed(3));
}

export function getGoalMetrics(goal: GoalDto) {
  const currentTarget = goal.target;
  const firstTime = dayjs(goal.items.at(-1)?.createdAt ?? undefined);
  const totalDone = goal.items.reduce((acc, item) => acc + item.value, 0);
  const progressPercent =
    currentTarget > 0 ? niceFloat((100 * totalDone) / currentTarget) : 0;
  const toDo = niceFloat(currentTarget - totalDone);
  const avg = totalDone / Math.max(dayjs().diff(firstTime, "day"), 1);

  return {
    totalDone,
    progressPercent: progressPercent,
    toDo,
    firstTime,
    itemCount: goal.items.length,
    averagePerDay: niceFloat(avg),
  };
}
