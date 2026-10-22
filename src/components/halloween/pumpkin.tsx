/** A simple decorative pumpkin (original artwork). Hidden from screen readers. */
export function Pumpkin({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
      <path d="M31 14c0-5 2-8 6-10" stroke="#5c7a3a" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M33 16c4-6 11-6 14-3-5 1-9 3-12 6z" fill="#6f8f45" />
      <ellipse cx="20" cy="38" rx="14" ry="19" fill="#d9650f" />
      <ellipse cx="44" cy="38" rx="14" ry="19" fill="#d9650f" />
      <ellipse cx="32" cy="38" rx="13" ry="21" fill="#ff8a1f" />
      <path d="M32 18c-4 6-4 34 0 41M32 18c4 6 4 34 0 41" stroke="#c45a0c" strokeWidth="1.5" fill="none" opacity=".7" />
    </svg>
  )
}
