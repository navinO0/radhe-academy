"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface StudentAvatarProps {
  profileImageKey?: string | null;
  fullName: string;
  className?: string;
  fallbackClassName?: string;
}

function getInitials(name: string): string {
  if (!name) return "ST";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  if (!first) return "ST";
  if (parts.length === 1) {
    return first.slice(0, 2).toUpperCase();
  }
  const last = parts[parts.length - 1];
  const firstChar = first.charAt(0);
  const lastChar = last ? last.charAt(0) : "";
  return (firstChar + lastChar).toUpperCase();
}

export function StudentAvatar({
  profileImageKey,
  fullName,
  className,
  fallbackClassName,
}: StudentAvatarProps) {
  const avatarUrl = profileImageKey
    ? `/api/academy/students/avatar?key=${encodeURIComponent(profileImageKey)}`
    : undefined;

  return (
    <Avatar className={cn("shrink-0", className)}>
      {avatarUrl && (
        <AvatarImage
          src={avatarUrl}
          alt={fullName}
          className="object-cover"
        />
      )}
      <AvatarFallback
        className={cn(
          "bg-primary/10 text-primary font-semibold uppercase text-xs select-none",
          fallbackClassName
        )}
      >
        {getInitials(fullName)}
      </AvatarFallback>
    </Avatar>
  );
}
