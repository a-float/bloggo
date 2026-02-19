"use server";

import prisma from "@/lib/prisma";
import * as yup from "yup";
import { Goal, GoalType, GoalVisibility, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import {
  getGoalById,
  markGoalAsCompletedIfNeeded,
} from "@/lib/service/goal.service";
import { canUserCreateGoal, canUserEditGoal } from "@/data/access";

export type ActionState = {
  success: boolean;
  message?: string;
  data?: Goal;
  errors?: { field: string; message: string }[];
};

const CreateGoalSchema = yup.object({
  id: yup.number().nullable(),
  title: yup.string().required().trim().min(1),
  description: yup.string().nullable().optional(),
  tags: yup.array().of(yup.string().trim().required()).default([]),
  visibility: yup.string().oneOf(Object.values(GoalVisibility)).required(),
  unit: yup.string().nullable().optional(),
  target: yup.number().moreThan(0).required(),
  type: yup.string().oneOf(Object.values(GoalType)).required(),
});

type CreateGoalInput = yup.InferType<typeof CreateGoalSchema>;

const capitalize = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

export async function createOrUpdateGoal(
  input: CreateGoalInput,
): Promise<ActionState> {
  const { user } = await getSession();
  if (!user) return { success: false, message: "Access denied." };
  const errors: ActionState["errors"] = [];

  const parsedInput = await CreateGoalSchema.validate(input, {
    abortEarly: false,
  }).catch((e: yup.ValidationError) => {
    e.inner.forEach((inner) => {
      if (!inner.path || !inner.message) return;
      errors.push({ field: inner.path, message: capitalize(inner.message) });
    });
  });

  if (errors.length > 0 || !parsedInput) return { success: false, errors };

  const { id, ...rest } = parsedInput;

  const data: Prisma.GoalCreateInput = {
    ...rest,
    owner: { connect: { id: user.id } },
    tags: [...new Set(rest.tags ?? [])],
  };

  if (!id) {
    // Creating a new goal
    if (!canUserCreateGoal(user)) {
      return { success: false, message: "Access denied." };
    }
    const goal = await prisma.goal.create({ data });

    revalidatePath("/goals");
    return { success: true, message: "Goal updated successfully.", data: goal };
  } else {
    // Editing an existing goal
    const oldGoal = await getGoalById(id);
    if (!oldGoal) {
      return { success: false, message: "Goal not found." };
    }

    if (!canUserEditGoal(user, oldGoal)) {
      return { success: false, message: "Access denied." };
    }

    if (!oldGoal) {
      return { success: false, message: "Goal not found." };
    }
    if (
      oldGoal.status === "COMPLETED" &&
      (oldGoal.type !== data.type || oldGoal.target !== data.target)
    ) {
      return { success: false, message: "Cannot edit a completed goal." };
    }
    if (oldGoal.type !== data.type) {
      return {
        success: false,
        message: "Cannot change the type of an existing goal.",
      };
    }

    const goal = await prisma.goal.update({ where: { id }, data });
    markGoalAsCompletedIfNeeded(goal);

    revalidatePath("/goals");
    revalidatePath(`/goals/${goal.id}`);

    return { success: true, message: "Goal updated successfully.", data: goal };
  }
}
