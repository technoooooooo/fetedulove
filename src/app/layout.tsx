import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fiona & Antoine — Fête du Love | 5-6 Sept. 2026",
  description:
    "On se marie et on vous invite à faire la fête avec nous ! Rendez-vous les 5 et 6 septembre 2026.",
  openGraph: {
    title: "Fiona & Antoine vous invitent à la Fête du Love",
    description: "5-6 septembre 2026 — On se marie et on compte sur vous !",
    type: "website",
    images: [
      {
        url: "/faire-part.jpg",
        width: 600,
        height: 850,
        alt: "Faire-part Fiona & Antoine — Fête du Love",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiona & Antoine vous invitent à la Fête du Love",
    description: "5-6 septembre 2026 — On se marie et on compte sur vous !",
    images: ["/faire-part.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
