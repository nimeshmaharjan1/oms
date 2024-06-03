import "@/styles/globals.css";
import { DM_Sans as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { ModeToggle } from "@/components/theme-toggle";
import QueryProvider from "@/providers/query-client.provider";
import type { Metadata } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "OMS",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
