"use client";

import { useState } from "react";
import { GoalDto } from "@/data/goal-dto";
import { FaEdit, FaTrash } from "react-icons/fa";
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
    undefined
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(undefined);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-md">
        <table className="table min-w-[600px]">
          <thead>
            <tr className="bg-base-200">
              <th className="sr-only">Index</th>
              <th>Message</th>
              <th>Value</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {goal.items.map((item, index) => (
              <tr key={item.id}>
                <th>{index + 1}</th>
                <td className="whitespace-pre-line">{item.message || "-"}</td>
                <td>
                  {item.value} {goal.unit}
                </td>
                <td>{dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}</td>
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

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingItem
                ? `Edit Progress for ${goal.title}`
                : `Add Progress to ${goal.title}`}
            </h3>
            <GoalItemModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              goal={goal}
              editingItem={editingItem}
            />
          </div>
          <div className="modal-backdrop" onClick={handleCloseModal} />
        </div>
      )}
    </>
  );
}
