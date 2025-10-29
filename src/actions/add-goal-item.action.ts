"use server";

import prisma from "@/lib/prisma";
import * as yup from "yup";
import { GoalItem } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

export type AddGoalItemActionState = {
  success: boolean;
  message?: string;
  data?: GoalItem;
  errors?: { field: string; message: string }[];
};

const AddGoalItemSchema = yup.object({
  goalId: yup.number().required(),
  value: yup.number().required(),
  message: yup.string().nullable().optional(),
});

type AddGoalItemInput = yup.InferType<typeof AddGoalItemSchema>;

const capitalize = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

export async function addGoalItem(
  input: AddGoalItemInput
): Promise<AddGoalItemActionState> {
  const { user } = await getSession();
  if (!user) return { success: false, message: "Access denied." };
  
  const errors: AddGoalItemActionState["errors"] = [];

  const parsedInput = await AddGoalItemSchema.validate(input, {
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

  try {
    // Check if the goal exists and user has access
    const goal = await prisma.goal.findUnique({
      where: { id: parsedInput.goalId },
    });

    if (!goal) {
      return { success: false, message: "Goal not found." };
    }

    if (goal.ownerId !== user.id) {
      return { success: false, message: "Access denied." };
    }

    // Create the goal item
    const goalItem = await prisma.goalItem.create({
      data: {
        goalId: parsedInput.goalId,
        value: parsedInput.value,
        message: parsedInput.message || null,
      },
    });

    revalidatePath("/goals");
    return {
      success: true,
      message: "Value added successfully.",
      data: goalItem,
    };
  } catch (error) {
    console.error("Error adding goal item:", error);
    return {
      success: false,
      message: "An error occurred while adding the value.",
    };
  }
}