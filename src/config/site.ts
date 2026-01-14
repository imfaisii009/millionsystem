export const siteConfig = {
  name: "MillionSystems",
  description: "Transform your ideas into powerful digital products. Custom software development, web & mobile apps, AI solutions, and IT consulting. Based in Manchester, UK.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://millionsystems.com",
  ogImage: "/og-image.png",
  phone: "+447943111370",
  email: "info@millionsystems.com",
  address: {
    street: "Turner Business Centre, Greengate",
    city: "Middleton, Manchester",
    postcode: "M24 1RU",
    country: "United Kingdom",
  },
  links: {
    github: "https://github.com/millionsystems",
    twitter: "https://twitter.com/millionsystems",
    linkedin: "https://linkedin.com/company/millionsystems",
  },
  creator: "MillionSystems Team",
  keywords: [
    "custom software development",
    "web development company",
    "mobile app development",
    "AI solutions",
    "IT consulting",
    "Manchester software agency",
    "Next.js development",
    "React developers",
    "full-stack development",
    "enterprise software",
  ],
};

export type SiteConfig = typeof siteConfig;

