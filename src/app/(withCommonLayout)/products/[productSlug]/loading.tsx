const Loading = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="mb-5 h-5 w-28 rounded bg-slate-200 animate-pulse" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="aspect-[4/3] rounded-2xl border border-slate-200 bg-slate-200 animate-pulse" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`thumb-${index}`} className="aspect-square rounded-xl border border-slate-200 bg-slate-200 animate-pulse" />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
            <div className="h-9 w-4/5 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-slate-200 animate-pulse" />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="h-8 w-36 rounded bg-slate-200 animate-pulse" />
            <div className="mt-3 h-4 w-52 rounded bg-slate-200 animate-pulse" />
          </div>

          <div className="space-y-3">
            <div className="h-10 w-full rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-slate-200 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loading;
