"use client";

export default function Marquee({ text, className = "" }: { text: string; className?: string }) {
  const repeated = Array(8).fill(text).join(" \u2764 ") + " \u2764\u00A0";
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="animate-marquee inline-block">
        <span className="inline-block">{repeated}</span>
        <span className="inline-block">{repeated}</span>
      </div>
    </div>
  );
}
