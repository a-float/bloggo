import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bloggo",
  description: "Website for keeing blog notes made by me.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className="navbar bg-base-100 shadow-sm">
          <Link href="/" className="btn btn-ghost text-xl">
            Bloggo
          </Link>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link href="/blogs">Blogs</Link>
              </li>
            </ul>
          </div>
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
