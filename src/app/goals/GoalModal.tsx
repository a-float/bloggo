"use client";

import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input, Textarea } from "@/components/form/TextInput";
import { Select } from "@/components/form/Select";
import TagSelect from "@/components/TagSelect";
import Spinner from "@/components/Spinner";
import { GoalType, GoalVisibility } from "@prisma/client";
import { GoalDto } from "@/data/goal-dto";
import { type TagWithCount } from "@/types/common";
import toast from "react-hot-toast";
import { createOrUpdateGoal } from "@/actions/edit-create-goal.action";
import { FaXmark } from "react-icons/fa6";
import RadioGroup from "@/components/RadioGroup";

type FormValues = {
  id: number | null;
  title: string;
  description: string;
  tags: string[];
  visibility: GoalVisibility;
  unit: string;
  target: number;
  type: GoalType;
};

type GoalModalProps = {
  goal: GoalDto | null;
  tagCounts: TagWithCount[];
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
};

const getDefaultValues = (goal: GoalDto | null): FormValues => {
  if (!goal) {
    return {
      id: null,
      title: "",
      description: "",
      tags: [],
      visibility: GoalVisibility.PRIVATE,
      unit: "",
      target: 0,
      type: GoalType.COUNT,
    };
  }
  return {
    id: goal.id,
    title: goal.title,
    description: goal.description ?? "",
    tags: goal.tags,
    visibility: goal.visibility,
    unit: goal.unit ?? "",
    target: goal.target,
    type: goal.type,
  };
};

export default function GoalModal(props: GoalModalProps) {
  const isEditMode = !!props.goal?.id;

  const form = useForm<FormValues>({
    defaultValues: getDefaultValues(props.goal),
  });

  // Reset form when goal changes (important for switching between create/edit)
  React.useEffect(() => {
    form.reset(getDefaultValues(props.goal));
  }, [props.goal, form]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const result = await createOrUpdateGoal(data);

      if (result.success) {
        form.reset();
        props.onClose();
        props.onSave?.();
        toast.success(
          result.message ||
            `Goal ${isEditMode ? "updated" : "created"} successfully`
        );
      } else {
        // Handle validation errors
        result.errors?.forEach((error: { field: string; message: string }) => {
          form.setError(error.field as keyof FormValues, {
            message: error.message,
          });
        });

        if (result.message) {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? "update" : "create"} goal`);
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} goal:`,
        error
      );
    }
  };

  const handleClose = () => {
    if (form.formState.isDirty) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmClose) return;
    }
    form.reset();
    props.onClose();
  };

  const goalType = form.watch("type");

  React.useEffect(() => {
    if (goalType === GoalType.COUNT) {
      form.setValue("unit", "");
    }
  });

  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleClose}
      />

      <div className="relative bg-base-100 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">
            {isEditMode ? "Edit Goal" : "Create New Goal"}
          </h2>
          <button
            type="button"
            onClick={props.onClose}
            className="btn btn-ghost btn-circle absolute top-4 right-4"
          >
            <FaXmark />
          </button>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
            <Input
              {...form.register("title", {
                required: "Title is required",
                minLength: {
                  value: 1,
                  message: "Title must be at least 1 character long",
                },
              })}
              placeholder="Name your goal..."
              label="Title"
              required
              className="w-full"
              error={form.formState.errors.title?.message}
            />

            <Select
              label="Goal visibility"
              {...form.register("visibility")}
              className="w-full"
              required
            >
              <option value={GoalVisibility.PRIVATE}>🔒 Just me</option>
              <option value={GoalVisibility.FRIENDS}>🧑‍🤝‍🧑 Friends only</option>
              {/* <option value={GoalVisibility.PUBLIC}>🌍 Everyone</option> */}
            </Select>

            <Textarea
              {...form.register("description")}
              label="Description"
              placeholder="Enter goal description..."
              className="w-full resize-none min-h-0 field-sizing-content"
              maxLength={128}
              error={form.formState.errors.title?.message}
            />

            <div className="border border-base-300 rounded-lg px-4 pt-1 pb-2">
              <RadioGroup
                label="Goal Type"
                {...form.register("type")}
                required
                options={[
                  {
                    label: "Count",
                    description:
                      "Track the number of times you complete an action.",
                    value: GoalType.COUNT,
                  },
                  {
                    label: "Sum",
                    description:
                      "Track the total amount accumulated (e.g., hours, pages).",
                    value: GoalType.SUM,
                  },
                  {
                    label: "Max",
                    description: "Track reaching a specified goal.",
                    value: GoalType.MAX,
                  },
                ]}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Goal target"
                  type="number"
                  className="input"
                  required
                  placeholder="The value you aim to reach"
                  error={form.formState.errors.target?.message}
                  {...form.register("target")}
                />

                {goalType !== GoalType.COUNT ? (
                  <Input
                    {...form.register("unit")}
                    label="Unit"
                    placeholder="e.g., hours, pages, km"
                    className="flex-1"
                  />
                ) : null}
              </div>
            </div>

            <Controller
              name="tags"
              control={form.control}
              render={({ field }) => (
                <TagSelect
                  tagCounts={[]}
                  selectedTags={field.value}
                  onChange={(tags) => field.onChange(tags)}
                />
              )}
            />

            <div className="flex justify-between gap-2 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="btn btn-primary"
              >
                {form.formState.isSubmitting ? (
                  <Spinner />
                ) : isEditMode ? (
                  "Save Changes"
                ) : (
                  "Create Goal"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
