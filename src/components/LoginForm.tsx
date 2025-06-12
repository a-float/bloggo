"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { Input } from "./form/TextInput";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

const getRedirectUrl = () =>
  new URLSearchParams(location.search).get("callbackUrl") || "/";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    const result = await signIn("credentials", { ...data, redirect: false });
    if (result?.error) {
      toast.error(
        result.error === "CredentialsSignin"
          ? "Invalid email or password"
          : "Seomthing went wrong"
      );
    } else if (result?.ok) {
      router.push(getRedirectUrl());
      router.refresh();
    }
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className="font-bold text-2xl">Sign In</h2>
        <Input
          {...form.register("email")}
          label="Email"
          type="text"
          placeholder="Email"
          className="w-full"
          required
        />
        <Input
          {...form.register("password")}
          label="Password"
          type="password"
          placeholder="Password"
          required
          className="w-full"
        />
        <button type="submit" className="btn btn-primary mt-4 block w-full">
          {form.formState.isSubmitting ? <Spinner /> : "Sign In"}
        </button>
      </form>
      <div className="divider">OR</div>
      <button
        className="btn bg-white text-black border-[#e5e5e5] w-full"
        onClick={() => signIn("google", { callbackUrl: getRedirectUrl() })}
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        Login with Google
      </button>
      <p className="mt-4 text-center">
        Don&apos;t have an account?{" "}
        <Link href="./register" className="text-primary underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
