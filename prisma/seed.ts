import { prisma } from "@/lib/db/prisma";
import { PERMISSIONS, ROLE_PERMISSIONS } from "@/lib/auth/permissions";
import { createId } from "@paralleldrive/cuid2";
import { hashPassword } from "better-auth/crypto";

export const OFFICIAL_COURSES = [
  // Fashion Designing Courses
  {
    name: "Basic Fashion Designing",
    description: "1-Month foundational fashion design course covering core concepts, garment aesthetics, and design principles. Regular Fee: ₹30,000 (Founder's Batch 40% OFF: ₹18,000). Admission fee ₹2,000 extra. Includes: Expert Trainers, Hands-on Practical Training, Certificate on Completion, Portfolio Development, Lifetime Support, Business & Career Guidance.",
    duration: "1 Month",
    defaultFee: "30000",
  },
  {
    name: "Fashion Designing",
    description: "Comprehensive 3-Month fashion designing program with practical training, portfolio development, and design techniques. Regular Fee: ₹90,000 (Founder's Batch 40% OFF: ₹54,000). Admission fee ₹2,000 extra. Includes: Expert Trainers, Hands-on Practical Training, Certificate on Completion, Portfolio Development, Lifetime Support, Business & Career Guidance.",
    duration: "3 Months",
    defaultFee: "90000",
  },
  {
    name: "Advanced Fashion Designing",
    description: "6-Month in-depth fashion designing program with advanced styling, pattern making, textile studies, and professional portfolio. Regular Fee: ₹1,80,000 (Founder's Batch 40% OFF: ₹1,08,000). Admission fee ₹2,000 extra. Includes: Expert Trainers, Hands-on Practical Training, Certificate on Completion, Portfolio Development, Lifetime Support, Business & Career Guidance.",
    duration: "6 Months",
    defaultFee: "180000",
  },
  {
    name: "Professional Fashion Designing (Complete Course)",
    description: "Full 1-Year master professional fashion designing course covering end-to-end couture, fashion illustration, garment construction, boutique business management, and portfolio. Regular Fee: ₹3,00,000 (Founder's Batch 40% OFF: ₹1,80,000). Admission fee ₹2,000 extra. Includes: Expert Trainers, Hands-on Practical Training, Certificate on Completion, Portfolio Development, Lifetime Support, Business & Career Guidance.",
    duration: "1 Year",
    defaultFee: "300000",
  },
  // Boutique & Stitching Courses
  {
    name: "Personalized Learning",
    description: "1-Month tailored one-on-one boutique learning module customized to student pace and learning goals. Regular Fee: ₹25,000 (Founder's Batch 40% OFF: ₹15,000). Admission fee ₹2,000 extra. Includes: Expert Trainers, Practical Training, Certificate on Completion, Lifetime Support, Career & Business Guidance.",
    duration: "1 Month",
    defaultFee: "25000",
  },
  {
    name: "Foundation Stitching",
    description: "2-Month foundational stitching course focusing on machine handling, basic cuts, measurements, and finishing techniques. Regular Fee: ₹50,000 (Founder's Batch 40% OFF: ₹30,000). Admission fee ₹2,000 extra. Includes: Expert Trainers, Practical Training, Certificate on Completion, Lifetime Support, Career & Business Guidance.",
    duration: "2 Months",
    defaultFee: "50000",
  },
  {
    name: "Professional Stitching",
    description: "3-Month professional stitching course covering blouses, kurtis, western dresses, and precision tailoring. Regular Fee: ₹75,000 (Founder's Batch 40% OFF: ₹45,000). Admission fee ₹2,000 extra. Includes: Expert Trainers, Practical Training, Certificate on Completion, Lifetime Support, Career & Business Guidance.",
    duration: "3 Months",
    defaultFee: "75000",
  },
  {
    name: "Advanced Boutique",
    description: "4-Month advanced boutique course covering designer cuts, bridal tailoring, pattern making, and boutique client management. Regular Fee: ₹1,00,000 (Founder's Batch 40% OFF: ₹60,000). Admission fee ₹2,000 extra. Includes: Expert Trainers, Practical Training, Certificate on Completion, Lifetime Support, Career & Business Guidance.",
    duration: "4 Months",
    defaultFee: "100000",
  },
  {
    name: "Designer Course",
    description: "5-Month boutique designer course featuring high-end bridal couture, indo-western concepts, drafting, and custom embellishments. Regular Fee: ₹1,25,000 (Founder's Batch 40% OFF: ₹75,000). Admission fee ₹2,000 extra. Includes: Expert Trainers, Practical Training, Certificate on Completion, Lifetime Support, Career & Business Guidance.",
    duration: "5 Months",
    defaultFee: "125000",
  },
  {
    name: "Master Boutique Course",
    description: "Comprehensive 6-Month boutique entrepreneurship course: master stitching, boutique setup, fabric sourcing, pricing, and business scaling. Regular Fee: ₹1,50,000 (Founder's Batch 40% OFF: ₹90,000). Admission fee ₹2,000 extra. Includes: Expert Trainers, Practical Training, Certificate on Completion, Lifetime Support, Career & Business Guidance.",
    duration: "6 Months",
    defaultFee: "150000",
  },
  {
    name: "Machine Embroidery & Maggam Essentials",
    description: "1-Month specialized intensive training in machine embroidery, zardosi, aari/maggam work, and bridal motifs. Regular Fee: ₹20,000 (Founder's Batch 40% OFF: ₹12,000). Admission fee ₹2,000 extra. Includes: Expert Trainers, Practical Training, Certificate on Completion, Lifetime Support, Career & Business Guidance.",
    duration: "1 Month",
    defaultFee: "20000",
  },
];

