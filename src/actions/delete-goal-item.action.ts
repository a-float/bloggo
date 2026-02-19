"use server";

import prisma from "@/lib/prisma";
import * as yup from "yup";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

export type DeleteGoalItemActionState = {
  success: boolean;
  message?: string;
  errors?: { field: string; message: string }[];
};

const DeleteGoalItemSchema = yup.object({
  itemId: yup.number().required(),
});

type DeleteGoalItemInput = yup.InferType<typeof DeleteGoalItemSchema>;

const capitalize = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

export async function deleteGoalItem(
  input: DeleteGoalItemInput
): Promise<DeleteGoalItemActionState> {
  const { user } = await getSession();
  if (!user) return { success: false, message: "Access denied." };
  
  const errors: DeleteGoalItemActionState["errors"] = [];

  const parsedInput = await DeleteGoalItemSchema.validate(input, {
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
    // Get the goal item to verify ownership
    const goalItem = await prisma.goalItem.findUnique({
      where: { id: parsedInput.itemId },
      include: { goal: true },
    });

    if (!goalItem) {
      return { success: false, message: "Goal item not found" };
    }

    // Verify user owns the goal
    if (goalItem.goal.ownerId !== user.id) {
      return { success: false, message: "Access denied." };
    }

    // Delete the goal item
    await prisma.goalItem.delete({
      where: { id: parsedInput.itemId },
    });

    revalidatePath(`/goals/${goalItem.goal.id}`);
    revalidatePath('/goals');

    return { 
      success: true, 
      message: "Goal item deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting goal item:", error);
    return { success: false, message: "Failed to delete goal item" };
  }
}