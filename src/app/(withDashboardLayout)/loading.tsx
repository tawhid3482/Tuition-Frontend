const Loading = () => {
  return (
    <section className="p-4 md:p-6">
      <div className="mb-6 h-8 w-56 rounded bg-slate-200 animate-pulse" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`dashboard-loading-${index}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="h-4 w-1/2 rounded bg-slate-200 animate-pulse" />
            <div className="mt-4 h-24 rounded bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Loading;
