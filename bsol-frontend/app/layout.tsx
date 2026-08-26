import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/QueryProvider";
import ToastProvider from "@/providers/ToastProvider";
import { MasterProvider } from "@/providers/MasterProvider";
import { LocaleProvider } from "@/providers/LocaleProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BachelorSolution - Premium Living for Bachelors",
  description:
    "Find verified rooms, roommates, food stalls, mess, and study rooms in Pune.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        notoDevanagari.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <MasterProvider>
            <LocaleProvider>
              {children}
              <ToastProvider />
            </LocaleProvider>
          </MasterProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
