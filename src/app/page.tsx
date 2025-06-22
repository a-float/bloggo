
export default function Home() {
  return (
    <main className="hero bg-base-200 flex-1">
      <div className="hero-content text-center pb-20">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Bloggo</h1>
          <p className="py-6">
            A lil&apos; app for travel memories and things we do daily.
          </p>
          <a href="/blogs" className="btn btn-primary">
            View blogs
          </a>
        </div>
      </div>
    </main>
  );
}
