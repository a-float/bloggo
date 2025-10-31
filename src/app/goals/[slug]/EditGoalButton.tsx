"use client";

import { GoalDto } from "@/data/goal-dto";
import React from "react";
import GoalModal from "../GoalModal";

export default function EditGoalButton(props: { goal: GoalDto }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-primary"
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
