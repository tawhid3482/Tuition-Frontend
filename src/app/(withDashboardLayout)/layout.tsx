import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
