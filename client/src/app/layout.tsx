import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import UnAuthNavbar from "@/components/unauth-navbar";
import { Analytics } from '@vercel/analytics/react';
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <UnAuthNavbar />
            {children}
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
