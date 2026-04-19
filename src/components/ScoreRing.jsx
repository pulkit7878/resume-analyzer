export function ScoreRing({ score, label = 'Match Score' }) {
  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-52 w-52 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 via-transparent to-violet-500/20 blur-xl" />
      <svg className="-rotate-90 h-52 w-52" viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="rgba(148, 163, 184, 0.18)"
          strokeWidth="14"
          fill="none"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center text-center">
        <span className="text-5xl font-semibold tracking-tight text-white">{score}%</span>
        <span className="mt-1 text-sm uppercase tracking-[0.32em] text-slate-400">{label}</span>
      </div>
    </div>
  );
}
