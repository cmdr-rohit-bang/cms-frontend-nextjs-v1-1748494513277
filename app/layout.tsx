import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import NextAuthProvider from "./next-auth-provider";
import { Toaster } from "sonner";

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
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
