import { verifyToken, JWTPayload } from "./auth";

export function getUserFromHeader(req: Request): JWTPayload | null {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    return verifyToken(token);
}

export function requireAuth(req: Request): JWTPayload {
    const user = getUserFromHeader(req);
    if (!user) throw new Error("Unauthorized");
    return user;
}

export function requireAdmin(user: JWTPayload) {
    if (user.role !== "admin") throw new Error("Admin only");
}
