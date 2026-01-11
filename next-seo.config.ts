// src/next-seo.config.ts
const SEO = {
  title: "GH News - Ghana's Digital News Platform",
  titleTemplate: "%s",
  defaultTitle: "GH News - Ghana's Digital News Platform",
  description: "Your trusted source for Ghanaian news, politics, sports, and more.",
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://ghnewsmedia.com",
    siteName: "GH News",
    images: [
      {
        url: "https://ghnewsmedia.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GH News - Ghana's Digital News Platform",
      },
    ],
  },
  twitter: {
    handle: "@ghnewsmedia",
    site: "@ghnewsmedia",
    cardType: "summary_large_image",
  },
};

export default SEO;
