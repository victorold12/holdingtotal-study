import type { Metadata } from "next";
import "./globals.css";
import "./study.css";

export const metadata: Metadata = {
  title: "Imersão Holding Total — Estudo técnico local",
  description:
    "Estudo educacional local dos padrões visuais e de interação de Holding Total.",
  robots: { index: false, follow: false, nocache: true },
  icons: { icon: "/source-assets/fav-ht.webp" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <link
          rel="preload"
          href="/source-assets/desk.webp"
          as="image"
          media="(min-width:1025px)"
        />
        <link
          rel="preload"
          href="/source-assets/fundo%20celular-6.webp"
          as="image"
          media="(max-width:1024px)"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
