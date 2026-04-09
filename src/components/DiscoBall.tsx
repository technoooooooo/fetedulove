"use client";

export default function DiscoBall({
  className = "",
  size = 80,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Globe circle */}
      <circle cx="50" cy="50" r="45" stroke="#D33B29" strokeWidth="2.5" fill="none" />
      {/* Horizontal lines */}
      <ellipse cx="50" cy="30" rx="42" ry="4" stroke="#D33B29" strokeWidth="1.5" fill="none" />
      <ellipse cx="50" cy="50" rx="45" ry="4" stroke="#D33B29" strokeWidth="1.5" fill="none" />
      <ellipse cx="50" cy="70" rx="42" ry="4" stroke="#D33B29" strokeWidth="1.5" fill="none" />
      {/* Vertical lines */}
      <ellipse cx="50" cy="50" rx="4" ry="45" stroke="#D33B29" strokeWidth="1.5" fill="none" />
      <ellipse cx="50" cy="50" rx="22" ry="45" stroke="#D33B29" strokeWidth="1.5" fill="none" />
      <ellipse cx="50" cy="50" rx="38" ry="45" stroke="#D33B29" strokeWidth="1.5" fill="none" />
      {/* Shine */}
      <circle cx="35" cy="35" r="6" fill="#D33B29" opacity="0.15" />
      <circle cx="33" cy="33" r="3" fill="#D33B29" opacity="0.25" />
    </svg>
  );
}
