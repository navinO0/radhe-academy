import { prisma } from "@/lib/db/prisma";
import { PERMISSIONS, ROLE_PERMISSIONS } from "@/lib/auth/permissions";
import { createId } from "@paralleldrive/cuid2";
import { hash } from "@node-rs/argon2";

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Create organization
  const org = await prisma.organization.upsert({
    where: { slug: "raadhe-label-academy" },
    update: {},
    create: {
      id: createId(),
      publicId: createId(),
      name: process.env.ORGANIZATION_NAME ?? "Raadhe Label Academy",
      slug: "raadhe-label-academy",
      timezone: "Asia/Kolkata",
      currency: "INR",
      isActive: true,
    },
  });
  console.log(`✅ Organization: ${org.name} (${org.id})`);

  // 2. Create permissions
  const permissionDefs = Object.values(PERMISSIONS).map((name) => {
    const [module, ...rest] = name.split(".");
    return {
      id: createId(),
      name,
      description: name,
      module: module ?? "system",
    };
  });

  for (const perm of permissionDefs) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }
  console.log(`✅ Permissions: ${permissionDefs.length} created/updated`);

  // 3. Create roles
  const roleDefs = [
    { name: "SUPER_ADMIN", description: "Full system access", isSystem: true },
    { name: "ADMIN", description: "Academy management", isSystem: true },
    { name: "STAFF", description: "Student and payment operations", isSystem: true },
    { name: "ACCOUNTANT", description: "Financial operations", isSystem: true },
    { name: "INSTRUCTOR", description: "Batch and attendance operations", isSystem: true },
  ] as const;

  const roles: Record<string, string> = {};
  for (const roleDef of roleDefs) {
    const role = await prisma.role.upsert({
      where: { name: roleDef.name },
      update: {},
      create: {
        id: createId(),
        name: roleDef.name,
        description: roleDef.description,
        isSystem: roleDef.isSystem,
      },
    });
    roles[roleDef.name] = role.id;
  }
  console.log(`✅ Roles: ${roleDefs.length} created/updated`);

  // 4. Assign permissions to roles
  for (const [roleName, permissions] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roles[roleName];
    if (!roleId) continue;

    for (const permName of permissions) {
      const perm = await prisma.permission.findUnique({ where: { name: permName } });
      if (!perm) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId, permissionId: perm.id },
        },
        update: {},
        create: {
          id: createId(),
          roleId,
          permissionId: perm.id,
        },
      });
    }
  }
  console.log("✅ Role permissions assigned");

  // 5. Create super admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@raadhelabel.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123456";

  const hashedPassword = await hash(adminPassword, {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminUser) {
    const adminId = createId();
    adminUser = await prisma.user.create({
      data: {
        id: adminId,
        name: "Super Admin",
        email: adminEmail,
        emailVerified: true,
        status: "ACTIVE",
        accounts: {
          create: {
            id: createId(),
            accountId: adminId, // In Better Auth, accountId must match userId for credentials
            providerId: "credential",
            password: hashedPassword,
          },
        },
      },
    });
  }
  console.log(`✅ Admin user: ${adminUser.email}`);

  // 6. Link admin to organization
  await prisma.userOrganization.upsert({
    where: {
      userId_organizationId: {
        userId: adminUser.id,
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      id: createId(),
      userId: adminUser.id,
      organizationId: org.id,
    },
  });

  // 7. Assign SUPER_ADMIN role
  const superAdminRoleId = roles["SUPER_ADMIN"];
  if (superAdminRoleId) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId_organizationId: {
          userId: adminUser.id,
          roleId: superAdminRoleId,
          organizationId: org.id,
        },
      },
      update: {},
      create: {
        id: createId(),
        userId: adminUser.id,
        roleId: superAdminRoleId,
        organizationId: org.id,
      },
    });
  }
  console.log("✅ Super admin role assigned");

  // 8. Create sample courses
  const courses = [
    { name: "Fashion Design", description: "Full fashion design course", duration: "6 months", defaultFee: "30000" },
    { name: "Garment Construction", description: "Garment making and construction", duration: "4 months", defaultFee: "20000" },
    { name: "Fashion Illustration", description: "Design sketching and illustration", duration: "3 months", defaultFee: "15000" },
  ];

  for (const course of courses) {
    const existing = await prisma.course.findFirst({
      where: { organizationId: org.id, name: course.name },
    });
    if (!existing) {
      await prisma.course.create({
        data: {
          id: createId(),
          publicId: createId(),
          organizationId: org.id,
          name: course.name,
          description: course.description,
          duration: course.duration,
          defaultFee: course.defaultFee,
          status: "ACTIVE",
        },
      });
    }
  }
  console.log("✅ Sample courses created");

  console.log("\n🎉 Seed completed successfully!");
  console.log(`\n📧 Admin login: ${adminEmail}`);
  console.log(`🔑 Admin password: ${adminPassword}`);
  console.log("\n⚠️  Change the admin password after first login!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

