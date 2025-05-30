import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center pt-32 max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-md mb-8 text-center">
        <Link href="/" className="link">
          Go back home
        </Link>
      </p>
    </div>
  );
}
