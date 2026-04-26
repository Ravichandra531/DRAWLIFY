import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware.js";
import { CreateRoomSchema, SignUpSchema, LoginSchema } from "@repo/common/types";
import { prisma, Prisma } from "@repo/db";

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    'https://drawlify-frontend.vercel.app',
    'http://localhost:3000',
  ],
  credentials: true,
}));

app.post("/signup", async (req, res) => {
    const parsedData = SignUpSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid input" });
    }

    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const user = await prisma.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                email: parsedData.data.email,
                photo: "" // Schema requires photo, adding empty string for now
            }
        });
        res.status(201).json({ userId: user.id });
    } catch (e) {
        res.status(500).json({ message: "Error creating user" });
    }
});

app.post("/login", async (req, res) => {
    const parsedData = LoginSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid input" });
    }

    const user = await prisma.user.findFirst({
        where: {
            username: parsedData.data.username
        }
    });

    if (!user) {
        return res.status(403).send("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(parsedData.data.password, user.password);
    if (!isPasswordValid) {
        return res.status(403).send("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
});

app.post("/room", middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).send("Invalid data");
    }
    const userId = (req as any).userId;

    // Generate a unique slug: sanitize name + random 6-char suffix
    const baseName = parsedData.data.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    const suffix = Math.random().toString(36).slice(2, 8);
    const slug = `${baseName}-${suffix}`;

    try {
        const room = await prisma.room.create({
            data: {
                slug,
                adminId: userId
            }
        });
        res.status(201).json({ roomId: room.id, slug });
    } catch (e) {
        console.error("Room creation error:", e);
        res.status(500).json({ message: "Error creating room" });
    }
});

app.get("/chats/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    if (isNaN(roomId)) {
        return res.status(400).json({ message: "Invalid room ID" });
    }
    try {
        const messages = await prisma.chat.findMany({
            where: { roomId },
            orderBy: { id: "asc" },
            take: 50,
        });
        res.json(messages);
    } catch (e) {
        console.error("Error fetching chats:", e);
        res.status(500).json({ message: "Error fetching chats" });
    }
});

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    try {
        const room = await prisma.room.findFirst({ where: { slug } });
        res.json({ room: room ?? null });
    } catch (e) {
        console.error("Error fetching room:", e);
        res.status(500).json({ message: "Error fetching room" });
    }
});

// ── Shape persistence ──────────────────────────────────────────────────────────

// GET all non-deleted shapes for a room
app.get("/shapes/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    if (isNaN(roomId)) return res.status(400).json({ message: "Invalid room ID" });
    try {
        const shapes = await prisma.shape.findMany({
            where: { roomId, deleted: false },
            orderBy: { createdAt: "asc" },
        });
        res.json(shapes.map((s) => s.data));
    } catch (e) {
        console.error("Error fetching shapes:", e);
        res.status(500).json({ message: "Error fetching shapes" });
    }
});

// POST upsert a batch of shapes (called by WS backend after broadcast)
app.post("/shapes/:roomId", middleware, async (req, res) => {
    const roomId = Number(req.params.roomId);
    if (isNaN(roomId)) return res.status(400).json({ message: "Invalid room ID" });

    const shapes: { id: string; deleted?: boolean; [key: string]: unknown }[] = req.body;
    if (!Array.isArray(shapes)) return res.status(400).json({ message: "Expected array of shapes" });

    try {
        await Promise.all(
            shapes.map((shape) =>
                prisma.shape.upsert({
                    where: { id: shape.id },
                    update: { data: shape as Prisma.InputJsonValue, deleted: shape.deleted ?? false },
                    create: { id: shape.id, roomId, data: shape as Prisma.InputJsonValue, deleted: shape.deleted ?? false },
                })
            )
        );
        res.json({ ok: true });
    } catch (e) {
        console.error("Error upserting shapes:", e);
        res.status(500).json({ message: "Error saving shapes" });
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});