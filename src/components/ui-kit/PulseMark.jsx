// Marca: órbita + pulso de mercado. Versión compacta del "Bitcoin Pulse".
export default function PulseMark({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <rect x="0.5" y="0.5" width="31" height="31" rx="10" fill="hsl(var(--surface-2))" stroke="rgba(255,255,255,0.08)" />
      <circle cx="16" cy="16" r="10" stroke="rgba(255,255,255,0.16)" />
      <path d="M6 17h4.5l2.2-5.5 3.3 10 2.4-7 1.6 2.5H26" stroke="#F7931A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="26" cy="17" r="1.9" fill="#F7931A" />
    </svg>
  );
}