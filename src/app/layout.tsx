import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import ClientLayout from "./client-layout";
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: "--font-poppins"
})

export const metadata: Metadata = {
  title: "Healthcare Information System",
  description: "A comprehensive healthcare information management system for tracking clients, programs, and health outcomes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}