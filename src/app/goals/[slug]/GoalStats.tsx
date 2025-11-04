import Progress from "@/components/Progress";
import { GoalDto } from "@/data/goal-dto";
import { GoalType } from "@prisma/client";

type GoalStatsProps = {
  goal: GoalDto;
};

export function GoalStats({ goal }: GoalStatsProps) {
  // TODO perform on DB
  const totalValue =
    goal.type === GoalType.SUM
      ? goal.items.reduce((sum, item) => sum + item.value, 0)
      : goal.type === GoalType.MAX
        ? goal.items.reduce((max, item) => Math.max(max, item.value), 0)
        : goal.items.length;

  const progress = Math.round((totalValue / goal.target) * 100);

  return (
    <div className="stats mb-auto mx-auto">
      <div className="stat">
        <div className="stat-title">You got</div>
        <div className="stat-value">312</div>
        <div className="stat-desc">
          {goal.unit && ` ${goal.unit}s`}

          {/* {goal.items.length}{" "} */}
          {/* {goal.items.length === 1 ? "entry" : "entries"} */}
        </div>
      </div>

      <div className="stat">
        {/* <div className="stat-figure">
                        <FaCalendarDay size={28} />
                      </div> */}
        <div className="stat-title">out of</div>
        <div className="stat-value">{goal.target}</div>
        <div className="stat-desc"></div>
      </div>

      <div className="stat">
        <Progress progress={progress} />
      </div>
    </div>
  );
}
