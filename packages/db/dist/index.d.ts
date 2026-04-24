import { PrismaClient } from "@prisma/client";
declare const prismaClientSingleton: () => PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/client").DefaultArgs>;
declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}
export declare const prisma: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/client").DefaultArgs>;
export * from "@prisma/client";
export default prisma;
//# sourceMappingURL=index.d.ts.map