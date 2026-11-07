/**
 * The "jodhiambo" logo: a crimson tile with a rising-curve mark (an actuarial
 * projection) and the lowercase wordmark. The wordmark uses the current text
 * colour, so the logo reads correctly in light mode, dark mode and the footer.
 * Standalone files: /public/jodhiambo.svg (light backgrounds) and
 * /public/jodhiambo-dark.svg (dark backgrounds).
 */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden focusable="false">
      <rect width="40" height="40" rx="11" fill="#c0392b" />
      <path
        d="M8 27.5c5.5 0 7.5-9 13-9 4 0 4.5 3.5 7.5 3.5 2 0 3.3-2.5 4-7.5"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="32.6" cy="14.3" r="2.6" fill="#fff" />
      <path d="M8 32h24" stroke="#fff" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <LogoMark />
      <span
        aria-hidden
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: "1.45rem",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: "currentColor",
        }}
      >
        jodhiambo
      </span>
      <span className="visually-hidden">Jodhiambo</span>
    </span>
  );
}
