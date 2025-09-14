import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin } from "@/lib/middleware";
import { withCors } from "@/lib/cors";

type tParams = Promise<{ slug: string }>;

export async function POST(req: Request, { params }: { params: tParams }) {
    try {
        const user = requireAuth(req);
        requireAdmin(user);

        const { slug }: { slug: string } = await params;

        if (user.tenantId !== slug)
            return withCors(req, { error: "Unauthorized" }, 403);

        const [updated] = await db
            .update(tenants)
            .set({ plan: "pro" })
            .where(eq(tenants.slug, slug))
            .returning();

        return withCors(req, updated);
    } catch (err) {
        return withCors(req, { error: "Unauthorized" }, 401);
    }
}

export async function OPTIONS(req: Request) {
    return withCors(req, null, 204);
}
