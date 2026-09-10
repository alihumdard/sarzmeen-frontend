export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto max-w-[var(--container-width)] px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
