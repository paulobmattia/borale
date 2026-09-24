import type { Metadata, Viewport } from "next";
import { GFS_Didot, EB_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const adsenseClientId =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-7928250617161816";

const gfsDidot = GFS_Didot({
  weight: "400",
  subsets: ["greek"],
  variable: "--font-display",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-reading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Boralê — Leitura Social & Síncrona",
  description:
    "Acompanhe livros em tempo real com seu círculo de leitura, compartilhe notas na margem sem risco de spoilers e dê vida às suas conversas literárias.",
  applicationName: "Boralê",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Boralê",
  },
  other: {
    "google-adsense-account": adsenseClientId,
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F0E3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${gfsDidot.variable} ${ebGaramond.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-paper-100 text-ink-900 antialiased selection:bg-semantic-warning/30 selection:text-ink-900">
        {adsenseClientId && (
          <Script
            id="google-adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {children}
      </body>
    </html>
  );
}
