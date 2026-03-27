"use client";

import { updateUser } from "@/actions/update-user.action";
import { Input } from "@/components/form/TextInput";
import Spinner from "@/components/Spinner";
import { UserDTO } from "@/data/user-dto.ts";
import { useSession } from "next-auth/react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import React from "react";
import { TbLock, TbUser } from "react-icons/tb";

// TODO show a dynamic list of requirements?
const formSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(4, "Password should be at least 4 characters long")
    .max(12, "Password should be no longer than 32 characters"),
  repeatPassword: yup
    .string()
    .required("Confirm Password is required")
    .min(4, "Password should be at least 4 characters long")
    .max(12, "Password should be no longer than 32 characters")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

export default function Account(props: { user: UserDTO }) {
  const { update: updateSession } = useSession();
  const [tab, setTab] = React.useState<"display" | "password">("display");

  const nameForm = useForm({
    values: {
      name: props.user.name || "",
    },
  });

  const passwordForm = useForm({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: { password: "", repeatPassword: "" },
    resolver: yupResolver(formSchema),
  });

  return (
    <div className="">
      <h1 className="text-3xl mb-6">Account Page</h1>
      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
        <ul className="menu rounded-box bg-base-100 w-full md:w-56 shadow">
          <li>
            <a
              className={tab === "display" ? "active" : ""}
              onClick={() => setTab("display")}
            >
              <TbUser />
              Profile
            </a>
          </li>
          <li>
            <a
              className={tab === "password" ? "active" : ""}
              onClick={() => setTab("password")}
            >
              <TbLock />
              Password
            </a>
          </li>
        </ul>
        <div className="bg-base-100 flex-1 rounded-box p-6 shadow">
          {tab === "display" && (
            <>
              <h2 className="text-xl mb-4">Display name</h2>
              <p className="mb-4 max-w-[60ch]">
                This is the name that will be shown to other users. It should be
                at least 3 characters long.
              </p>
              <form
                onSubmit={nameForm.handleSubmit(async ({ name }) => {
                  await updateUser({ name });
                  await updateSession({ name });
                  toast.success("Display name updated successfully");
                })}
              >
                <Input
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
                      message:
                        "Display name must be at least 3 characters long",
                    },
                  })}
                />
                <button
                  type="submit"
                  className="btn btn-primary mt-4 float-right"
                >
                  {nameForm.formState.isSubmitting ? (
                    <Spinner />
                  ) : (
                    "Update display name"
                  )}
                </button>
              </form>
            </>
          )}
          {tab === "password" && (
            <>
              <h2 className="text-xl mb-4">Change Password</h2>
              <p className="mb-4 max-w-[60ch]">
                You can update your password here or create one if you do not
                currently have one.
                <br />
                This will enable you to log in using just your email and
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
                  error={passwordForm.formState.errors.password?.message}
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
                <button
                  type="submit"
                  className="btn btn-primary mt-4 float-right"
                >
                  {passwordForm.formState.isSubmitting ? (
                    <Spinner />
                  ) : (
                    "Update password"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
