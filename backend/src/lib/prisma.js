import { PrismaClient } from "@prisma/client";

// Creamos una única instancia de Prisma Client.
// Este objeto nos permite consultar MySQL desde Express.
const prisma = new PrismaClient();

export default prisma;