"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Input } from "./form/TextInput";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import { FaLock } from "react-icons/fa6";
import { VerificationTokenType } from "@prisma/client";
import { emailTypeMapper } from "@/lib/email/email.type.mapper";

const getRedirectUrl = () =>
  new URLSearchParams(location.search).get("callbackUrl") || "/";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const initialUsePassword = useSearchParams().get("pass") === "1";
  const [usePassword, _setUsePassword] = React.useState(initialUsePassword);

  const setUsePassword = (value: boolean) => {
    _setUsePassword(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("pass", value ? "1" : "0");
    history.replaceState(null, "", `?${params.toString()}`);
  };

  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    if (usePassword) {
      const result = await signIn("credentials", { ...data, redirect: false });
      if (result?.error) {
        toast.error(
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : "Something went wrong"
        );
      } else if (result?.ok) {
        router.push(getRedirectUrl());
        router.refresh();
      }
    } else {
      await signIn("email", {
        email: emailTypeMapper.encode(VerificationTokenType.LOGIN, data.email),
        callbackUrl: getRedirectUrl(),
      });
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mb-2">Log in</h2>
      <>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Input
            {...form.register("email")}
            label="Email"
            type={usePassword ? "text" : "email"}
            placeholder="Email"
            className="w-full"
            required
          />
          <div className="fieldset mt-2">
            <label className="label">
              <input
                name="usePassword"
                type="checkbox"
                className="toggle toggle-sm checked:toggle-primary"
                checked={usePassword}
                onChange={(e) => setUsePassword(e.target.checked)}
              />
              <span>I want to login with password</span>
            </label>
          </div>
          {usePassword ? (
            <>
              <Input
                {...form.register("password")}
                label="Password"
                type="password"
                placeholder="Password"
                required
                className="w-full"
              />

              <button type="submit" className="btn btn-primary mt-4 w-full">
                {form.formState.isSubmitting ? (
                  <Spinner />
                ) : (
                  <>
                    <FaLock />
                    Login with Password
                  </>
                )}
              </button>
              <p className="mt-4 text-sm text-base-content/60">
                Don&apos;t have an account?{" "}
                <a href="./register" className="link hover:link-primary">
                  Register here
                </a>
              </p>
            </>
          ) : (
            <button className="btn btn-primary w-full mt-4" type="submit">
              <svg
                aria-label="Email icon"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              Login with Email
            </button>
          )}
        </form>
        <div className="divider my-6">OR</div>

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
      </>
    </div>
  );
}
