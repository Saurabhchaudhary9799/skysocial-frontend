import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const vietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-vietnam",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SkySocial",
  description: "Your celestial social community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${vietnam.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="font-manrope min-h-full flex flex-col">
        
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
