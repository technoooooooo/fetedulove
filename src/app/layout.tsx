import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The F&AN Club — Fête du Love | 05-06 Sept. 2026",
  description:
    "Fiona & Antoine vous invitent à leur Fête du Love ! Mariage les 5 et 6 septembre 2026 à Moulins-sur-Allier et Saint-Didier-la-Forêt.",
  openGraph: {
    title: "The F&AN Club — Fête du Love",
    description: "05-06 Septembre 2026 — On vous attend !",
    type: "website",
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
