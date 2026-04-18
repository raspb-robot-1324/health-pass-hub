export function EcgLine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 100"
      preserveAspectRatio="none"
      className={className}
      fill="none"
    >
      <path
        d="M0 50 L120 50 L140 50 L160 20 L180 80 L200 30 L215 50 L350 50 L370 50 L390 10 L410 90 L430 50 L580 50 L600 50 L620 25 L640 75 L660 50 L800 50"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-ecg"
      />
    </svg>
  );
}
