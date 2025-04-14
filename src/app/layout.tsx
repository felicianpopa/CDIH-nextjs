import type { Metadata } from "next";
import ClientProviders from "@/components/ClientProviders";
import "@/styles/index.scss";

// Import FontAwesome CSS
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
// Tell Font Awesome to skip adding the CSS automatically since it's being imported above
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "App Ofertare",
  icons: {
    icon: "/favicons/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
