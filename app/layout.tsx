import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "S.C.I.O.N.",
  description: "Scientific Cognitive Intelligence and Operations Network"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
