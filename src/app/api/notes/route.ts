import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/middleware";
import { withCors } from "@/lib/cors";

export async function GET(req: Request) {
    try {
        const user = requireAuth(req);
        const allNotes = await db
            .select()
            .from(notes)
            .where(eq(notes.tenantId, user.tenantId));
        return withCors(req, allNotes);
    } catch (err) {
        return withCors(req, { error: err }, 401);
    }
}

export async function POST(req: Request) {
    try {
        const user = requireAuth(req);
        const { title, content } = await req.json();

        const noteCount = await db
            .select()
            .from(notes)
            .where(eq(notes.tenantId, user.tenantId));
        if (noteCount.length >= 3 && user.role === "member") {
            return withCors(
                req,
                { error: "Free plan limit reached. Upgrade to Pro." },
                403
            );
        }

        const [note] = await db
            .insert(notes)
            .values({
                title,
                content,
                tenantId: user.tenantId,
                ownerId: user.userId,
            })
            .returning();

        return withCors(req, note);
    } catch (err) {
        return withCors(req, { error: err }, 401);
    }
}

export async function OPTIONS(req: Request) {
    return withCors(req, null, 204);
}
