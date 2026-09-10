"use strict";

// src/lib/db/prisma.ts
var import_client = require("@prisma/client");
var globalForPrisma = globalThis;
var prisma = globalForPrisma.prisma ?? new import_client.PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// src/lib/auth/permissions.ts
var PERMISSIONS = {
  // Academy module
  ACADEMY_VIEW: "academy.view",
  // Students
  STUDENTS_VIEW: "academy.students.view",
  STUDENTS_CREATE: "academy.students.create",
  STUDENTS_UPDATE: "academy.students.update",
  STUDENTS_ARCHIVE: "academy.students.archive",
  // Courses
  COURSES_VIEW: "academy.courses.view",
  COURSES_MANAGE: "academy.courses.manage",
  // Batches
  BATCHES_VIEW: "academy.batches.view",
  BATCHES_MANAGE: "academy.batches.manage",
  // Fees
  FEES_VIEW: "academy.fees.view",
  FEES_MANAGE: "academy.fees.manage",
  // Payments
  PAYMENTS_VIEW: "academy.payments.view",
  PAYMENTS_CREATE: "academy.payments.create",
  PAYMENTS_CANCEL: "academy.payments.cancel",
  PAYMENTS_REFUND: "academy.payments.refund",
  // Receipts
  RECEIPTS_VIEW: "academy.receipts.view",
  RECEIPTS_GENERATE: "academy.receipts.generate",
  // Attendance
  ATTENDANCE_VIEW: "academy.attendance.view",
  ATTENDANCE_MARK: "academy.attendance.mark",
  ATTENDANCE_EDIT: "academy.attendance.edit",
  // Reports
  REPORTS_VIEW: "academy.reports.view",
  REPORTS_EXPORT: "academy.reports.export",
  // Administration
  USERS_MANAGE: "admin.users.manage",
  ROLES_MANAGE: "admin.roles.manage",
  AUDIT_VIEW: "admin.audit.view"
};
var ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  ADMIN: [
    PERMISSIONS.ACADEMY_VIEW,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.STUDENTS_UPDATE,
    PERMISSIONS.STUDENTS_ARCHIVE,
    PERMISSIONS.COURSES_VIEW,
    PERMISSIONS.COURSES_MANAGE,
    PERMISSIONS.BATCHES_VIEW,
    PERMISSIONS.BATCHES_MANAGE,
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.FEES_MANAGE,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_CREATE,
    PERMISSIONS.PAYMENTS_CANCEL,
    PERMISSIONS.PAYMENTS_REFUND,
    PERMISSIONS.RECEIPTS_VIEW,
    PERMISSIONS.RECEIPTS_GENERATE,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.ATTENDANCE_EDIT,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.AUDIT_VIEW
  ],
  STAFF: [
    PERMISSIONS.ACADEMY_VIEW,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.STUDENTS_UPDATE,
    PERMISSIONS.COURSES_VIEW,
    PERMISSIONS.BATCHES_VIEW,
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_CREATE,
    PERMISSIONS.RECEIPTS_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK
  ],
  ACCOUNTANT: [
    PERMISSIONS.ACADEMY_VIEW,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.COURSES_VIEW,
    PERMISSIONS.BATCHES_VIEW,
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.FEES_MANAGE,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_CREATE,
    PERMISSIONS.PAYMENTS_CANCEL,
    PERMISSIONS.PAYMENTS_REFUND,
    PERMISSIONS.RECEIPTS_VIEW,
    PERMISSIONS.RECEIPTS_GENERATE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT
  ],
  INSTRUCTOR: [
    PERMISSIONS.ACADEMY_VIEW,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.COURSES_VIEW,
    PERMISSIONS.BATCHES_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.ATTENDANCE_EDIT
  ]
};

