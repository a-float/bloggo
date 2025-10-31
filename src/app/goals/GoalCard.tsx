"use client";

import React, { useState } from "react";
import { GoalDto } from "@/data/goal-dto";
import { TbEdit, TbPlus } from "react-icons/tb";
import { addGoalItem } from "@/actions/add-goal-item.action";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import BadgeRow from "@/components/BadgeRow";
import { FaEdit } from "react-icons/fa";
import { FaCalendarDay, FaEllipsis, FaTrash } from "react-icons/fa6";
import { GoalType } from "@prisma/client";
import { Input, Textarea } from "@/components/form/TextInput";
import Link from "next/link";

type GoalCardProps = {
  goal: GoalDto;
  onEdit: (goal: GoalDto) => void;
};

export default function GoalCard({ goal, onEdit }: GoalCardProps) {
  const [isAddingValue, setIsAddingValue] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const streak: number = 127;

  const handleAddValue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newValue.trim()) {
      toast.error("Please enter a value");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addGoalItem({
        goalId: goal.id,
        value: parseFloat(newValue),
        message: newMessage.trim() || null,
      });

      if (result.success) {
        setNewValue("");
        setNewMessage("");
        setIsAddingValue(false);
        toast.success(result.message || "Value added successfully");

        // Refresh the page or trigger a revalidation
        window.location.reload();
      } else {
        if (result.message) {
          toast.error(result.message);
        } else if (result.errors) {
          result.errors.forEach((error) => {
            toast.error(error.message);
          });
        }
      }
    } catch (error) {
      toast.error("Failed to add value");
      console.error("Error adding goal value:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // TODO perform on DB
  const totalValue =
    goal.type === GoalType.SUM
      ? goal.items.reduce((sum, item) => sum + item.value, 0)
      : goal.type === GoalType.MAX
        ? goal.items.reduce((max, item) => Math.max(max, item.value), 0)
        : goal.items.length;

  const progress = Math.round((totalValue / goal.target) * 100);

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

        {!isAddingValue ? (
          <>
            <div className="stats mb-auto mx-auto">
              <div className="stat">
                <div className="stat-title">You got</div>
                <div className="stat-value">{totalValue}</div>
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
                <div
                  className="radial-progress"
                  style={{ "--value": progress } as React.CSSProperties}
                  aria-valuenow={progress}
                  role="progressbar"
                >
                  {progress}%
                </div>
              </div>
            </div>

            {goal.tags.length > 0 && <BadgeRow tags={goal.tags} />}
            <button
              type="button"
              onClick={() => setIsAddingValue(true)}
              className="btn btn-soft btn-sm mt-2"
            >
              <TbPlus />
              Add progress
            </button>
          </>
        ) : (
          <form onSubmit={handleAddValue} className="">
            <Input
              label="Value"
              required
              type="number"
              step="any"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={`Value${goal.unit ? ` (${goal.unit})` : ""}`}
              className="input-sm w-full"
              disabled={isSubmitting}
            />
            <Textarea
              label="Message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="What you did..."
              className="input-sm w-full min-h-0"
              disabled={isSubmitting}
              rows={1}
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsAddingValue(false);
                  setNewValue("");
                  setNewMessage("");
                }}
                className="btn btn-ghost btn-sm w-16"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-sm w-16"
              >
                {isSubmitting ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
