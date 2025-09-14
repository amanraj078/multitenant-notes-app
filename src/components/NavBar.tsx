"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { token, setToken, tenantName } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        setToken(null);
        router.push("/login");
    };

    return (
        <nav className="p-4 w-full h-16 bg-neutral-800 flex justify-between items-center">
            <span className="font-bold text-white">Multi-Tenant Notes App</span>
            <div className="flex gap-6 items-center">
                {tenantName && (
                    <span className="text-lg font-semibold text-gray-300">
                        Org: {tenantName}
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    className="p-2 bg-red-500 text-white rounded"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
