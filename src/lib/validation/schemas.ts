import { z } from "zod";

// ---- Common validators ----
export const publicIdSchema = z
  .string()
  .min(1, "ID is required")
  .max(128, "ID too long");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export const sortSchema = (allowedFields: readonly string[]) =>
  z.object({
    sortBy: z.enum(allowedFields as [string, ...string[]]).optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  });

export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

export const emailSchema = z.string().email("Enter a valid email address");

export const amountSchema = z
  .string()
  .or(z.number())
  .transform((val) => String(val))
  .refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 && num <= 9_999_999;
  }, "Amount must be a positive number up to ₹99,99,999");

export const nonNegativeAmountSchema = z
  .string()
  .or(z.number())
  .transform((val) => String(val))
  .refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 9_999_999;
  }, "Amount must be a non-negative number up to ₹99,99,999");

export const dateSchema = z.coerce.date({
  errorMap: () => ({ message: "Enter a valid date" }),
});

export const indianDateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

// ---- Student schemas ----
export const createStudentSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal("")),
  dateOfBirth: dateSchema,
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
    required_error: "Gender is required",
  }),
  profileImageKey: z.string().optional().nullable(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(10).optional(),
  emergencyContactName: z.string().max(100).optional(),
  emergencyContactPhone: phoneSchema.optional().or(z.literal("")),
  emergencyContactRelation: z.string().max(50).optional(),
  joiningDate: dateSchema,
  courseId: z.string().min(1, "Please select a course"),
  batchId: z.string().optional(),
  notes: z.string().max(1000).optional(),
  // Fee information
  quotedFee: amountSchema,
  registrationFee: nonNegativeAmountSchema.optional().default("0"),
  discountAmount: nonNegativeAmountSchema.optional().default("0"),
  discountReason: z.string().max(200).optional(),
  // Instalment plan
  instalments: z
    .array(
      z.object({
        label: z.string().min(1).max(100),
        amount: amountSchema,
        dueDate: dateSchema,
      })
    )
    .min(1, "At least one instalment is required"),
});

export const updateStudentSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: phoneSchema.optional(),
  email: emailSchema.optional().or(z.literal("")),
  dateOfBirth: dateSchema.optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(10).optional(),
  emergencyContactName: z.string().max(100).optional(),
  emergencyContactPhone: phoneSchema.optional().or(z.literal("")),
  emergencyContactRelation: z.string().max(50).optional(),
  batchId: z.string().optional().nullable(),
  status: z
    .enum(["ACTIVE", "COMPLETED", "ON_HOLD", "DROPPED", "CANCELLED"])
    .optional(),
  notes: z.string().max(1000).optional(),
  profileImageKey: z.string().optional().nullable(),
});

export const studentListQuerySchema = z
  .object({
    search: z.string().max(100).optional(),
    status: z
      .enum(["ACTIVE", "COMPLETED", "ON_HOLD", "DROPPED", "CANCELLED"])
      .optional(),
    courseId: z.string().optional(),
    batchId: z.string().optional(),
    joiningDateFrom: indianDateStringSchema.optional(),
    joiningDateTo: indianDateStringSchema.optional(),
  })
  .merge(paginationSchema)
  .merge(
    sortSchema([
      "fullName",
      "studentCode",
      "joiningDate",
      "createdAt",
      "status",
    ])
  );

// ---- Course schemas ----
export const createCourseSchema = z.object({
  name: z.string().min(2, "Course name is required").max(200),
  description: z.string().max(2000).optional(),
  duration: z.string().max(50).optional(),
  defaultFee: amountSchema,
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).default("ACTIVE"),
});

export const updateCourseSchema = createCourseSchema.partial();

// ---- Batch schemas ----
export const createBatchSchema = z.object({
  name: z.string().min(2, "Batch name is required").max(200),
  courseId: z.string().min(1, "Please select a course"),
  instructorId: z.string().optional(),
  capacity: z.coerce.number().int().min(1).max(500).default(30),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  schedule: z
    .object({
      days: z
        .array(z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]))
        .optional(),
      time: z.string().max(20).optional(),
    })
    .optional(),
  status: z
    .enum(["UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"])
    .default("UPCOMING"),
});

