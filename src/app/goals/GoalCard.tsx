"use client";

import React, { useState } from "react";
import { GoalDto } from "@/data/goal-dto";
import { TbPlus } from "react-icons/tb";
import BadgeRow from "@/components/BadgeRow";
import { FaEdit } from "react-icons/fa";
import { FaEllipsis, FaTrash } from "react-icons/fa6";
import Link from "next/link";
import GoalItemModal from "./GoalItemModal";
import CalendarChart from "./[slug]/CalendarChart";
import dayjs from "dayjs";
import Progress from "@/components/Progress";

type GoalCardProps = {
  goal: GoalDto;
  onEdit: (goal: GoalDto) => void;
};

export default function GoalCard({ goal, onEdit }: GoalCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="card card-sm card-border bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="dropdown dropdown-end absolute top-2 right-2">
          <div tabIndex={0} role="button" className="btn btn-circle btn-ghost">
            <FaEllipsis />
          </div>
          <ul
            tabIndex={-1}
            className="dropdown-content menu bg-base-200 rounded-box z-1 w-32 p-2 shadow-sm"
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
              <a
                href="#"
                onClick={() => {
                  (document.activeElement as HTMLElement).blur();
                  console.log("todo");
                }}
              >
                <FaTrash /> Delete
              </a>
            </li>
          </ul>
        </div>
        <Link href={`/goals/${goal.id}`}>
          <h2 className="card-title">{goal.title}</h2>
        </Link>
        {/* <div className="h-12">
          {goal.description && (
            <p className="text-base-content/70 text-sm">{goal.description}</p>
          )}
        </div> */}
        <>
          {/* <GoalStats goal={goal} /> */}
          <div className="flex justify-around items-center mb-2 gap-6">
            <div className="overflow-auto scrollbar-hide rtl">
              <CalendarChart
                className="ltr"
                from={dayjs().subtract(140, "days").toDate()}
                to={dayjs().toDate()}
                items={goal.items}
                showLegend={false}
                showX={false}
                showY={false}
                size="sm"
              />
            </div>
            <Progress progress={94} className="text-primary aspect-square" />
          </div>

          {goal.tags.length > 0 && <BadgeRow tags={goal.tags} />}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-soft btn-sm mt-2"
          >
            <TbPlus />
            Add progress
          </button>
        </>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Add Progress to {goal.title}
            </h3>
            <GoalItemModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              goal={goal}
            />
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
