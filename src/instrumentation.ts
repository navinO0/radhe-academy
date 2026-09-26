export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Only run during actual server boot, not during next build or when dummy db is configured
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return;
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || dbUrl.includes("localhost:5432/dummy")) {
      return;
    }

    try {
      const { runStartupSeeder } = await import("@/lib/db/startup-seeder");
      await runStartupSeeder();
    } catch (err) {
      console.warn("⚠️ Startup seeder check failed:", err);
    }
  }
}