// prisma/seed.ts
var import_cuid2 = require("@paralleldrive/cuid2");
var import_crypto = require("better-auth/crypto");
async function main() {
  console.log("\u{1F331} Starting database seed...");
  const org = await prisma.organization.upsert({
    where: { slug: "raadhe-label-academy" },
    update: {},
    create: {
      id: (0, import_cuid2.createId)(),
      publicId: (0, import_cuid2.createId)(),
      name: process.env.ORGANIZATION_NAME ?? "Raadhe Label Academy",
      slug: "raadhe-label-academy",
      timezone: "Asia/Kolkata",
      currency: "INR",
      isActive: true
    }
  });
  console.log(`\u2705 Organization: ${org.name} (${org.id})`);
  const permissionDefs = Object.values(PERMISSIONS).map((name) => {
    const [module2, ...rest] = name.split(".");
    return {
      id: (0, import_cuid2.createId)(),
      name,
      description: name,
      module: module2 ?? "system"
    };
  });
  for (const perm of permissionDefs) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm
    });
  }
  console.log(`\u2705 Permissions: ${permissionDefs.length} created/updated`);
  const roleDefs = [
    { name: "SUPER_ADMIN", description: "Full system access", isSystem: true },
    { name: "ADMIN", description: "Academy management", isSystem: true },
    { name: "STAFF", description: "Student and payment operations", isSystem: true },
    { name: "ACCOUNTANT", description: "Financial operations", isSystem: true },
    { name: "INSTRUCTOR", description: "Batch and attendance operations", isSystem: true }
  ];
  const roles = {};
  for (const roleDef of roleDefs) {
    const role = await prisma.role.upsert({
      where: { name: roleDef.name },
      update: {},
      create: {
        id: (0, import_cuid2.createId)(),
        name: roleDef.name,
        description: roleDef.description,
        isSystem: roleDef.isSystem
      }
    });
    roles[roleDef.name] = role.id;
  }
  console.log(`\u2705 Roles: ${roleDefs.length} created/updated`);
  for (const [roleName, permissions] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roles[roleName];
    if (!roleId) continue;
    for (const permName of permissions) {
      const perm = await prisma.permission.findUnique({ where: { name: permName } });
      if (!perm) continue;
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId, permissionId: perm.id }
        },
        update: {},
        create: {
          id: (0, import_cuid2.createId)(),
          roleId,
          permissionId: perm.id
        }
      });
    }
  }
  console.log("\u2705 Role permissions assigned");
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@raadhelabel.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123456";
  const hashedPassword = await (0, import_crypto.hashPassword)(adminPassword);
  let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminUser) {
    const adminId = (0, import_cuid2.createId)();
    adminUser = await prisma.user.create({
      data: {
        id: adminId,
        name: "Super Admin",
        email: adminEmail,
        emailVerified: true,
        status: "ACTIVE",
        accounts: {
          create: {
            id: (0, import_cuid2.createId)(),
            accountId: adminId,
            // In Better Auth, accountId must match userId for credentials
            providerId: "credential",
            password: hashedPassword
          }
        }
      }
    });
  }
  console.log(`\u2705 Admin user: ${adminUser.email}`);
  await prisma.userOrganization.upsert({
    where: {
      userId_organizationId: {
        userId: adminUser.id,
        organizationId: org.id
      }
    },
    update: {},
    create: {
      id: (0, import_cuid2.createId)(),
      userId: adminUser.id,
      organizationId: org.id
    }
  });
  const superAdminRoleId = roles["SUPER_ADMIN"];
  if (superAdminRoleId) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId_organizationId: {
          userId: adminUser.id,
          roleId: superAdminRoleId,
          organizationId: org.id
        }
      },
      update: {},
      create: {
        id: (0, import_cuid2.createId)(),
        userId: adminUser.id,
        roleId: superAdminRoleId,
        organizationId: org.id
      }
    });
  }
  console.log("\u2705 Super admin role assigned");
  const courses = [
    { name: "Fashion Design", description: "Full fashion design course", duration: "6 months", defaultFee: "30000" },
    { name: "Garment Construction", description: "Garment making and construction", duration: "4 months", defaultFee: "20000" },
    { name: "Fashion Illustration", description: "Design sketching and illustration", duration: "3 months", defaultFee: "15000" }
  ];
  for (const course of courses) {
    const existing = await prisma.course.findFirst({
      where: { organizationId: org.id, name: course.name }
    });
    if (!existing) {
      await prisma.course.create({
        data: {
          id: (0, import_cuid2.createId)(),
          publicId: (0, import_cuid2.createId)(),
          organizationId: org.id,
          name: course.name,
          description: course.description,
          duration: course.duration,
          defaultFee: course.defaultFee,
          status: "ACTIVE"
        }
      });
    }
  }
  console.log("\u2705 Sample courses created");
  console.log("\n\u{1F389} Seed completed successfully!");
  console.log(`
\u{1F4E7} Admin login: ${adminEmail}`);
  console.log(`\u{1F511} Admin password: ${adminPassword}`);
  console.log("\n\u26A0\uFE0F  Change the admin password after first login!");
}
main().catch((e) => {
  console.error("\u274C Seed failed:", e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
