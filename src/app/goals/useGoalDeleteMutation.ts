import { deleteGoal } from "@/actions/delete-goal.action";
import { GoalDto } from "@/data/goal-dto";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function useGoalDeleteMutation() {
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["deleteGoal"],
    mutationFn: (goalId: GoalDto["id"]) => deleteGoal(goalId),
    onSuccess: () => {
      toast.success(`Goal deleted successfully`);
      router.refresh();
    },
    onError: () => {
      toast.error(`Failed to delete goal`);
    },
  });

  const handleDelete = (goalId: GoalDto["id"]) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this goal? This action cannot be undone.",
      )
    ) {
      return;
    }
    mutation.mutate(goalId);
  };

  return { isLoading: mutation.isPending || mutation.isSuccess, handleDelete };
}
