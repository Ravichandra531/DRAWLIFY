"use client"

import { WS_URL } from "@/config"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Canvas } from "./Canvas"

export function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signin");
            return;
        }

        let active = true;
        const ws = new WebSocket(`${WS_URL}?token=${token}`);

        ws.onopen = () => {
            if (!active) {
                ws.close();
                return;
            }
            setSocket(ws);
            ws.send(JSON.stringify({
                type: 'join_room',
                roomId
            }));
        };

        ws.onerror = () => {
            // onerror fires for both network failures and auth rejections (1002).
            // onclose fires right after with the actual code — let it set the message.
        };

        ws.onclose = (event) => {
            if (!active) return;
            if (event.code === 1002) {
                setError("Authentication failed. Please sign in again.");
                localStorage.removeItem("token");
                setTimeout(() => router.push("/signin"), 2000);
            } else if (event.code !== 1000) {
                setError("Failed to connect to the server. Please try again.");
            }
        };

        return () => {
            active = false;
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, [roomId, router])

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center space-y-4">
                    <div className="text-4xl">⚠️</div>
                    <p className="text-red-400 font-medium">{error}</p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:brightness-110 transition-all text-sm"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    if (!socket) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center space-y-4">
                    <div className="animate-spin w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full mx-auto" />
                    <p className="text-gray-400 font-medium">Connecting to board...</p>
                </div>
            </div>
        )
    }

    return <Canvas roomId={roomId} socket={socket} />
}