"use server";

import { canUserEditGoal } from "@/data/access";
import { getGoalById } from "@/lib/service/goal.service";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { Goal } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, unauthorized } from "next/navigation";

type ActionState = {
  success?: boolean;
  message?: string;
};

export async function deleteGoal(goalId: Goal["id"]): Promise<ActionState> {
  const { user } = await getSession();
  if (!user) return unauthorized();
  const goal = await getGoalById(goalId);
  if (!goal) return notFound();
  if (!canUserEditGoal(user, goal)) unauthorized();

  try {
    await prisma.goal.delete({
      where: { id: goalId },
      include: { items: true },
    });

    revalidatePath(`/goals`);
  } catch (e) {
    console.error(e);
    return { success: false, message: "Could not delete the goal." };
  }
  return { success: true, message: "Goal deleted successfully." };
}
