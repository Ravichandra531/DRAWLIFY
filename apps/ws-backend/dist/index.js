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
            // Broadcast to peers immediately
            users.forEach(u => {
                if (u.rooms.includes(parsedData.roomId) && u.ws !== ws) {
                    u.ws.send(JSON.stringify({
                        type: "message",
                        roomId: parsedData.roomId,
                        message
                    }));
                }
            });
            // Persist shapes asynchronously
            try {
                const shapes = JSON.parse(message);
                const shapeArray = Array.isArray(shapes) ? shapes : [shapes];
                await Promise.all(shapeArray.map((shape) => prisma.shape.upsert({
                    where: { id: shape.id },
                    update: { data: shape, deleted: shape.deleted ?? false },
                    create: {
                        id: shape.id,
                        roomId,
                        data: shape,
                        deleted: shape.deleted ?? false,
                    },
                })));
            }
            catch (err) {
                console.error("[ws] Failed to persist shapes:", err);
            }
        }
    });
    ws.on("close", () => {
        const index = users.findIndex(u => u.ws === ws);
        if (index !== -1) {
            users.splice(index, 1);
        }
    });
});
