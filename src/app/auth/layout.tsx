import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-w-[300px] flex-1 flex flex-col">{children}</div>;
}
