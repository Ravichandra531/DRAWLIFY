import { z } from "zod";
export declare const SignUpSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    email: z.ZodString;
}, z.core.$strip>;
export declare const LoginSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const CreateRoomSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=types.d.ts.map