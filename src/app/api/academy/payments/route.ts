import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { createPaymentSchema } from "@/lib/validation/schemas";
import { createPayment } from "@/server/services/payment.service";
import { writeAuditLog } from "@/lib/audit/audit.service";
import { rateLimiters } from "@/lib/rate-limit/limiter";
import { handleApiError, errorResponse, successResponse } from "@/lib/errors";
import { RateLimitError } from "@/lib/errors";
import { withApiLogging } from "@/lib/api-logger";

export const POST = withApiLogging(async (request: NextRequest) => {
  const requestId = request.headers.get("x-request-id") || undefined;
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.PAYMENTS_CREATE);

    // Rate limit per user
    const limitResult = rateLimiters.payment(session.userId);
    if (!limitResult.success) {
      throw new RateLimitError("Too many payment requests", limitResult.retryAfter);
    }

    const body = (await request.json()) as unknown;
    const parsed = createPaymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        errorResponse(
          "VALIDATION_ERROR",
          "Invalid request",
          parsed.error.flatten().fieldErrors as Record<string, string[]>,
          requestId
        ),
        { status: 422 }
      );
    }

    const result = await createPayment({
      organizationId: session.organizationId,
      createdById: session.userId,
      studentId: parsed.data.studentId,
      instalmentId: parsed.data.instalmentId,
      amount: parsed.data.amount,
      paymentDate: parsed.data.paymentDate,
      paymentMethod: parsed.data.paymentMethod,
      transactionReference: parsed.data.transactionReference,
      idempotencyKey: parsed.data.idempotencyKey,
      notes: parsed.data.notes,
    });

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "PAYMENT_CREATE",
      resourceType: "payment",
      resourceId: result.paymentId,
      metadata: {
        amount: parsed.data.amount,
        method: parsed.data.paymentMethod,
        receiptNumber: result.receiptNumber,
        studentId: parsed.data.studentId,
      },
    });

    return NextResponse.json(successResponse(result, undefined, requestId), { status: 201 });
  } catch (err) {
    const { status, body } = handleApiError(err, requestId);
    const response = NextResponse.json(body, { status });
    if (err instanceof RateLimitError && err.retryAfter) {
      response.headers.set("Retry-After", String(err.retryAfter));
    }
    return response;
  }
});
