import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DefaultSeo } from "next-seo";
import SEO from "next-seo.config";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import Script from "next/script";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-roboto",
});
const GA_MEASUREMENT_ID = 'G-DQZ3JPQ1XG';

const ADS_FALLBACK_DELAY_MS = 5000;
const INTERACTION_EVENTS = ['scroll', 'pointerdown', 'touchstart', 'keydown', 'mousemove'] as const;

const isDashboardRoute = (pathname: string) =>
  pathname === '/auth' || pathname.startsWith('/admin') || pathname.startsWith('/cms');

/** True once the reader interacts (or after a fallback delay), so ad code stays off the critical path. */
function useDeferredAds(enabled: boolean) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled || ready) return;
    const trigger = () => setReady(true);
    const timer = window.setTimeout(trigger, ADS_FALLBACK_DELAY_MS);
    INTERACTION_EVENTS.forEach((e) => window.addEventListener(e, trigger, { once: true, passive: true }));
    return () => {
      window.clearTimeout(timer);
      INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, trigger));
    };
  }, [enabled, ready]);

  return ready;
}

export default function App({ Component, pageProps, router }: AppProps) {
  const publicPage = !isDashboardRoute(router.pathname);
  const loadAds = useDeferredAds(publicPage);
  return (
    <QueryClientProvider client={queryClient}>
      <style jsx global>{`
        :root {
          --font-roboto: ${roboto.style.fontFamily};
        }
      `}</style>
      {publicPage ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="lazyOnload"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      ) : null}
      {publicPage && loadAds ? (
        <Script
          id="adsbygoogle-js"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9758177091764288"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      ) : null}
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <DefaultSeo {...SEO} />
            <Component {...pageProps} />
          </TooltipProvider>
        </AuthProvider>
     
    </QueryClientProvider>
  );
}
