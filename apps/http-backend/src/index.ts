import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware.js";
import { CreateRoomSchema, SignUpSchema, LoginSchema } from "@repo/common/types";
import { prisma, Prisma } from "@repo/db";

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// ── Google OAuth Strategy ──────────────────────────────────────────────────────

const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const FRONTEND_URL         = process.env.FRONTEND_URL || "http://localhost:3000";

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy(
    {
      clientID:     GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL:  `${process.env.BACKEND_URL || "http://localhost:3001"}/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email    = profile.emails?.[0]?.value || "";
        const photo    = profile.photos?.[0]?.value || "";
        const googleId = profile.id;

        // Find or create user
        let user = await prisma.user.findFirst({ where: { googleId: googleId } });
        if (!user) {
          user = await prisma.user.findFirst({ where: { email } });
          if (user) {
            // Link Google to existing email account
            user = await prisma.user.update({ where: { id: user.id }, data: { googleId: googleId, photo } });
          } else {
            // Create new user
            const username = (profile.displayName || email.split("@")[0] || "user")
              .toLowerCase().replace(/\s+/g, "_").slice(0, 20);
            user = await prisma.user.create({
              data: { email, username, photo, googleId: googleId, password: "" },
            });
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  ));
}

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

// ── Google OAuth Routes ────────────────────────────────────────────────────────

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${FRONTEND_URL}/signin?error=google_failed` }),
  (req, res) => {
    const user = req.user as any;
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    // Redirect to frontend with token
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

app.post("/signup", async (req, res) => {
    const parsedData = SignUpSchema.safeParse(req.body);
    if (!parsedData.success) {
        const errors = parsedData.error.issues.map((e: {message: string}) => e.message).join(", ");
        return res.status(400).json({ message: errors });
    }

    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const user = await prisma.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                email: parsedData.data.email,
                photo: ""
            }
        });
        res.status(201).json({ userId: user.id });
    } catch (e: any) {
        console.error("Signup error:", e);
        // Prisma unique constraint violation
        if (e?.code === 'P2002') {
            const field = e?.meta?.target?.[0];
            if (field === 'email') return res.status(400).json({ message: "Email is already registered" });
            if (field === 'username') return res.status(400).json({ message: "Username is already taken" });
            return res.status(400).json({ message: "Account already exists" });
        }
        res.status(500).json({ message: "Error creating user", error: String(e) });
    }
});

app.post("/login", async (req, res) => {
    const parsedData = LoginSchema.safeParse(req.body);
    if (!parsedData.success) {
        const errors = parsedData.error.issues.map((e: {message: string}) => e.message).join(", ");
        return res.status(400).json({ message: errors });
    }

    const user = await prisma.user.findFirst({
        where: { username: parsedData.data.username }
    });

    if (!user) {
        return res.status(403).json({ message: "No account found with that username" });
    }

    if (!user.password) {
        return res.status(403).json({ message: "This account uses Google sign-in. Please use the Google button." });
    }

    const isPasswordValid = await bcrypt.compare(parsedData.data.password, user.password);
    if (!isPasswordValid) {
        return res.status(403).json({ message: "Incorrect password" });
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

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

