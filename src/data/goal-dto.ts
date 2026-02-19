import { Prisma } from "@prisma/client";
import { getUserDTO } from "./user-dto.ts";

type FullGoal = Prisma.GoalGetPayload<{
  include: { owner: true; items: true };
}>;

export function getGoalDTO(goal: FullGoal) {
  return {
    id: goal.id,
    title: goal.title,
    description: goal.description,
    tags: goal.tags,
    visibility: goal.visibility,
    unit: goal.unit,
    target: goal.target,
    type: goal.type,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
    completedAt: goal.completedAt,
    status: goal.status,
    items: goal.items.map((item) => ({
      id: item.id,
      value: item.value,
      message: item.message,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    owner: goal.owner ? getUserDTO(goal.owner) : null,
  };
}

export type GoalDto = Awaited<ReturnType<typeof getGoalDTO>>;
