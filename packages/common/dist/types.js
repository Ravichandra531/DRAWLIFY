import { z } from "zod";
export const SignUpSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(15),
    email: z.string().email(),
});
export const LoginSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(15),
});
export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(50),
});
