import type { Metadata } from "next";
import ClientProviders from "@/components/ClientProviders";
import "@/styles/index.scss";
import { Inter } from "next/font/google";

// Import FontAwesome CSS
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
// Tell Font Awesome to skip adding the CSS automatically since it's being imported above
config.autoAddCss = false;

// Initialize the Inter font with the variable property
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  // You can specify the weights you need (this is a common range)
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "App Ofertare",
  icons: {
    icon: "/favicons/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
