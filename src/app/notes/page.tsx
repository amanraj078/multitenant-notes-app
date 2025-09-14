"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/NavBar";

type Note = {
    id: string;
    title: string;
    content: string;
};

export default function NotesPage() {
    const { token, tenantSlug } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [limitReached, setLimitReached] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

    const fetchNotes = async () => {
        if (!token) return;
        try {
            const res = await fetch("/api/notes", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (res.status === 403) setLimitReached(true);
            else setNotes(data);
        } catch (err) {
            console.error(err);
        }
    };

    const saveNote = async () => {
        if (!token) return;

        try {
            const method = editingNoteId ? "PUT" : "POST";
            const url = editingNoteId
                ? `/api/notes/${editingNoteId}`
                : "/api/notes";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error.includes("Free plan")) setLimitReached(true);
                setError(data.error);
                return;
            }

            if (editingNoteId) {
                setNotes((prev) =>
                    prev.map((n) => (n.id === editingNoteId ? data : n))
                );
                setEditingNoteId(null);
            } else {
                setNotes((prev) => [...prev, data]);
            }

            setTitle("");
            setContent("");
            setError("");
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNote = async (id: string) => {
        if (!token) return;

        try {
            const res = await fetch(`/api/notes/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error);
                return;
            }

            setNotes((prev) => prev.filter((n) => n.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const startEditing = (note: Note) => {
        setEditingNoteId(note.id);
        setTitle(note.title);
        setContent(note.content);
    };

    useEffect(() => {
        fetchNotes();
    }, [token]);

    return (
        <>
            <Navbar />
            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Your Notes</h1>

                {limitReached && tenantSlug && (
                    <div className="p-3 mb-4 bg-yellow-200 text-yellow-800 rounded">
                        Free plan limit reached.{" "}
                        <a
                            href={`/tenants/${tenantSlug}/upgrade`}
                            className="underline"
                        >
                            Upgrade to Pro
                        </a>
                    </div>
                )}

                <div className="flex flex-col gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="p-2 border rounded"
                    />
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="p-2 border rounded"
                    />
                    <button
                        onClick={saveNote}
                        className="p-2 bg-blue-500 text-white rounded"
                    >
                        {editingNoteId ? "Update Note" : "Create Note"}
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className="p-3 border rounded flex justify-between items-start"
                        >
                            <div>
                                <h2 className="font-bold">{note.title}</h2>
                                <p>{note.content}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => startEditing(note)}
                                    className="p-1 bg-yellow-400 text-white rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteNote(note.id)}
                                    className="p-1 bg-red-500 text-white rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
