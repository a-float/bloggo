"use client";

import { updateUser } from "@/actions/update-user.action";
import { Input } from "@/components/form/TextInput";
import Spinner from "@/components/Spinner";
import { UserDTO } from "@/data/user-dto.ts";
import { useSession } from "next-auth/react";
import { FieldError, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Account(props: { user: UserDTO }) {
  const { update: updateSession } = useSession();

  const nameForm = useForm({
    values: {
      name: props.user.name || "",
    },
  });

  const passwordForm = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
    resolver: async (data) => {
      const errors: Record<string, FieldError> = {};
      if (data.password !== data.repeatPassword) {
        errors.repeatPassword = {
          type: "validate",
          message: "Passwords must match",
        };
      }
      return { values: data, errors };
    },
  });

  return (
    <div className="max-w-[80ch] mx-auto">
      <h1 className="text-4xl font-bold mb-4">Account Page</h1>
      <p className="mb-4">
        This is your account page. You can edit your profile information here.
      </p>
      <form
        className="mb-6 flex items-end gap-4"
        onSubmit={nameForm.handleSubmit(async ({ name }) => {
          await updateUser({ name });
          await updateSession({ name });
          toast.success("Display name updated successfully");
        })}
      >
        <Input
          className="min-w-[320px]"
          label="Display Name"
          type="text"
          required
          hideRequired
          placeholder="Display name"
          defaultValue={props.user.name || undefined}
          {...nameForm.register("name", {
            required: "Display name is required",
            minLength: {
              value: 3,
              message: "Display name must be at least 3 characters long",
            },
          })}
        />
        <button type="submit" className="btn btn-soft mb-1">
          {nameForm.formState.isSubmitting ? <Spinner /> : "Update"}
        </button>
      </form>
      <h2 className="text-2xl mb-4">Change Password</h2>
      <p className="mb-4">
        You can update your password here or create one if you do not currently
        have one. This will enable you to log in using just your email and
        password.
      </p>
      <form
        onSubmit={passwordForm.handleSubmit(async ({ password }) => {
          await updateUser({ password });
          passwordForm.reset();
          toast.success("Password updated successfully");
        })}
      >
        <Input
          required
          hideRequired
          label="Password"
          type="password"
          placeholder="Password"
          {...passwordForm.register("password")}
        />
        <Input
          required
          hideRequired
          label="Repeat Password"
          type="password"
          placeholder="Repeat password"
          {...passwordForm.register("repeatPassword")}
          error={passwordForm.formState.errors.repeatPassword?.message}
        />
        <button type="submit" className="btn btn-primary mt-4">
          {passwordForm.formState.isSubmitting ? (
            <Spinner />
          ) : (
            "Update password"
          )}
        </button>
      </form>
    </div>
  );
}
