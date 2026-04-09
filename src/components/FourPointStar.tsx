"use client";

export default function FourPointStar({
  className = "",
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      fill="#D33B29"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16 0C16 0 18.5 12 16 16C13.5 12 16 0 16 0Z" />
      <path d="M32 16C32 16 20 13.5 16 16C20 18.5 32 16 32 16Z" />
      <path d="M16 32C16 32 13.5 20 16 16C18.5 20 16 32 16 32Z" />
      <path d="M0 16C0 16 12 18.5 16 16C12 13.5 0 16 0 16Z" />
    </svg>
  );
}
