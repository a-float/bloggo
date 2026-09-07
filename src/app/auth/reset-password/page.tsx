"use client";

import { VerificationTokenType } from "@prisma/client";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEnvelope } from "react-icons/fa6";
import { emailTypeMapper } from "@/lib/email/email-type-mapper";
import { Input } from "../../../components/form/TextInput";
import Spinner from "../../../components/Spinner";

export default function ResetPassword() {
  const form = useForm({ defaultValues: { email: "" } });

  const onSubmit = async (data: { email: string }) => {
    const res = await signIn("email", {
      email: emailTypeMapper.encode(
        VerificationTokenType.RESET_PASSWORD,
        data.email,
      ),
      redirect: false,
      callbackUrl: "/account",
    });
    if (!res.error) {
      toast.success("Reset password email sent successfully!");
    } else {
      toast.error("There is no user with that email address.");
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mb-2">Reset password</h2>
      <p className="text-sm text-base-content/60 my-2">
        Type your email address and we&apos;ll send you a link to reset you
        password.
      </p>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Input
          {...form.register("email")}
          required
          label="Email"
          type="email"
          placeholder="Email"
          className="w-full"
        />

        <button type="submit" className="btn btn-primary mt-4 w-full">
          {form.formState.isSubmitting ? (
            <Spinner />
          ) : (
            <>
              <FaEnvelope />
              Send password reset email
            </>
          )}
        </button>
        <p className="mt-4 text-sm text-base-content/60">
          <a href="./login" className="link">
            Go back to login
          </a>
        </p>
      </form>
    </div>
  );
}
