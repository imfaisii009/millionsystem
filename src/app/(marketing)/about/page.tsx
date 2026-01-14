import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about MillionSystems",
};

// ISR: Revalidate about page every 24 hours
export const revalidate = 86400;

export default function AboutPage() {
  return (
    <div className="container pt-24 pb-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
          <p className="text-xl text-muted-foreground">
            We're building the future of web applications.
          </p>
        </div>

        <div className="prose prose-gray max-w-none">
          <p>
            MillionSystems is a modern web application built with the latest
            technologies and best practices. Our mission is to provide developers
            with the tools they need to build amazing products quickly and
            efficiently.
          </p>

          <h2>Our Technology Stack</h2>
          <ul>
            <li>
              <strong>Next.js 15</strong> - The React framework for production
            </li>
            <li>
              <strong>TypeScript</strong> - Type-safe development
            </li>
            <li>
              <strong>Tailwind CSS</strong> - Utility-first CSS framework
            </li>
            <li>
              <strong>Supabase</strong> - Open source Firebase alternative
            </li>
            <li>
              <strong>shadcn/ui</strong> - Beautiful UI components
            </li>
          </ul>

          <h2>Our Values</h2>
          <ul>
            <li>
              <strong>Quality</strong> - We prioritize code quality and user
              experience
            </li>
            <li>
              <strong>Speed</strong> - Fast development without compromising quality
            </li>
            <li>
              <strong>Innovation</strong> - Always exploring new technologies and
              approaches
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
