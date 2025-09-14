"use client";
import { decodeToken } from "@/lib/auth";
import {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
} from "react";

type AuthContextType = {
    token: string | null;
    setToken: (t: string | null) => Promise<void>;
    tenantSlug: string | null;
    tenantName: string | null;
};

const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: async () => {},
    tenantSlug: null,
    tenantName: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [tenantSlug, setTenantSlug] = useState<string | null>(null);
    const [tenantName, setTenantName] = useState<string | null>(null);

    // ✅ localStorage se hydrate
    useEffect(() => {
        const stored = localStorage.getItem("token");
        if (stored) {
            setToken(stored);
            const payload = decodeToken(stored);
            setTenantSlug(payload?.tenantId || null);
            setTenantName(payload?.tenantName || null); // 👈 extract
        }
    }, []);

    const saveToken = (t: string | null) => {
        return new Promise<void>((resolve) => {
            if (t) {
                localStorage.setItem("token", t);
                setToken(t);
                const payload = decodeToken(t);
                setTenantSlug(payload?.tenantId || null);
                setTenantName(payload?.tenantName || null);
            } else {
                localStorage.removeItem("token");
                setToken(null);
                setTenantSlug(null);
                setTenantName(null);
            }
            resolve();
        });
    };

    return (
        <AuthContext.Provider
            value={{ token, setToken: saveToken, tenantSlug, tenantName }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
