import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function HomePage() {
  const features = [
    "Fast and reliable authentication",
    "Real-time data synchronization",
    "Built-in analytics dashboard",
    "Responsive design for all devices",
    "Type-safe development with TypeScript",
    "Scalable architecture",
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Build Amazing Products
                <br />
                <span className="text-primary">Faster Than Ever</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                A modern, production-ready Next.js template with authentication,
                database, and everything you need to build your next project.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg">
              Built with the latest technologies and best practices for modern
              web development.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border bg-white p-4"
              >
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg">
              Join thousands of developers building amazing products with our
              platform.
            </p>
            <Button size="lg" asChild>
              <Link href="/register">
                Start Building Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
