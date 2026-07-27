export const site = {
  name: "Gwuma",
  title: "Gwuma — Free offline ebook reader",
  description:
    "Gwuma is a lightweight, free offline ebook reader for TXT, PDF, and EPUB. Scan local folders, save progress, and read without the cloud.",
  url: "https://gwuma.chibuzo.com.ng",
  image:
    "https://res.cloudinary.com/dgtoh3s2a/image/upload/v1785092968/gwuma-web-bg_iwy7nr.webp",
  imageAlt:
    "Fantasy sunset valley with flying open books over misty mountains and ruins",
  repo: "https://github.com/Franklivania/gwuma",
  releasesUrl: "https://github.com/Franklivania/gwuma/releases",
  features: [
    "Scan local folders for TXT, PDF, and EPUB books",
    "Read offline with progress saved between sessions",
    "Library covers and reading progress on book cards",
    "Scroll or paginate, with scroll speed, background, and night light",
    "Themes and a lightweight desktop shell with a collapsible sidebar",
  ],
};

export const softwareApplicationLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  url: site.url,
  description: site.description,
  image: site.image,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Windows, Linux",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: site.features,
  downloadUrl: site.releasesUrl,
};
