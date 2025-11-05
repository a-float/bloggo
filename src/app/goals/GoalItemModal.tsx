import { createOrUpdateGoalItem } from "@/actions/edit-create-goal-item.action";
import { Input, Textarea } from "@/components/form/TextInput";
import Spinner from "@/components/Spinner";
import { GoalDto } from "@/data/goal-dto";
import React from "react";
import toast from "react-hot-toast";

type GoalItemType = GoalDto["items"][0];

type AddGoalItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  goal: GoalDto;
  editingItem?: GoalItemType;
};

export default function GoalItemModal(props: AddGoalItemModalProps) {
  const [newValue, setNewValue] = React.useState(
    props.editingItem?.value?.toString() || ""
  );
  const [newMessage, setNewMessage] = React.useState(
    props.editingItem?.message || ""
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isEditing = !!props.editingItem;

  React.useEffect(() => {
    if (props.editingItem) {
      setNewValue(props.editingItem.value.toString());
      setNewMessage(props.editingItem.message || "");
    } else {
      setNewValue("");
      setNewMessage("");
    }
  }, [props.editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newValue.trim()) {
      toast.error("Please enter a value");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = isEditing
        ? await createOrUpdateGoalItem({
            id: props.editingItem!.id,
            goalId: props.goal.id,
            value: parseFloat(newValue),
            message: newMessage.trim() || null,
          })
        : await createOrUpdateGoalItem({
            goalId: props.goal.id,
            value: parseFloat(newValue),
            message: newMessage.trim() || null,
          });

      if (result.success) {
        setNewValue("");
        setNewMessage("");
        toast.success(
          result.message ||
            `Goal item ${isEditing ? "updated" : "added"} successfully`
        );
        props.onClose();
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
      toast.error(`Failed to ${isEditing ? "update" : "add"} goal item`);
      console.error(
        `Error ${isEditing ? "updating" : "adding"} goal item:`,
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <Input
        label="Value"
        required
        type="number"
        step="any"
        value={newValue}
        onChange={(e) => setNewValue(e.target.value)}
        placeholder={`Value${props.goal.unit ? ` (${props.goal.unit})` : ""}`}
        className="w-full"
        disabled={isSubmitting}
      />
      <Textarea
        label="Message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="What you did..."
        maxLength={256}
        className="w-full field-sizing-content"
        disabled={isSubmitting}
      />
      <div className="flex gap-2 mt-4 justify-end">
        <button
          type="button"
          onClick={() => {
            setNewValue("");
            setNewMessage("");
            props.onClose();
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
          {isSubmitting ? <Spinner /> : isEditing ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}
