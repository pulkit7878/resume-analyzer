function BackgroundOrb({ className }) {
  return <div className={`absolute rounded-full blur-3xl ${className}`} />;
}

export function BackgroundOrbs() {
  return (
    <>
      <BackgroundOrb className="left-[5%] top-16 h-64 w-64 animate-float bg-blue-500/20" />
      <BackgroundOrb className="right-[8%] top-24 h-80 w-80 animate-float bg-violet-500/20 [animation-delay:2s]" />
      <BackgroundOrb className="bottom-16 left-1/3 h-72 w-72 animate-float bg-cyan-400/10 [animation-delay:4s]" />
    </>
  );
}
