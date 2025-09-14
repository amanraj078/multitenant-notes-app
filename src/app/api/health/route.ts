import { withCors } from "@/lib/cors";

export async function GET(req: Request) {
    return withCors(req, { status: "ok" });
}

export async function OPTIONS(req: Request) {
    return withCors(req, null, 204);
}
