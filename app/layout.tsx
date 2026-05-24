import type { Metadata } from "next";
import { Playfair_Display, Raleway } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Blue Nova | Luxury Fashion",
    template: "%s | Blue Nova",
  },
  description:
    "Blue Nova — a luxury female fashion brand offering premium handbags, shoes, clothes, and sunglasses.",
  keywords: ["luxury fashion", "handbags", "shoes", "sunglasses", "Blue Nova"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Blue Nova",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${raleway.variable}`}>
      <body className="font-body bg-white text-brand-black antialiased">
        <Header />
        <CartDrawer />
        {children}
        <Footer />
      </body>
    </html>
  );
}
