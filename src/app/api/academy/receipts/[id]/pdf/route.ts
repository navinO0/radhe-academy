import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { rateLimiters } from "@/lib/rate-limit/limiter";
import { RateLimitError, NotFoundError, handleApiError } from "@/lib/errors";
import { renderReceiptPDF } from "@/lib/pdf/receipt.pdf";
import { withApiLogging } from "@/lib/api-logger";

export const GET = withApiLogging(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const requestId = request.headers.get("x-request-id") || undefined;
  try {
    const session = await requireAuth();

    const limitResult = rateLimiters.receiptPdf(session.userId);
    if (!limitResult.success) throw new RateLimitError("Too many PDF requests");

    const { id } = await params;

    // IDOR protection: verify receipt belongs to this org
    const receipt = await prisma.receipt.findFirst({
      where: { publicId: id, organizationId: session.organizationId },
      include: {
        student: { select: { fullName: true, studentCode: true, email: true } },
        instalment: { select: { label: true } },
        payment: { select: { paymentMethod: true, transactionReference: true } },
        generatedBy: { select: { name: true } },
        organization: { select: { name: true } },
      },
    });

    if (!receipt) throw new NotFoundError("Receipt");

    const pdfBuffer = await renderReceiptPDF(receipt);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${receipt.receiptNumber}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const { status, body } = handleApiError(err, requestId);
    return NextResponse.json(body, { status });
  }
});
