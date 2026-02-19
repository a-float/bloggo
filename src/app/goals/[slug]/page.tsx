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
import { getGoalMetrics } from "../getGoalMetrics";
import { FaCalendarDay } from "react-icons/fa6";
import GoalStatusBadge from "../GoalStatusBadge";

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

  const metrics = getGoalMetrics(goal);

  return (
    <div className="self-center w-full flex-1 flex flex-col">
      <div className="flex justify-between gap-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-3xl">{goal.title}</h1>
          <GoalStatusBadge goal={goal} />
        </div>
        <EditGoalButton goal={goal} className="self-center" />
      </div>
      <p className="mt-2 mb-4 text-base-content/70">{goal.description}</p>

      <div className="stats stats-vertical md:stats-horizontal lg:grid lg:grid-cols-3">
        <div className="stat">
          <div className="stat-title">Target Completion</div>
          <div className="stat-figure">
            <Progress value={metrics.progressPercent} />
          </div>
          <div className="stat-value">
            {metrics.progressPercent.toFixed(2)}%
          </div>
          <div className="stat-desc">
            {metrics.toDo} {goal.unit}s remaining
          </div>
        </div>
        <div className="stat">
          <div className="stat-title capitalize">Total {goal.unit + "s"}</div>
          <div className="stat-value">{metrics.totalDone}</div>
          <div className="stat-desc">
            with an average of {metrics.averagePerDay} {goal.unit}s per day
          </div>
        </div>

        <div className="stat">
          <div className="stat-figure">
            <FaCalendarDay className="w-8 h-8" />
          </div>
          <div className="stat-title">Goal Updates</div>
          <div className="stat-value">{metrics.itemCount}</div>
          <div className="stat-desc">
            since starting on {metrics.firstTime.format("DD MMM YYYY")}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-8 lg:justify-center my-4">
        <div className="card flex-1">
          <div className="card-body">
            <h2 className="card-title">Latest Progress</h2>
            <GoalBarChart
              daysPast={7}
              className="h-54 md:h-64 lg:h-42 min-w-[300px] w-full"
              unit={goal.unit}
              items={goal.items}
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

      <GoalItemsTable goal={goal} />
    </div>
  );
}
