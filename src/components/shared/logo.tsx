import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <img
        src="/logo-nanobanana.png"
        alt="MillionSystems Logo"
        className="h-10 w-auto object-contain transition-transform duration-300 hover:scale-105"
      />
      {showText && (
        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-400">
          {siteConfig.name}
        </span>
      )}
    </Link>
  );
}
