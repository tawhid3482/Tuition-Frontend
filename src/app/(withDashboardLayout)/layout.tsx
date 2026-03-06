import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-linear-to-b from-primary/5 via-slate-50 to-white px-4 py-6 md:px-6 md:py-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
