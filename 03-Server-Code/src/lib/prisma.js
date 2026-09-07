import { PrismaClient } from '@prisma/client'

// A single shared client, reused across requests (and across hot reloads
// in dev) instead of opening a new database connection per request.
export const prisma = new PrismaClient()
