"use client";

export default function Van({
  className = "",
  size = 300,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size * 0.55}
      viewBox="0 0 520 286"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#FFB3D0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {/* Main body shell */}
        <path
          d="M60 220 L60 75 C60 55, 70 45, 90 45 L320 45 C340 45, 355 50, 365 65 L420 145 C428 158, 432 170, 432 185 L432 220"
          fill="#D33B29"
          stroke="#FFB3D0"
        />

        {/* Roof line */}
        <line x1="78" y1="45" x2="320" y2="45" strokeWidth="5" />

        {/* Windshield */}
        <path
          d="M322 52 L322 148 L415 148 L368 68 C360 55, 345 52, 322 52Z"
          fill="#FFB3D0"
          fillOpacity="0.15"
          strokeWidth="3.5"
        />
        {/* Windshield center bar */}
        <line x1="368 " y1="100" x2="322" y2="100" strokeWidth="2.5" opacity="0.6" />

        {/* Side window big */}
        <rect x="170" y="65" width="95" height="70" rx="10" fill="#FFB3D0" fillOpacity="0.12" strokeWidth="3" />

        {/* Side window small */}
        <rect x="78" y="65" width="72" height="70" rx="10" fill="#FFB3D0" fillOpacity="0.12" strokeWidth="3" />

        {/* Divider line (sliding door) */}
        <line x1="162" y1="50" x2="162" y2="220" strokeWidth="2.5" opacity="0.35" />

        {/* Belt line / trim strip */}
        <line x1="60" y1="148" x2="415" y2="148" strokeWidth="3" opacity="0.5" />

        {/* Bottom sill */}
        <line x1="38" y1="220" x2="455" y2="220" strokeWidth="4" />

        {/* Rear bumper */}
        <path d="M60 220 L60 195 L42 195 C36 195, 32 200, 32 206 L32 220 Z" fill="#D33B29" stroke="#FFB3D0" strokeWidth="3" />

        {/* Rear light */}
        <rect x="42" y="178" width="14" height="14" rx="3" fill="#FFB3D0" fillOpacity="0.35" strokeWidth="2.5" />

        {/* Front bumper */}
        <path d="M432 220 L432 190 L452 190 C460 190, 464 196, 464 204 L464 220 Z" fill="#D33B29" stroke="#FFB3D0" strokeWidth="3" />

        {/* Headlight */}
        <circle cx="450" cy="168" r="12" fill="#FFB3D0" fillOpacity="0.3" strokeWidth="3" />
        <circle cx="450" cy="168" r="5" fill="#FFB3D0" fillOpacity="0.2" strokeWidth="0" />

        {/* Front indicator */}
        <rect x="444" y="185" width="14" height="6" rx="2" fill="#FFB3D0" fillOpacity="0.25" strokeWidth="2" />

        {/* --- Front wheel --- */}
        <circle cx="370" cy="220" r="36" fill="#FFCADD" stroke="#FFB3D0" strokeWidth="4" />
        <circle cx="370" cy="220" r="22" strokeWidth="3" />
        <circle cx="370" cy="220" r="7" fill="#FFB3D0" strokeWidth="0" />
        {/* Wheel bolts */}
        <circle cx="370" cy="204" r="2.5" fill="#FFB3D0" strokeWidth="0" />
        <circle cx="370" cy="236" r="2.5" fill="#FFB3D0" strokeWidth="0" />
        <circle cx="354" cy="220" r="2.5" fill="#FFB3D0" strokeWidth="0" />
        <circle cx="386" cy="220" r="2.5" fill="#FFB3D0" strokeWidth="0" />

        {/* Wheel arch front */}
        <path d="M330 220 C330 198, 348 180, 370 180 C392 180, 410 198, 410 220" fill="#FFCADD" stroke="#FFB3D0" strokeWidth="4" />

        {/* --- Rear wheel --- */}
        <circle cx="118" cy="220" r="36" fill="#FFCADD" stroke="#FFB3D0" strokeWidth="4" />
        <circle cx="118" cy="220" r="22" strokeWidth="3" />
        <circle cx="118" cy="220" r="7" fill="#FFB3D0" strokeWidth="0" />
        {/* Wheel bolts */}
        <circle cx="118" cy="204" r="2.5" fill="#FFB3D0" strokeWidth="0" />
        <circle cx="118" cy="236" r="2.5" fill="#FFB3D0" strokeWidth="0" />
        <circle cx="102" cy="220" r="2.5" fill="#FFB3D0" strokeWidth="0" />
        <circle cx="134" cy="220" r="2.5" fill="#FFB3D0" strokeWidth="0" />

        {/* Wheel arch rear */}
        <path d="M78 220 C78 198, 96 180, 118 180 C140 180, 158 198, 158 220" fill="#FFCADD" stroke="#FFB3D0" strokeWidth="4" />

        {/* Side mirror */}
        <path d="M432 120 L448 116 L450 126 L434 128Z" fill="#D33B29" strokeWidth="2.5" />

        {/* Door handle */}
        <line x1="175" y1="160" x2="195" y2="160" strokeWidth="3.5" />
        <circle cx="195" cy="160" r="2" fill="#FFB3D0" strokeWidth="0" />

        {/* VW-style emblem circle */}
        <circle cx="248" cy="184" r="18" strokeWidth="3" fill="#D33B29" />
        {/* Heart inside emblem */}
        <path
          d="M248 177 C245 172, 238 174, 238 179 C238 184, 248 192, 248 192 C248 192, 258 184, 258 179 C258 174, 251 172, 248 177Z"
          fill="#FFB3D0"
          strokeWidth="0"
        />
      </g>
    </svg>
  );
}
