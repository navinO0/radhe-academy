"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, Trash2, Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StudentAvatar } from "./StudentAvatar";

interface StudentAvatarUploadProps {
  value?: string | null; // profileImageKey
  onChange: (key: string | null) => void;
  studentIdentifier?: string;
  fullName?: string;
  disabled?: boolean;
}

export function StudentAvatarUpload({
  value,
  onChange,
  studentIdentifier = "student",
  fullName = "",
  disabled = false,
}: StudentAvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid JPEG, PNG, or WebP image");
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size must be less than 10MB");
      return;
    }

    // Instant local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentIdentifier", studentIdentifier || "student");

      const response = await fetch("/api/academy/students/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to upload photo");
      }

      onChange(data.key);

      const savedPct = data.originalSize && data.optimizedSize
        ? Math.round(((data.originalSize - data.optimizedSize) / data.originalSize) * 100)
        : 0;

      if (savedPct > 0) {
        toast.success(`Photo uploaded & optimized (saved ${savedPct}% size)`);
      } else {
        toast.success("Profile photo uploaded successfully!");
      }
    } catch (err: any) {
      console.error("Avatar upload failed:", err);
      toast.error(err.message || "Failed to upload avatar");
      // Revert preview on failure
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be re-selected if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Profile photo removed");
  };

  const hasPhoto = Boolean(previewUrl || value);

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Avatar Preview */}
      <div className="relative group shrink-0">
        <div
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`relative h-20 w-20 rounded-full border-2 border-border overflow-hidden bg-muted flex items-center justify-center cursor-pointer transition-all hover:border-primary ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar preview"
              className="h-full w-full object-cover"
            />
          ) : value ? (
            <StudentAvatar
              profileImageKey={value}
              fullName={fullName || "Student"}
              className="h-full w-full text-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground p-2">
              <User className="h-8 w-8 stroke-[1.5]" />
            </div>
          )}

          {/* Hover / Loading Overlay */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
              isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            ) : (
              <Camera className="h-6 w-6 text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons & Hint */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="h-8 px-3 text-xs"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Uploading...
              </>
            ) : hasPhoto ? (
              <>
                <Upload className="h-3.5 w-3.5 mr-1.5" /> Change Photo
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Photo
              </>
            )}
          </Button>

          {hasPhoto && !isUploading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              className="h-8 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
            </Button>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          JPEG, PNG, or WebP. Auto-optimized to WebP (max 600×600).
        </p>
      </div>
    </div>
  );
}

