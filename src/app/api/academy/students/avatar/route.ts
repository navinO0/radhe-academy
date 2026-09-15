import { NextResponse } from "next/server";
import { getStudentAvatarObject } from "@/lib/storage/s3-storage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return new Response("Missing storage key", { status: 400 });
    }

    const s3Response = await getStudentAvatarObject(key);

    if (!s3Response.Body) {
      return new Response("Avatar not found", { status: 404 });
    }

    // Convert S3 stream to readable Web stream
    const webStream = s3Response.Body.transformToWebStream();

    return new Response(webStream, {
      status: 200,
      headers: {
        "Content-Type": s3Response.ContentType || "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": s3Response.ContentLength?.toString() || "",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    const error = err as Error;
    console.error("Avatar serve error:", error.message);
    return new Response("Avatar not found", { status: 404 });
  }
}
