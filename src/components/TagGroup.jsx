export function TagGroup({ title, items, variant = 'success', emptyMessage }) {
  const palette =
    variant === 'danger'
      ? 'border-red-400/20 bg-red-500/10 text-red-100'
      : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium uppercase tracking-[0.24em] text-slate-300">{title}</h3>
        <span className="text-xs text-slate-500">{items.length} items</span>
      </div>

      {items.length ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item.name}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5 ${palette}`}
            >
              {item.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      )}
    </div>
  );
}
