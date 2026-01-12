import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  email?: string | null;
  imageUrl?: string | null;
  className?: string;
}

export function UserAvatar({ email, imageUrl, className }: UserAvatarProps) {
  const initials = email
    ? email.substring(0, 2).toUpperCase()
    : "U";

  return (
    <Avatar className={cn("h-9 w-9", className)}>
      {imageUrl && <AvatarImage src={imageUrl} alt={email || "User"} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
