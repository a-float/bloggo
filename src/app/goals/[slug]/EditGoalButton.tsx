"use client";

import { GoalDto } from "@/data/goal-dto";
import React from "react";
import GoalModal from "../GoalModal";
import clsx from "clsx";

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