async function syncCourses(organizationId: string) {
  console.log(`📚 Syncing ${OFFICIAL_COURSES.length} official courses for organization ${organizationId}...`);
  for (const course of OFFICIAL_COURSES) {
    const existing = await prisma.course.findFirst({
      where: { organizationId, name: course.name },
    });
    if (!existing) {
      await prisma.course.create({
        data: {
          id: createId(),
          publicId: createId(),
          organizationId,
          name: course.name,
          description: course.description,
          duration: course.duration,
          defaultFee: course.defaultFee,
          status: "ACTIVE",
        },
      });
      console.log(`  ➕ Created: ${course.name} (${course.duration} • ₹${course.defaultFee})`);
    } else {
      await prisma.course.update({
        where: { id: existing.id },
        data: {
          description: course.description,
          duration: course.duration,
          defaultFee: course.defaultFee,
          status: "ACTIVE",
        },
      });
      console.log(`  🔄 Updated: ${course.name} (${course.duration} • ₹${course.defaultFee})`);
    }
  }
}

async function main() {
  console.log("🌱 Checking database seed status...");

  const targetOrgName = process.env.ORGANIZATION_NAME ?? "Radhe Vastraz Academy";
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@radhevastraz.in";
  const forceSeed = process.env.FORCE_SEED === "true" || process.env.SEED_FORCE === "true";

  if (!forceSeed) {
    try {
      const existingOrg = await prisma.organization.findFirst({
        where: {
          OR: [
            { slug: "raadhe-label-academy" },
            { slug: "radhe-vastraz-academy" },
            { name: "Raadhe Label Academy" },
            { name: targetOrgName },
          ],
        },
      });

      const userCount = await prisma.user.count();

      if (existingOrg && userCount > 0) {
        console.log(
          `ℹ️ Database is already initialized (Organization: "${existingOrg.name}", Users: ${userCount}).`
        );

        // Update organization name if still using old name
        if (existingOrg.name !== targetOrgName) {
          await prisma.organization.update({
            where: { id: existingOrg.id },
            data: { name: targetOrgName },
          });
          console.log(`🔄 Updated organization name from "${existingOrg.name}" to "${targetOrgName}"`);
        }

        // Always sync the official courses so they exist in database
        await syncCourses(existingOrg.id);

        console.log("✅ Courses and Organization sync completed.");
        return;
      }
    } catch (err) {
      console.warn("⚠️ Could not verify existing seed status, proceeding with full seed:", err);
    }
  } else {
    console.log("⚡ FORCE_SEED=true detected. Proceeding with full seed execution...");
  }

  console.log("🌱 Executing complete database seed...");

  // 1. Create or update organization
  const existingOrg = await prisma.organization.findFirst({
    where: {
      OR: [
        { slug: "raadhe-label-academy" },
        { slug: "radhe-vastraz-academy" },
      ],
    },
  });

  const org = existingOrg
    ? await prisma.organization.update({
        where: { id: existingOrg.id },
        data: { name: targetOrgName },
      })
    : await prisma.organization.create({
        data: {
          id: createId(),
          publicId: createId(),
          name: targetOrgName,
          slug: "radhe-vastraz-academy",
          timezone: "Asia/Kolkata",
          currency: "INR",
          isActive: true,
        },
      });
  console.log(`✅ Organization: ${org.name} (${org.id})`);

  // 2. Create permissions
  const permissionDefs = Object.values(PERMISSIONS).map((name) => {
    const [module] = name.split(".");
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

    await prisma.rolePermission.deleteMany({ where: { roleId } });

    for (const permName of permissions) {
      const perm = await prisma.permission.findUnique({ where: { name: permName } });
      if (!perm) continue;

      await prisma.rolePermission.create({
        data: {
          id: createId(),
          roleId,
          permissionId: perm.id,
        },
      });
    }
  }
  console.log("✅ Role permissions assigned and synced");

  // 5. Create super admin user
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123456";
  const hashedPassword = await hashPassword(adminPassword);

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
            accountId: adminId,
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

  // 8. Create official courses
  await syncCourses(org.id);

  console.log("\n🎉 Seed completed successfully!");
  console.log(`\n📧 Admin login: ${adminEmail}`);
  console.log(`🔑 Admin password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
