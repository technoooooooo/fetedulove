"use client";

export default function Camera({
  className = "",
  size = 300,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size * 0.83}
      viewBox="0 0 300 250"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#FFB3D0" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        {/* Éclats de flash */}
        <g className="animate-twinkle" style={{ transformOrigin: "68px 74px" }}>
          <path
            d="M68 20C68 20 71 44 68 52C65 44 68 20 68 20Z"
            fill="#FFB3D0"
            strokeWidth="0"
          />
          <path
            d="M20 62C20 62 44 65 52 62C44 59 20 62 20 62Z"
            fill="#FFB3D0"
            strokeWidth="0"
          />
          <path
            d="M30 24C30 24 46 42 54 46C50 38 30 24 30 24Z"
            fill="#FFB3D0"
            strokeWidth="0"
            opacity="0.7"
          />
        </g>

        {/* Bosse du viseur */}
        <path
          d="M104 64 L112 40 C115 32, 121 28, 129 28 L183 28 C191 28, 197 32, 200 40 L208 64"
          fill="#D33B29"
        />

        {/* Déclencheur */}
        <rect x="228" y="48" width="34" height="16" rx="8" fill="#D33B29" strokeWidth="4" />

        {/* Corps */}
        <rect x="26" y="62" width="248" height="160" rx="28" fill="#D33B29" />

        {/* Objectif */}
        <circle cx="150" cy="142" r="54" fill="#FFB3D0" fillOpacity="0.12" />
        <circle cx="150" cy="142" r="36" strokeWidth="4" />
        <circle cx="150" cy="142" r="15" fill="#FFB3D0" strokeWidth="0" />
        <circle cx="132" cy="124" r="7" fill="#FFB3D0" fillOpacity="0.55" strokeWidth="0" />

        {/* Flash */}
        <rect
          x="52"
          y="88"
          width="36"
          height="24"
          rx="7"
          fill="#FFB3D0"
          fillOpacity="0.35"
          strokeWidth="4"
        />

        {/* Poignée / grip */}
        <line x1="228" y1="100" x2="252" y2="100" strokeWidth="4" opacity="0.5" />
        <line x1="228" y1="118" x2="252" y2="118" strokeWidth="4" opacity="0.5" />
        <line x1="228" y1="136" x2="252" y2="136" strokeWidth="4" opacity="0.5" />

        {/* Petit cœur témoin */}
        <path
          d="M70 190 C66 183, 56 186, 56 193 C56 200, 70 210, 70 210 C70 210, 84 200, 84 193 C84 186, 74 183, 70 190Z"
          fill="#FFB3D0"
          strokeWidth="0"
          opacity="0.8"
        />
      </g>
    </svg>
  );
}
