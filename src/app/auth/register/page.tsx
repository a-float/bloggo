"use client";

import { createUser } from "@/actions/create-user.action";
import { Input } from "@/components/form/TextInput";
import Spinner from "@/components/Spinner";
import { emailTypeMapper } from "@/lib/email/email-type-mapper";
import { VerificationTokenType } from "@prisma/client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = (data: { email: string; name: string; password: string }) =>
    createUser(data)
      .then(() =>
        // the email flow handles verification of created user's email
        signIn("email", {
          email: emailTypeMapper.encode(
            VerificationTokenType.VERIFY_EMAIL,
            data.email
          ),
          redirect: false,
          callbackUrl: "/",
        })
      )
      .then(() => {
        toast.success("User created successfully");
        router.push("/auth/login?pass=1");
      })
      .catch((e) => {
        toast.error(e.message || "Something went wrong");
      });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <h2 className="font-bold text-2xl">Register</h2>
      <Input
        {...form.register("email")}
        label="Email"
        type="email"
        placeholder="Enter your email"
        required
        className="input input-bordered"
      />
      <Input
        {...form.register("name")}
        type="name"
        label="Name"
        placeholder="Enter your display name"
        required
        className="input input-bordered"
      />
      <Input
        {...form.register("password")}
        type="password"
        label="Password"
        placeholder="Enter your password"
        required
        className="input input-bordered"
      />

      <button type="submit" className="btn btn-primary mt-4 block w-full">
        {form.formState.isSubmitting ? <Spinner /> : "Register"}
      </button>
      <p className="mt-4 text-sm text-base-content/60">
        Already have an account?{" "}
        <a href="./login" className="link hover:link-primary">
          Log in
        </a>
      </p>
    </form>
  );
}
