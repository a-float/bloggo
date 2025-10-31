import NotFound from "@/app/not-found";
import { canUserSeeGoal } from "@/data/access";
import { getGoalById } from "@/lib/service/goal.service";
import { getSession } from "@/lib/session";
import dayjs from "dayjs";
import { unauthorized } from "next/navigation";
import EditGoalButton from "./EditGoalButton";
import CalendarChart from "./CalendarChart";

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

      <h2 className="text-2xl mt-4 mb-2">Activity over time</h2>

      <CalendarChart
        items={goal.items}
        from={dayjs().subtract(364, "days").toDate()}
        to={dayjs().toDate()}
      />

      <h2 className="text-2xl mt-4 mb-2">Items</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Idx</th>
            <th>Message</th>
            <th>Value</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {goal.items.map((item, index) => (
            <tr key={item.id}>
              <th>{index + 1}</th>
              <td>{item.message || "-"}</td>
              <td>
                {item.value} {goal.unit}s
              </td>
              <td>{dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
