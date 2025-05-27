"use client";

import { createUser } from "@/actions/create-user.action";
import { Input } from "@/components/form/TextInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget)) as {
          email: string;
          name: string;
          password: string;
        };
        await createUser(data)
          .then(() => {
            toast.success("User created successfully");
            router.push("/auth/login");
          })
          .catch(() => {
            toast.error("Error creating user");
          });
      }}
    >
      <h2 className="font-bold text-2xl">Register</h2>
      <Input
        type="text"
        name="email"
        label="Email"
        placeholder="Enter your email"
        required
        className="input input-bordered"
      />
      <Input
        type="name"
        name="name"
        label="Name"
        placeholder="Enter your display name"
        required
        className="input input-bordered"
      />
      <Input
        type="password"
        name="password"
        label="Password"
        placeholder="Enter your password"
        required
        className="input input-bordered"
      />

      <button type="submit" className="btn btn-primary mt-4 block w-full">
        Register
      </button>
      <p className="mt-4">
        Already have an account?{" "}
        <Link href="./login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
