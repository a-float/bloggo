export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container max-w-7xl mx-auto px-8 py-6">{children}</main>
  );
}
