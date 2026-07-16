import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Sampai Jumpa, Semarang",
  description: "Terima kasih dan sampai jumpa, dari kami berempat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
