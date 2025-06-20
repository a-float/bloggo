export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-1 container max-w-7xl mx-auto px-4 md:px-8 py-6 mdxeditor-popup-container">
      {children}
    </main>
  );
}
