import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { uploadAndOptimizeStudentAvatar } from "@/lib/storage/s3-storage";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB before optimization

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const studentIdentifier = (formData.get("studentCode") as string) || (formData.get("studentId") as string) || session.organizationId;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPEG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadAndOptimizeStudentAvatar(buffer, studentIdentifier);

    return NextResponse.json({
      success: true,
      key: result.key,
      url: result.url,
      originalSize: result.originalSize,
      optimizedSize: result.optimizedSize,
      dimensions: result.dimensions,
    });
  } catch (err) {
    const error = err as Error;
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
