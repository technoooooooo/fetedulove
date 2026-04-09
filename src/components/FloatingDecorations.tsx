"use client";

import DiscoBall from "./DiscoBall";
import FourPointStar from "./FourPointStar";
import { useState } from "react";

type DecoItem = {
  Component: React.ComponentType<{ className?: string; size?: number }>;
  top: string;
  left?: string;
  right?: string;
  size: number;
  animation: string;
  opacity: string;
  hideOnMobile?: boolean;
  hoverable?: boolean;
};

const decorations: DecoItem[] = [
  // ---- Hero area (0-15vh) — disco balls only ----
  { Component: DiscoBall, top: "4vh", right: "8%", size: 65, animation: "animate-float", opacity: "opacity-50", hoverable: true },
  { Component: DiscoBall, top: "6vh", left: "5%", size: 50, animation: "animate-float-reverse", opacity: "opacity-40", hoverable: true },
  { Component: DiscoBall, top: "13vh", right: "25%", size: 40, animation: "animate-float", opacity: "opacity-35", hideOnMobile: true, hoverable: true },
  { Component: DiscoBall, top: "11vh", left: "22%", size: 45, animation: "animate-float-reverse", opacity: "opacity-30", hideOnMobile: true, hoverable: true },

  // ---- Post-hero / marquee area (18-30vh) ----
  { Component: DiscoBall, top: "20vh", left: "3%", size: 75, animation: "animate-float-reverse", opacity: "opacity-40", hoverable: true },
  { Component: FourPointStar, top: "22vh", right: "12%", size: 24, animation: "animate-twinkle", opacity: "opacity-50" },
  { Component: FourPointStar, top: "28vh", left: "18%", size: 16, animation: "animate-twinkle", opacity: "opacity-40", hideOnMobile: true },

  // ---- Countdown area (30-42vh) ----
  { Component: FourPointStar, top: "35vh", left: "8%", size: 20, animation: "animate-twinkle", opacity: "opacity-50" },
  { Component: DiscoBall, top: "40vh", right: "15%", size: 45, animation: "animate-float-reverse", opacity: "opacity-30", hideOnMobile: true, hoverable: true },
  { Component: FourPointStar, top: "33vh", right: "6%", size: 18, animation: "animate-twinkle", opacity: "opacity-40" },

  // ---- Faire-part / programme area (42-60vh) ----
  { Component: FourPointStar, top: "46vh", right: "8%", size: 26, animation: "animate-twinkle", opacity: "opacity-45" },
  { Component: DiscoBall, top: "50vh", left: "6%", size: 55, animation: "animate-float", opacity: "opacity-35", hideOnMobile: true, hoverable: true },
  { Component: FourPointStar, top: "57vh", left: "20%", size: 14, animation: "animate-twinkle", opacity: "opacity-40", hideOnMobile: true },

  // ---- Lieux area (60-75vh) ----
  { Component: FourPointStar, top: "62vh", left: "5%", size: 22, animation: "animate-twinkle", opacity: "opacity-50" },
  { Component: DiscoBall, top: "68vh", right: "4%", size: 65, animation: "animate-float-reverse", opacity: "opacity-30", hideOnMobile: true, hoverable: true },
  { Component: FourPointStar, top: "72vh", left: "4%", size: 18, animation: "animate-twinkle", opacity: "opacity-40" },

  // ---- Infos / RSVP area (75-90vh) ----
  { Component: FourPointStar, top: "78vh", left: "12%", size: 20, animation: "animate-twinkle", opacity: "opacity-45" },
  { Component: DiscoBall, top: "85vh", left: "7%", size: 50, animation: "animate-float", opacity: "opacity-35", hideOnMobile: true, hoverable: true },
  { Component: FourPointStar, top: "86vh", right: "20%", size: 18, animation: "animate-twinkle", opacity: "opacity-40" },
  { Component: FourPointStar, top: "82vh", left: "4%", size: 14, animation: "animate-twinkle", opacity: "opacity-35" },

  // ---- Footer area (90-100vh) ----
  { Component: FourPointStar, top: "96vh", left: "30%", size: 16, animation: "animate-twinkle", opacity: "opacity-35" },
  { Component: FourPointStar, top: "93vh", right: "10%", size: 20, animation: "animate-twinkle", opacity: "opacity-30" },
];

function DecorationItem({ d }: { d: DecoItem }) {
  const [spinning, setSpinning] = useState(false);

  return (
    <div
      className={`absolute ${d.animation} ${d.opacity} ${d.hideOnMobile ? "hidden sm:block" : ""} ${d.hoverable ? "pointer-events-auto cursor-pointer" : ""}`}
      style={{
        top: d.top,
        ...(d.left ? { left: d.left } : {}),
        ...(d.right ? { right: d.right } : {}),
      }}
      onMouseEnter={d.hoverable ? () => setSpinning(true) : undefined}
      onMouseLeave={d.hoverable ? () => setSpinning(false) : undefined}
    >
      <div
        className={spinning ? "animate-spin-slow" : ""}
        style={spinning ? { transition: "none" } : { transition: "transform 0.5s ease-out" }}
      >
        <d.Component size={d.size} />
      </div>
    </div>
  );
}

export default function FloatingDecorations() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {decorations.map((d, i) => (
        <DecorationItem key={i} d={d} />
      ))}
    </div>
  );
}
