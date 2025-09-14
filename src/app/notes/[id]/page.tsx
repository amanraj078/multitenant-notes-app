"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useParams, useRouter } from "next/navigation";

type Note = {
    id: string;
    title: string;
    content: string;
};

export default function NoteDetailPage() {
    const { token } = useAuth();
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [note, setNote] = useState<Note | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    async function fetchNote() {
        const res = await fetch(`/api/notes/${params.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            const data = await res.json();
            setNote(data);
            setTitle(data.title);
            setContent(data.content);
        }
    }

    async function saveNote(e: React.FormEvent) {
        e.preventDefault();
        await fetch(`/api/notes/${params.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, content }),
        });
        fetchNote();
    }

    async function deleteNote() {
        await fetch(`/api/notes/${params.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        router.push("/notes");
    }

    useEffect(() => {
        if (token) fetchNote();
    }, [token]);

    if (!note) return <ProtectedRoute>Loading...</ProtectedRoute>;

    return (
        <>
            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Edit Note</h1>
                <form onSubmit={saveNote} className="space-y-2">
                    <input
                        type="text"
                        className="border p-2 w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        className="border p-2 w-full"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={deleteNote}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
