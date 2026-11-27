export function DefaultBrandCrest({
  brandName,
  brandSubtitle,
  iconClassName,
  wordmarkClassName,
  subClassName,
}: {
  brandName: string;
  brandSubtitle: string;
  iconClassName: string;
  wordmarkClassName: string;
  subClassName: string;
}) {
  return (
    <svg viewBox="0 0 151 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g className={iconClassName}>
        <circle cx="75.5" cy="34" r="22" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="M75.5 12V56M53.5 34H97.5M60 18.5L91 49.5M91 18.5L60 49.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M62 63C67 59 84 59 89 63" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <g className={wordmarkClassName}>
        <text
          x="75.5"
          y="102"
          textAnchor="middle"
          fill="currentColor"
          fontSize="30"
          fontFamily="var(--rk-font-display)"
          letterSpacing="2"
        >
          {brandName}
        </text>
      </g>
      <g className={subClassName}>
        <text
          x="75.5"
          y="124"
          textAnchor="middle"
          fill="currentColor"
          fontSize="16"
          fontFamily="var(--rk-font-display)"
          fontStyle="italic"
        >
          {brandSubtitle}
        </text>
      </g>
    </svg>
  );
}
