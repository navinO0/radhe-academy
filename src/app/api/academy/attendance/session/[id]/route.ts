import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getSessionForAttendance } from "@/server/services/attendance.service";
import { handleApiError, successResponse } from "@/lib/errors";
import { withApiLogging } from "@/lib/api-logger";

export const GET = withApiLogging(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const requestId = request.headers.get("x-request-id") || undefined;
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.ATTENDANCE_VIEW);

    const { id } = await params;
    const data = await getSessionForAttendance(id, session.organizationId);

    return NextResponse.json(successResponse(data, undefined, requestId));
  } catch (err) {
    const { status, body } = handleApiError(err, requestId);
    return NextResponse.json(body, { status });
  }
});
