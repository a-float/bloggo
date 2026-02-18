"use client";

import { useState } from "react";
import { GoalDto } from "@/data/goal-dto";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TbPlus } from "react-icons/tb";
import dayjs from "dayjs";
import GoalItemModal from "../GoalItemModal";
import { deleteGoalItem } from "@/actions/delete-goal-item.action";
import toast from "react-hot-toast";

type GoalItemType = GoalDto["items"][0];

type GoalItemsTableProps = {
  goal: GoalDto;
};

export default function GoalItemsTable({ goal }: GoalItemsTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GoalItemType | undefined>(
    undefined,
  );
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleEditItem = (item: GoalItemType) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setIsDeleting(itemId);
    try {
      const result = await deleteGoalItem({ itemId });

      if (result.success) {
        toast.success(result.message || "Goal item deleted successfully");
        // The page will be revalidated automatically
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
      toast.error("Failed to delete goal item");
      console.error("Error deleting goal item:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCreateNewItem = () => {
    setIsModalOpen(true);
    setEditingItem(undefined);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(undefined);
  };

  return (
    <section className="py-4">
      <div className="flex justify-between gap-4 flex-wrap items-center mb-2">
        <h2 className="card-title">Progress entries</h2>
        <button
          type="button"
          onClick={handleCreateNewItem}
          className="btn btn-soft btn-xs"
        >
          <TbPlus />
          Add progress
        </button>
      </div>
      <div className="overflow-x-auto rounded-md">
        <table className="table min-w-[600px]">
          <thead>
            <tr className="bg-base-200">
              <th>Date</th>
              <th>Message</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {goal.items.map((item) => (
              <tr key={item.id}>
                <td>{dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}</td>
                <td className="whitespace-pre-line">{item.message || "N/A"}</td>
                <td>
                  {item.value} {goal.unit}
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost btn-square"
                      onClick={() => handleEditItem(item)}
                      title="Edit item"
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-square btn-ghost btn-error"
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={isDeleting === item.id}
                      title="Delete item"
                    >
                      {isDeleting === item.id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GoalItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        goal={goal}
        editingItem={editingItem}
      />
    </section>
  );
}
