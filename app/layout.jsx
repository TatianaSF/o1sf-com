import "./globals.css";

import { Inter } from "next/font/google";
import Script from "next/script";

import { SiteChrome } from "../components/SiteChrome";
import { SiteInteractionAnalytics } from "../components/analytics/SiteInteractionAnalytics";
import { aiFeedPaths, buildRobotsMetadata, siteConfig } from "../lib/seo";

const googleAnalyticsId = "G-ZCBBZM9LM6";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  category: siteConfig.category,
  alternates: {
    canonical: "/",
    types: {
      "application/json": [
        { url: aiFeedPaths.profile, title: "O1SF machine-readable profile" },
        { url: aiFeedPaths.pages, title: "O1SF public page feed" },
      ],
      "text/plain": [{ url: aiFeedPaths.llms, title: "O1SF LLM summary" }],
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    images: [siteConfig.ogImage],
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage.url],
  },
  robots: buildRobotsMetadata(),
};

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable} data-scroll-behavior="smooth" lang="en">
      <head>
        <Script
          id="google-analytics-config"
          strategy="afterInteractive"
        >
          {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};window.o1sfDirectAnalytics=true;window.gtag('js',new Date());window.gtag('config','${googleAnalyticsId}',{send_page_view:true});`}
        </Script>
        <Script
          id="google-analytics-library"
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="lazyOnload"
        />
      </head>
      <body>
        <SiteInteractionAnalytics />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
