const Loading = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 animate-pulse">
        <div className="h-8 w-52 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-200" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`common-skeleton-${index}`} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-[4/3] animate-pulse rounded-t-2xl bg-slate-200" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
              <div className="h-5 w-3/4 rounded bg-slate-200 animate-pulse" />
              <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-slate-200 animate-pulse" />
              <div className="h-9 w-full rounded-lg bg-slate-200 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Loading;
