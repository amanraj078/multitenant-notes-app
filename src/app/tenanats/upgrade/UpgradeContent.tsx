"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpgradePage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { token, tenantSlug } = useAuth();

    const handleUpgrade = async () => {
        if (!token || !tenantSlug) return;

        try {
            const res = await fetch(`/api/tenants/${tenantSlug}/upgrade`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setSuccess("Tenant upgraded to Pro!");
            setError("");
            router.push("/notes");
        } catch (err) {
            console.error(err);
            setError("Upgrade failed");
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Upgrade Tenant</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-500 mb-2">{success}</p>}
            <button
                onClick={handleUpgrade}
                className="p-2 bg-green-500 text-white rounded"
            >
                Upgrade to Pro
            </button>
        </div>
    );
}
