"use client";

import clsx from "clsx";
import React from "react";
import type { GoalDto } from "@/data/goal-dto";
import GoalModal from "../GoalModal";

export default function EditGoalButton(props: {
  goal: GoalDto;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx("btn", props.className)}
      >
        Edit Goal
      </button>

      <GoalModal
        goal={props.goal}
        isOpen={open}
        onClose={() => setOpen(false)}
        tagCounts={[]}
      />
    </>
  );
}
