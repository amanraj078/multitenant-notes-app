import { db } from "@/db";
import { users, tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { withCors } from "@/lib/cors";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (!user) return withCors(req, { error: "Invalid credentials" }, 401);

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid)
            return withCors(req, { error: "Invalid credentials" }, 401);

        const [tenant] = await db
            .select()
            .from(tenants)
            .where(eq(tenants.id, user.tenantId));

        const token = signToken({
            userId: user.id,
            tenantId: user.tenantId,
            tenantName: tenant?.name || "",
            role: user.role as "admin" | "member",
        });

        return withCors(req, {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        return withCors(req, { error: "Server error" }, 500);
    }
}

export async function OPTIONS(req: Request) {
    return withCors(req, null, 204);
}
