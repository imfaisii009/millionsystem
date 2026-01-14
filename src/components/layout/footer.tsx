import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2 space-y-4">
            <Logo />
            <p className="text-muted-foreground max-w-sm">
              Crafting exceptional digital experiences for forward-thinking brands.
              We build web applications that look beautiful and perform flawlessly.
            </p>
            <div className="pt-4">
              <p className="text-sm font-semibold text-white">Headquarters</p>
              <p className="text-sm text-muted-foreground">Turner Business Centre, Greengate</p>
              <p className="text-sm text-muted-foreground">Middleton, Manchester M24 1RU</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#services" className="hover:text-primary transition-colors">Web Development</Link></li>
              <li><Link href="/#services" className="hover:text-primary transition-colors">UI/UX Design</Link></li>
              <li><Link href="/#services" className="hover:text-primary transition-colors">Enterprise Solutions</Link></li>
              <li><Link href="/#services" className="hover:text-primary transition-colors">Mobile Apps</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#services" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/#portfolio" className="hover:text-primary transition-colors">Portfolio</Link></li>
              <li><Link href="/#contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} MillionSystems. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
