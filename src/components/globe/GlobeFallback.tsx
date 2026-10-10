/** Static SVG used when WebGL is unavailable or the 3D scene fails to load. */
export function GlobeFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 400 400" className="h-full max-h-[420px] w-full max-w-[420px]" aria-hidden="true">
        <defs>
          <radialGradient id="gf-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="190" fill="url(#gf-glow)" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="#00E5FF" strokeOpacity="0.6" strokeWidth="1.5" />
        <ellipse cx="200" cy="200" rx="120" ry="40" fill="none" stroke="#00E5FF" strokeOpacity="0.35" />
        <ellipse cx="200" cy="200" rx="120" ry="80" fill="none" stroke="#00E5FF" strokeOpacity="0.25" />
        <ellipse cx="200" cy="200" rx="40" ry="120" fill="none" stroke="#00E5FF" strokeOpacity="0.35" />
        <ellipse cx="200" cy="200" rx="80" ry="120" fill="none" stroke="#00E5FF" strokeOpacity="0.25" />
        <ellipse cx="200" cy="200" rx="170" ry="60" fill="none" stroke="#8B5CF6" strokeOpacity="0.5" transform="rotate(-24 200 200)" />
        <path d="M130 140 Q200 60 280 150" fill="none" stroke="#00E5FF" strokeOpacity="0.7" />
        <path d="M120 250 Q200 330 290 240" fill="none" stroke="#8B5CF6" strokeOpacity="0.7" />
        <circle cx="130" cy="140" r="5" fill="#00E5FF" />
        <circle cx="280" cy="150" r="5" fill="#8B5CF6" />
        <circle cx="120" cy="250" r="5" fill="#8B5CF6" />
        <circle cx="290" cy="240" r="5" fill="#00E5FF" />
      </svg>
    </div>
  );
}
