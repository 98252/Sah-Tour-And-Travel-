import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { WhatsAppFloatingBox } from "@/components/common/whatsapp-box";

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const headingFont = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "Sah Tour And Travel",
    "International tour packages",
    "Domestic tour packages",
    "Verified holidays",
    "Luxury travel itineraries",
    "Dubai holidays",
    "Switzerland scenic tours",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#18253d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${bodyFont.variable} ${headingFont.variable} ${displayFont.variable} scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('sah_font_size');if(s&&['normal','large','extra-large'].indexOf(s)!==-1){document.documentElement.setAttribute('data-font-size',s);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen w-full m-0 p-0 overflow-x-hidden flex flex-col bg-white text-slate-900 font-sans selection:bg-brand-gold-500 selection:text-white">
        {children}
        {/* Floating WhatsApp Action Box at the Bottom (Last) */}
        <WhatsAppFloatingBox />
      </body>
    </html>
  );
}
