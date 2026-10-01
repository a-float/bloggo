export default function BlogsLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="skeleton h-9 w-20" />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-40 rounded-box" />
        ))}
      </div>
    </div>
  );
}
