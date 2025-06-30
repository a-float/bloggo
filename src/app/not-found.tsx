export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center pt-32 max-w-md mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-md mb-8">
        <a href="/" className="link">
          Go back home
        </a>
      </p>
    </div>
  );
}
