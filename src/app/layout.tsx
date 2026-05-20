import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FarmJudge AI",
  description: "AI-style crypto farming project analyzer for airdrop hunters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
