import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function VerifyRequest() {
  const session = await getSession();
  if (session.user) redirect("/");
  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Check your email</h1>
      <p className="text-md mb-4">
        A magic login link has been sent to your email address.
      </p>
      <a href="/" className="btn btn-primary float-right">
        Go back home
      </a>
    </>
  );
}
