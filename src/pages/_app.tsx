import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DefaultSeo } from "next-seo";
import SEO from "next-seo.config";
import type { AppProps } from "next/app";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      
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
