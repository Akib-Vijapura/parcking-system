import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  manifest: "/manifest.json",
  title: "Water Ville Admin",
  description: "Water Ville admin pannel for parking.",
};

export const viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/logo.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          <StoreProvider>{children}</StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
