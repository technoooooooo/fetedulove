"use client";

import { useEffect, useState } from "react";

function getTimeLeft() {
  const wedding = new Date("2026-09-05T14:00:00+02:00").getTime();
  const now = Date.now();
  const diff = wedding - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    return <div className="h-24" />;
  }

  const items = [
    { value: time.days, label: "jours" },
    { value: time.hours, label: "heures" },
    { value: time.minutes, label: "min" },
    { value: time.seconds, label: "sec" },
  ];

  return (
    <div className="flex gap-4 sm:gap-8 justify-center">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <span className="font-display text-4xl sm:text-6xl md:text-7xl leading-none">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="text-sm sm:text-base mt-1 uppercase tracking-widest font-medium opacity-80">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
