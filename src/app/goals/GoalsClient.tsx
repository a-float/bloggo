"use client";

import React, { useState } from "react";
import { GoalDto } from "@/data/goal-dto";
import { type TagWithCount } from "@/types/common";
import GoalModal from "./GoalModal";
import GoalCard from "./GoalCard";
import { useRouter } from "next/navigation";

type GoalsClientProps = {
  goals: GoalDto[];
  canCreate: boolean;
  tagCounts: TagWithCount[];
};

export default function GoalsClient(props: GoalsClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalDto | null>(null);

  const handleCreateGoal = () => {
    setSelectedGoal(null);
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal: GoalDto) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGoal(null);
  };

  const handleSave = () => {
    router.refresh();
  };

  return (
    <>
      <div>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl">Goals</h1>
          {props.canCreate ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCreateGoal}
            >
              Create new goal
            </button>
          ) : null}
        </div>
        <section className="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
          {props.goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => handleEditGoal(goal)}
            />
          ))}
        </section>
      </div>

      <GoalModal
        goal={selectedGoal}
        tagCounts={props.tagCounts}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </>
  );
}
