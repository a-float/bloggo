import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 flex flex-col grid place-items-center pb-24 bg-base-200">
      {children}
    </main>
  );
}
