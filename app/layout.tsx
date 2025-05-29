import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import NextAuthProvider from "./next-auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FlexiCMS - Build Your Business CMS in Minutes",
  description:
    "Choose from industry-specific modules, select your template, and launch your custom CMS on your own subdomain.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextAuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
