"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";

export default function DashboardPage() {
    const [roomName, setRoomName] = useState("");
    const [joinSlug, setJoinSlug] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signin");
        } else {
            setAuthenticated(true);
        }
    }, [router]);

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName.trim()) return;
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${BACKEND_URL}/room`,
                { name: roomName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            router.push(`/canvas/${res.data.roomId}`);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Failed to create room");
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!joinSlug.trim()) return;
        setLoading(true);
        setError("");

        try {
            const res = await axios.get(`${BACKEND_URL}/room/${joinSlug}`);
            if (res.data.room) {
                router.push(`/canvas/${res.data.room.id}`);
            } else {
                setError("Room not found. Check the slug and try again.");
            }
        } catch {
            setError("Room not found. Check the slug and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <div className="animate-spin w-8 h-8 border-4 border-[#6c5ce7] border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7] text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
            <link
                href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fdfbf7]/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
                    <a href="/" className="flex items-center gap-2">
                        <span className="font-bold text-2xl" style={{ fontFamily: "'Caveat', cursive" }}>
                            Drawlify
                        </span>
                    </a>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Log out
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-32 pb-20 max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1
                        className="text-5xl md:text-7xl font-bold mb-4"
                        style={{ fontFamily: "'Caveat', cursive" }}
                    >
                        Your <span className="text-[#6c5ce7]">Boards</span>
                    </h1>
                    <p className="text-lg text-gray-500">Create a new board or join an existing one.</p>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {/* Create Room Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="p-8 rounded-2xl bg-[#f5f1eb] border-2 border-gray-900/10 shadow-[4px_4px_0px_rgba(0,0,0,0.08)]"
                    >
                        <div className="w-14 h-14 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center mb-6 text-3xl">
                            ✨
                        </div>
                        <h2
                            className="text-3xl font-bold mb-2"
                            style={{ fontFamily: "'Caveat', cursive" }}
                        >
                            Create a Board
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Start a new whiteboard and invite your team.
                        </p>
                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <input
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                placeholder="Board name (e.g. Sprint Planning)"
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-100 focus:border-[#6c5ce7] focus:ring-4 focus:ring-[#6c5ce7]/5 outline-none transition-all placeholder:text-gray-400 text-sm"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-6 bg-[#6c5ce7] text-white font-bold rounded-xl shadow-lg shadow-[#6c5ce7]/20 hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                            >
                                {loading ? "Creating..." : "Create Board"}
                            </button>
                        </form>
                    </motion.div>

                    {/* Join Room Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="p-8 rounded-2xl bg-[#f5f1eb] border-2 border-gray-900/10 shadow-[4px_4px_0px_rgba(0,0,0,0.08)]"
                    >
                        <div className="w-14 h-14 rounded-xl bg-[#0984e3]/10 flex items-center justify-center mb-6 text-3xl">
                            🔗
                        </div>
                        <h2
                            className="text-3xl font-bold mb-2"
                            style={{ fontFamily: "'Caveat', cursive" }}
                        >
                            Join a Board
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Enter a board slug to join an existing session.
                        </p>
                        <form onSubmit={handleJoinRoom} className="space-y-4">
                            <input
                                type="text"
                                value={joinSlug}
                                onChange={(e) => setJoinSlug(e.target.value)}
                                placeholder="Board slug (e.g. sprint-planning)"
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-100 focus:border-[#0984e3] focus:ring-4 focus:ring-[#0984e3]/5 outline-none transition-all placeholder:text-gray-400 text-sm"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-6 bg-[#0984e3] text-white font-bold rounded-xl shadow-lg shadow-[#0984e3]/20 hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                            >
                                {loading ? "Joining..." : "Join Board"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
