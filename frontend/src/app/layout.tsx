import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { SkipLink } from "@/components/ui/SkipLink";

export const metadata: Metadata = {
  title: {
    default: "Together Pray - 함께 기도하는 공동체",
    template: "%s | Together Pray",
  },
  description: "기도의 여정을 함께하며, 응답의 순간을 나누는 공간",
  keywords: ["기도", "교회", "공동체", "기도제목", "신앙"],
  authors: [{ name: "Together Pray Team" }],
  creator: "Together Pray",
  publisher: "Together Pray",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Together Pray",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "Together Pray - 함께 기도하는 공동체",
    description: "기도의 여정을 함께하며, 응답의 순간을 나누는 공간",
    siteName: "Together Pray",
  },
  twitter: {
    card: "summary",
    title: "Together Pray - 함께 기도하는 공동체",
    description: "기도의 여정을 함께하며, 응답의 순간을 나누는 공간",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-secondary" suppressHydrationWarning>
        <SkipLink />
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
