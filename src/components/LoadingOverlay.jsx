function StepItem({ label, active, completed }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
      <div
        className={`h-2.5 w-2.5 rounded-full ${
          completed ? 'bg-emerald-400' : active ? 'animate-pulse bg-blue-400' : 'bg-slate-600'
        }`}
      />
      <span className={`${active ? 'text-white' : completed ? 'text-slate-200' : 'text-slate-500'} text-sm`}>
        {label}
      </span>
    </div>
  );
}

export function LoadingOverlay({ visible, stage, stages = [], activeStep = 0 }) {
  if (!visible) {
    return null;
  }

  const progress = stages.length ? ((activeStep + 1) / stages.length) * 100 : 20;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[2rem] bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute h-20 w-20 rounded-full border border-blue-400/20" />
            <div className="absolute h-20 w-20 rounded-full border-2 border-transparent border-t-blue-400 border-r-violet-400 animate-spin" />
            <div className="h-10 w-10 animate-pulseSlow rounded-full bg-gradient-to-br from-blue-400 to-violet-500 blur-sm" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-white">Analyzing resume</p>
            <p className="text-sm text-slate-400">{stage}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-slate-500">
            <span>AI Processing</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {stages.map((item, index) => (
            <StepItem
              key={item}
              label={item}
              active={index === activeStep}
              completed={index < activeStep}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
