import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getSessionForAttendance } from "@/server/services/attendance.service";
import { handleApiError, successResponse } from "@/lib/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.ATTENDANCE_VIEW);

    const { id } = await params;
    const data = await getSessionForAttendance(id, session.organizationId);

    return NextResponse.json(successResponse(data));
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
}

