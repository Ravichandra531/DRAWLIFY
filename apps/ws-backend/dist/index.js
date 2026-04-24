import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
import "dotenv/config";
import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });
const users = [];
function checkUser(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded || typeof decoded === "string") {
            return null;
        }
        return { userId: decoded.userId };
    }
    catch (err) {
        return null;
    }
}
wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if (!url) {
        ws.close(1002, "Unauthorized");
        return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token");
    const userPayload = checkUser(token || "");
    if (!userPayload) {
        ws.close(1002, "Unauthorized");
        return;
    }
    const userId = userPayload.userId;
    users.push({
        userId,
        rooms: [],
        ws
    });
    ws.on("message", async function message(data) {
        let parsedData;
        try {
            parsedData = JSON.parse(data);
        }
        catch (e) {
            return;
        }
        const user = users.find(u => u.ws === ws);
        if (!user) {
            return;
        }
        if (parsedData.type === "join_room") {
            const roomId = parsedData.roomId;
            if (roomId && !user.rooms.includes(roomId)) {
                user.rooms.push(roomId);
            }
        }
        else if (parsedData.type === "leave_room") {
            const roomId = parsedData.roomId;
            user.rooms = user.rooms.filter(r => r !== roomId);
        }
        else if (parsedData.type === "message") {
            const roomId = Number(parsedData.roomId);
            const message = parsedData.message;
            if (isNaN(roomId))
                return;
            // Broadcast to peers immediately — don't block on the DB write
            users.forEach(u => {
                if (u.rooms.includes(parsedData.roomId) && u.ws !== ws) {
                    u.ws.send(JSON.stringify({
                        type: "message",
                        roomId: parsedData.roomId,
                        message
                    }));
                }
            });
            // Persist asynchronously — a failure here won't stall the room
            prisma.chat.create({
                data: {
                    message,
                    roomId,
                    userId: user.userId
                }
            }).catch((err) => {
                console.error("[ws] Failed to persist message:", err);
            });
        }
    });
    ws.on("close", () => {
        const index = users.findIndex(u => u.ws === ws);
        if (index !== -1) {
            users.splice(index, 1);
        }
    });
});
