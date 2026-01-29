import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Together Pray",
  description: "Prayer community web app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
