import { db } from "./index";
import { tenants, users } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
    console.log("🌱 Seeding database...");

    const passwordHash = await bcrypt.hash("password", 10);

    // Create tenants
    const [acme] = await db
        .insert(tenants)
        .values({ slug: "acme", name: "Acme Corp", plan: "free" })
        .returning();
    const [globex] = await db
        .insert(tenants)
        .values({ slug: "globex", name: "Globex Inc", plan: "free" })
        .returning();

    await db.insert(users).values([
        {
            email: "admin@acme.test",
            passwordHash,
            role: "admin",
            tenantId: acme.id,
        },
        {
            email: "user@acme.test",
            passwordHash,
            role: "member",
            tenantId: acme.id,
        },
        {
            email: "admin@globex.test",
            passwordHash,
            role: "admin",
            tenantId: globex.id,
        },
        {
            email: "user@globex.test",
            passwordHash,
            role: "member",
            tenantId: globex.id,
        },
    ]);

    console.log("✅ Seed complete!");
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
