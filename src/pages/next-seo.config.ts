// src/next-seo.config.ts
const SEO = {
  title: "GH News Media",
  titleTemplate: "%s | GH News",
  defaultTitle: "GH News Media",
  description: "Your trusted source for Ghanaian news, politics, sports, and more.",
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://ghnewsmedia.com",
    siteName: "GH News Media",
    images: [
      {
        url: "https://ghnewsmedia.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GH News Media",
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
