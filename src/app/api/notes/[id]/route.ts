import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/middleware";
import { withCors } from "@/lib/cors";
import { NextRequest } from "next/server";

type tParams = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: tParams }) {
    try {
        const user = requireAuth(req);
        const { id }: { id: string } = await params;
        const note = (
            await db.select().from(notes).where(eq(notes.id, id))
        ).find((n) => n.tenantId === user.tenantId);

        if (!note) return withCors(req, { error: "Not found" }, 404);

        return withCors(req, note);
    } catch (err) {
        return withCors(req, { error: "Unauthorized" }, 401);
    }
}

export async function PUT(req: NextRequest, { params }: { params: tParams }) {
    try {
        const user = requireAuth(req);
        const { id }: { id: string } = await params;
        const note = (
            await db.select().from(notes).where(eq(notes.id, id))
        ).find((n) => n.tenantId === user.tenantId);

        if (!note) return withCors(req, { error: "Not found" }, 404);

        const { title, content } = await req.json();
        const [updatedNote] = await db
            .update(notes)
            .set({ title, content })
            .where(eq(notes.id, id))
            .returning();

        return withCors(req, updatedNote);
    } catch (err) {
        return withCors(req, { error: "Unauthorized" }, 401);
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: tParams }
) {
    try {
        const user = requireAuth(req);
        const { id }: { id: string } = await params;
        const note = (
            await db.select().from(notes).where(eq(notes.id, id))
        ).find((n) => n.tenantId === user.tenantId);

        if (!note) return withCors(req, { error: "Not found" }, 404);

        await db.delete(notes).where(eq(notes.id, id));
        return withCors(req, { success: true });
    } catch (err) {
        return withCors(req, { error: "Unauthorized" }, 401);
    }
}

export async function OPTIONS(req: NextRequest) {
    return withCors(req, null, 204);
}
