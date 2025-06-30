import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import LoginControl from "@/components/LoginControl";
import { FaGithub } from "react-icons/fa6";
import { ThemeController } from "@/components/ThemeController";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script>
          {`document.documentElement.setAttribute("data-theme", localStorage.getItem("theme"))`}
        </script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <div className="navbar bg-base-100 shadow-sm">
          <a href="/" className="btn btn-ghost text-xl">
            Bloggo
          </a>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <a href="/blogs">Blogs</a>
              </li>
            </ul>
          </div>
          <div className="flex-1" />
          <div className="flex gap-2 justify-between items-center">
            <ThemeController />
            <LoginControl />
          </div>
        </div>
        {children}
        <Toaster />
        <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 mt-auto">
          <aside className="flex justify-center items-center gap-2">
            Created by Mati
            <a href="https://github.com/a-float">
              <FaGithub />
            </a>
          </aside>
        </footer>
      </body>
    </html>
  );
}
