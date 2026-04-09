"use client";

export default function MusicPlayer() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <iframe
        src="https://open.spotify.com/embed/track/4wZOmbYApgoF2zD9IHznDD?utm_source=generator&theme=0"
        width="300"
        height="80"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl shadow-lg"
      />
    </div>
  );
}
