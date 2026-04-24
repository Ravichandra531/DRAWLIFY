import { PrismaClient } from "./generated/prisma/index.js";
declare const prismaClientSingleton: () => PrismaClient<import("./generated/prisma/index.js").Prisma.PrismaClientOptions, never, import("./generated/prisma/runtime/client.js").DefaultArgs>;
declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}
export declare const prisma: PrismaClient<import("./generated/prisma/index.js").Prisma.PrismaClientOptions, never, import("./generated/prisma/runtime/client.js").DefaultArgs>;
export * from "./generated/prisma/index.js";
export default prisma;
//# sourceMappingURL=index.d.ts.map