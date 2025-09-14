import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret"; // local ke liye fallback

// JWT payload type
export type JWTPayload = {
    userId: string;
    tenantId: string;
    tenantName: string;
    role: "admin" | "member";
};

// Helper to sign token
export function signToken(payload: JWTPayload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

// Helper to verify token
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

export function decodeToken(token: string) {
    try {
        return jwt.decode(token) as JWTPayload;
    } catch {
        return null;
    }
}
