import React from "react";
import LoginForm from "@/app/auth/login/LoginForm";

export default function Login() {
  return (
    <React.Suspense>
      <LoginForm />
    </React.Suspense>
  );
}
