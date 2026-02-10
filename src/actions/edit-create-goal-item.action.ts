"use server";

import prisma from "@/lib/prisma";
import * as yup from "yup";
import { GoalItem } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { markGoalAsCompletedIfNeeded } from "@/lib/service/goal.service";

export type GoalItemActionState = {
  success: boolean;
  message?: string;
  data?: GoalItem;
  errors?: { field: string; message: string }[];
};

const GoalItemSchema = yup.object({
  id: yup.number().nullable(),
  goalId: yup.number().required(),
  value: yup.number().required(),
  message: yup.string().nullable().optional(),
});

type GoalItemInput = yup.InferType<typeof GoalItemSchema>;

const capitalize = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

export async function createOrUpdateGoalItem(
  input: GoalItemInput,
): Promise<GoalItemActionState> {
  const { user } = await getSession();
  if (!user) return { success: false, message: "Access denied." };

  const errors: GoalItemActionState["errors"] = [];

  const parsedInput = await GoalItemSchema.validate(input, {
    abortEarly: false,
  }).catch((e: yup.ValidationError) => {
    e.inner.forEach((inner) => {
      if (!inner.path || !inner.message) return;
      errors.push({ field: inner.path, message: capitalize(inner.message) });
    });
  });

  if (!parsedInput || errors.length > 0) {
    return { success: false, errors };
  }

  const { id, goalId, value, message } = parsedInput;

  try {
    // Check if the goal exists and user has access
    const goal = await prisma.goal.findUnique({ where: { id: goalId } });

    if (!goal) {
      return { success: false, message: "Goal not found." };
    }

    if (goal.ownerId !== user.id) {
      return { success: false, message: "Access denied." };
    }

    if (!id) {
      // Creating a new goal item
      const goalItem = await prisma.goalItem.create({
        data: {
          goalId,
          value,
          message: message || null,
        },
      });

      markGoalAsCompletedIfNeeded(goal);

      revalidatePath(`/goals/${goalId}`);
      revalidatePath("/goals");

      return {
        success: true,
        message: "Goal item added successfully.",
        data: goalItem,
      };
    } else {
      // Editing an existing goal item
      const existingItem = await prisma.goalItem.findUnique({ where: { id } });

      if (!existingItem) {
        return { success: false, message: "Goal item not found." };
      }

      const goalItem = await prisma.goalItem.update({
        where: { id },
        data: {
          value,
          message: message || null,
        },
      });
      markGoalAsCompletedIfNeeded(goal);

      revalidatePath(`/goals/${goalId}`);
      revalidatePath("/goals");

      return {
        success: true,
        message: "Goal item updated successfully.",
        data: goalItem,
      };
    }
  } catch (error) {
    console.error(`Error ${id ? "updating" : "creating"} goal item:`, error);
    return {
      success: false,
      message: `Failed to ${id ? "update" : "add"} goal item.`,
    };
  }
}
