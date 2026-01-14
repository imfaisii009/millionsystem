export const siteConfig = {
  name: "MillionSystems",
  description: "A modern web application built with Next.js and Supabase",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/yourusername/millionsystem",
  },
  creator: "Your Name",
};

export type SiteConfig = typeof siteConfig;
