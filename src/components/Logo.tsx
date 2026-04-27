export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500"
        style={{ boxShadow: '0 4px 20px var(--accent-glow)' }}
      />
      <div className="absolute inset-[2px] rounded-[8px]" style={{ background: 'var(--bg-elevated)' }} />
      <svg
        viewBox="0 0 24 24"
        className="relative z-10"
        style={{ width: size * 0.6, height: size * 0.6 }}
        fill="none"
        stroke="url(#logoGrad)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4a3" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
        <path d="M12 3c4 4 4 12 0 18-4-6-4-14 0-18z" />
        <path d="M3 21c3-9 9-12 18-12" />
        <circle cx="12" cy="12" r="1.5" fill="url(#logoGrad)" />
      </svg>
    </div>
  );
}
