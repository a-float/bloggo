"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaEllipsis, FaTrash } from "react-icons/fa6";
import { TbPlus } from "react-icons/tb";
import BadgeRow from "@/components/BadgeRow";
import Progress from "@/components/Progress";
import Spinner from "@/components/Spinner";
import type { GoalDto } from "@/data/goal-dto";
import CalendarChart from "./[slug]/CalendarChart";
import GoalItemModal from "./GoalItemModal";
import GoalStatusBadge from "./GoalStatusBadge";
import { getGoalMetrics } from "./getGoalMetrics";
import useGoalDeleteMutation from "./useGoalDeleteMutation";

type GoalCardProps = {
  goal: GoalDto;
  onEdit: (goal: GoalDto) => void;
};

export default function GoalCard({ goal, onEdit }: GoalCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading, handleDelete } = useGoalDeleteMutation();
  const metrics = getGoalMetrics(goal);

  return (
    <div className="card card-sm card-border bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="dropdown dropdown-end absolute top-2 right-2">
          <div tabIndex={0} role="button" className="btn btn-circle btn-ghost">
            <FaEllipsis />
          </div>
          <ul
            tabIndex={-1}
            className="dropdown-content menu bg-base-200 rounded-box z-1 w-32 p-2 shadow-md"
          >
            <li>
              <a
                href="#"
                onClick={() => {
                  (document.activeElement as HTMLElement).blur();
                  onEdit(goal);
                }}
              >
                <FaEdit /> Edit
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleDelete(goal.id)}>
                {isLoading ? <Spinner className="w-3.5" /> : <FaTrash />}
                Delete
              </a>
            </li>
          </ul>
        </div>
        <Link href={`/goals/${goal.id}`} className="flex gap-2">
          <h2 className="card-title text-lg">{goal.title}</h2>
        </Link>
        <div className="flex justify-around items-center mb-2 gap-6">
          <div className="overflow-auto scrollbar-hide">
            <CalendarChart
              from={dayjs().subtract(126, "days").toDate()}
              to={dayjs().subtract(1, "day").toDate()}
              items={goal.items}
              showLegend={false}
              showX={false}
              showY={false}
              size="sm"
            />
          </div>
          <Progress value={metrics.progressPercent} className="aspect-square" />
        </div>

        {goal.tags.length > 0 && <BadgeRow tags={goal.tags} />}

        <div className="mt-auto">
          {goal.status === "COMPLETED" ? (
            <div className="flex-1 grid place-items-center h-8">
              <GoalStatusBadge goal={goal} className="self-center" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn btn-sm mt-2 w-full"
            >
              <TbPlus />
              Add progress
            </button>
          )}
        </div>
        <GoalItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          goal={goal}
        />
      </div>
    </div>
  );
}
