import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Bloom Square | Only For Science",
  description: "Next Generation Life Science Reports",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bloom Sq"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