export const updateBatchSchema = createBatchSchema.partial();

// ---- Payment schemas ----
export const createPaymentSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  instalmentId: z.string().min(1, "Instalment ID is required"),
  amount: amountSchema,
  paymentDate: dateSchema.optional(),
  paymentMethod: z.enum(["CASH", "UPI", "BANK_TRANSFER", "CARD", "OTHER"]),
  transactionReference: z.string().max(200).optional(),
  idempotencyKey: z.string().uuid("Invalid idempotency key"),
  notes: z.string().max(500).optional(),
});

export const cancelPaymentSchema = z.object({
  paymentId: z.string().min(1),
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500),
});

export const refundPaymentSchema = z.object({
  paymentId: z.string().min(1),
  amount: amountSchema,
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500),
});

// ---- Attendance schemas ----
export const createClassSessionSchema = z.object({
  batchId: z.string().min(1, "Please select a batch"),
  date: dateSchema,
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM").optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM").optional(),
  topic: z.string().max(300).optional(),
  instructorId: z.string().optional(),
});

export const bulkAttendanceSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  records: z
    .array(
      z.object({
        studentId: z.string().min(1),
        status: z.enum(["PRESENT", "ABSENT", "LEAVE"]),
      })
    )
    .min(1, "At least one attendance record is required")
    .max(200, "Maximum 200 records per submission"),
});

export const editAttendanceSchema = z.object({
  recordId: z.string().min(1),
  status: z.enum(["PRESENT", "ABSENT", "LEAVE"]),
  reason: z.string().min(5, "Reason must be at least 5 characters").max(300),
});

// ---- User management schemas ----
export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase and a number"
    ),
  phone: phoneSchema.optional(),
  roleIds: z.array(z.string()).min(1, "At least one role is required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase and a number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ---- Report schemas ----
export const reportQuerySchema = z.object({
  type: z.enum([
    "student-summary",
    "daily-collection",
    "monthly-collection",
    "outstanding-fees",
    "overdue-fees",
    "payment-method-breakdown",
    "student-attendance",
    "batch-attendance",
    "low-attendance",
  ]),
  dateFrom: indianDateStringSchema.optional(),
  dateTo: indianDateStringSchema.optional(),
  courseId: z.string().optional(),
  batchId: z.string().optional(),
  studentId: z.string().optional(),
  format: z.enum(["json", "csv"]).default("json"),
}).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      const from = new Date(data.dateFrom);
      const to = new Date(data.dateTo);
      const diff = to.getTime() - from.getTime();
      const maxRange = 366 * 24 * 60 * 60 * 1000; // 1 year
      return diff <= maxRange && diff >= 0;
    }
    return true;
  },
  { message: "Date range cannot exceed 1 year" }
);

// ---- Refund & Cancellation schemas ----
export const issueRefundSchema = z.object({
  paymentId: z.string().min(1, "Payment ID is required"),
  amount: amountSchema,
  refundMethod: z.enum(["CASH", "UPI", "BANK_TRANSFER", "CARD", "OTHER"]),
  transactionReference: z.string().max(100).optional(),
  reason: z.string().min(2, "Please provide a reason for the refund").max(500),
});

export const cancelOrDeleteStudentSchema = z.object({
  studentPublicId: z.string().min(1, "Student ID is required"),
  action: z.enum(["DELETE", "CANCEL"]),
  reason: z.string().min(2, "Please provide a reason").max(500),
  waiveRemainingBalance: z.boolean().optional().default(false),
  refundAmount: z.string().optional(),
  refundMethod: z.enum(["CASH", "UPI", "BANK_TRANSFER", "CARD", "OTHER"]).optional(),
  transactionReference: z.string().max(100).optional(),
});


