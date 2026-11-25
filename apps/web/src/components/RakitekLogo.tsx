interface RakitekLogoProps {
  size?: number;
  className?: string;
}

export function RakitekLogo({ size = 28, className = "" }: RakitekLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      <rect width="28" height="28" rx="4" fill="#111115" />
      <rect x="0.5" y="0.5" width="27" height="27" rx="3.5" stroke="rgba(250,250,248,0.18)" />
      <rect x="5" y="5" width="3.5" height="18" fill="#FAFAF8" />
      <rect x="8.5" y="5" width="10.5" height="3.5" fill="#FAFAF8" />
      <rect x="19" y="5" width="4" height="3.5" fill="#E5B869" />
      <rect x="19" y="8.5" width="4" height="3.5" fill="#FAFAF8" />
      <rect x="8.5" y="12" width="10.5" height="3.5" fill="#FAFAF8" />
      <rect x="15.5" y="15.5" width="3.5" height="3.5" fill="#FAFAF8" />
      <rect x="19" y="19" width="4" height="4" fill="#FAFAF8" />
    </svg>
  );
}
