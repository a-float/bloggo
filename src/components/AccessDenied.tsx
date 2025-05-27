import { getServerSession } from "next-auth";
import React from "react";

export default async function AccessDenied() {
  const session = await getServerSession();

  return (
    <div className="flex flex-col items-center justify-center h-screen max-w-md">
      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
      <p className="text-lg mb-8">
        You do not have permission to view this page.
      </p>
      {!session?.user ? (
        <>
          <p className="mb-4">Please try logging in</p>
          {/* <LoginForm /> */}
        </>
      ) : null}
    </div>
  );
}
