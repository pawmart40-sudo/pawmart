import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PawMart - Pet Shop",
  description: "Premium pet products in Bangladesh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={'&{inter.className} text-gray-900'}>
        <Providers>
          <CartProvider>
            {children}
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}