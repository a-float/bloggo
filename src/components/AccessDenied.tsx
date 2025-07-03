import { getSession } from "@/lib/session";
import React from "react";

export default async function AccessDenied() {
  const { user } = await getSession();

  return (
    <div className="flex flex-col items-center justify-center pt-32 max-w-md mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
      <p className="text-md mb-8">
        You don&apos;t have permission to view this page.
        <br />
        {!user ? " Please try logging in." : ""}
      </p>
    </div>
  );
}
