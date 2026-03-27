export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-1 container max-w-5xl mx-auto px-4 md:px-8 py-6 flex flex-col">
      {children}
    </main>
  );
}
