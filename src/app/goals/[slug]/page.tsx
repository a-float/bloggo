import NotFound from "@/app/not-found";
import { canUserSeeGoal } from "@/data/access";
import { getGoalById } from "@/lib/service/goal.service";
import { getSession } from "@/lib/session";
import dayjs from "dayjs";
import { unauthorized } from "next/navigation";
import EditGoalButton from "./EditGoalButton";
import CalendarChart from "./CalendarChart";
import GoalBarChart from "./GoalBarChart";
import Progress from "@/components/Progress";
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
    <div className="self-center w-full flex-1 flex flex-col">
      <div className="flex justify-between gap-4">
        <h1 className="text-3xl font-bold">Goal: {goal.title}</h1>
        <EditGoalButton goal={goal} className="self-center" />
      </div>
      <p className="my-4 text-base-content/70">{goal.description}</p>

      <div className="stats stats-vertical lg:stats-horizontal">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total Likes</div>
          <div className="stat-value text-primary">25.6K</div>
          <div className="stat-desc">21% more than last month</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Page Views</div>
          <div className="stat-value text-secondary">2.6M</div>
          <div className="stat-desc">21% more than last month</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <Progress value={30} />
          </div>
          <div className="stat-value">86%</div>
          <div className="stat-title">Tasks done</div>
          <div className="stat-desc text-secondary">31 tasks remaining</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-12 lg:justify-center my-4">
        <div className="card flex-1">
          <div className="card-body px-0">
            <h2 className="card-title">Latest Progress</h2>
            <GoalBarChart
              daysPast={7}
              className="h-54 md:h-64 lg:h-42 min-w-[300px] w-full"
              unit={goal.unit}
              items={Array.from({ length: 14 }).map((_, idx) => ({
                createdAt: dayjs().subtract(idx, "days").toDate(),
                value: idx + 1,
              }))}
            />
          </div>
        </div>

        <div className="card min-w-0">
          <div className="card-body max-w-full px-0">
            <h2 className="card-title">Activity over time</h2>
            <p className="text-sm text-base-content/70 flex-0 mb-3">
              Progress over the last year
            </p>
            <CalendarChart
              items={goal.items}
              from={dayjs().subtract(12, "month").toDate()}
              to={dayjs().toDate()}
            />
          </div>
        </div>
      </div>

      <section>
        <h2 className="card-title mb-2">Progress entries</h2>
        <GoalItemsTable goal={goal} />
      </section>
    </div>
  );
}
