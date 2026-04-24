import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "./generated/prisma/index.js";
const prismaClientSingleton = () => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = prisma;
export * from "./generated/prisma/index.js";
export default prisma;
