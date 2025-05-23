"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { Input } from "./form/TextInput";

export default function LoginForm() {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (result?.error) {
          console.error(result.error);
          alert("Invalid credentials");
        } else {
          window.location.href = "/";
        }
      }}
    >
      <h2 className="font-bold text-2xl">Sign In</h2>
      <Input
        label="Email"
        name="email"
        type="text"
        placeholder="Email"
        className="w-full"
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Password"
        required
        className="w-full"
      />
      <button type="submit" className="btn btn-primary mt-4 ml-auto block">
        Sign in
      </button>
      <p className="mt-4 text-center">
        Don&apos;t have an account?{" "}
        <Link href="./register" className="text-primary underline">
          Register here
        </Link>
      </p>
    </form>
  );
}
