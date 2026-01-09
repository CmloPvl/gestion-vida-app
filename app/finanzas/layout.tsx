// app/finanzas/layout.tsx
export default function FinanzasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-slate-50">
      {/* Aquí podríamos poner un menú superior fijo después */}
      {children} 
    </section>
  );
}