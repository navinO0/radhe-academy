"use client";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExternalLink, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentAvatarProps {
  profileImageKey?: string | null;
  fullName: string;
  className?: string;
  fallbackClassName?: string;
  previewable?: boolean;
  subtitle?: string;
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
  previewable = false,
  subtitle,
}: StudentAvatarProps) {
  const [open, setOpen] = useState(false);

  const avatarUrl = profileImageKey
    ? `/api/academy/students/avatar?key=${encodeURIComponent(profileImageKey)}`
    : undefined;

  const avatarElement = (
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

  if (!previewable || !avatarUrl) {
    return avatarElement;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="relative group rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-transform hover:scale-105 cursor-pointer"
          title={`Click to view photo of ${fullName}`}
          onClick={(e) => e.stopPropagation()}
        >
          {avatarElement}
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="h-4 w-4 text-white drop-shadow" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between pr-6">
            <div>
              <DialogTitle className="text-base font-semibold">{fullName}</DialogTitle>
              {subtitle && (
                <DialogDescription className="text-xs font-mono text-muted-foreground">
                  {subtitle}
                </DialogDescription>
              )}
            </div>
            <a
              href={avatarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Full view
            </a>
          </div>
        </DialogHeader>
        <div className="flex items-center justify-center p-4 bg-muted/20">
          <img
            src={avatarUrl}
            alt={fullName}
            className="max-h-[65vh] w-auto max-w-full rounded-md object-contain shadow-sm"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
