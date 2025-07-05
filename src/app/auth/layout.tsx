import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 bg-base-200 pt-[15vh] flex justify-center">
      <div className="mx-4 w-full max-w-[320px]">{children}</div>
    </main>
  );
}
