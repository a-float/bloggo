import NotFound from "@/app/not-found";
import { canUserSeeGoal } from "@/data/access";
import { getGoalById } from "@/lib/service/goal.service";
import { getSession } from "@/lib/session";
import dayjs from "dayjs";
import { unauthorized } from "next/navigation";
import EditGoalButton from "./EditGoalButton";
import CalendarChart from "./CalendarChart";
import BarChart from "./BarChart";
import { GoalStats } from "./GoalStats";
import GoalItemsTable from "./GoalItemsTable";

// const getRandomItems = (count: number) => {
//   const items = [];
//   for (let i = 0; i < count; i++) {
//     const daysAgo = Math.floor(Math.random() * 200);
//     items.push({
//       createdAt: dayjs().subtract(daysAgo, "days").toDate(),
//     });
//   }
//   return items;
// };

export default async function GoalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { user } = await getSession();

  const { slug } = await params;
  const goal = await getGoalById(Number(slug));

  if (!goal) throw NotFound();
  const canSeeGoal = await canUserSeeGoal(user, goal);
  if (!canSeeGoal) return unauthorized();

  return (
    <div className="self-center w-full flex-1 mt-4 flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{goal.title} Goal</h1>
        <EditGoalButton goal={goal} />
      </div>
      <p className="text-base-content/70">{goal.description}</p>

      <h2 className="text-2xl mt-4 mb-2">Overall progress</h2>

      <GoalStats goal={goal} />

      <h2 className="text-2xl mt-4 mb-2">Latest progress</h2>

      <div className="w-1/2 mx-auto">
        <BarChart
          items={Array.from({ length: 7 }).map((_, idx) => ({
            createdAt: dayjs().subtract(idx, "days").toDate(),
            value: Math.floor(Math.random() * 10),
          }))}
        />
      </div>

      <h2 className="text-2xl mt-4 mb-2">Activity over time</h2>

      <div className="mx-auto max-w-full overflow-x-auto">
        <CalendarChart
          items={goal.items}
          from={dayjs().subtract(365, "days").toDate()}
          to={dayjs().add(1, "day").toDate()}
        />
      </div>

      <h2 className="text-2xl mt-4 mb-2">Items</h2>

      <GoalItemsTable goal={goal} />
    </div>
  );
}
