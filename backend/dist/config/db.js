import { PrismaClient } from '../prisma/generated/client.js';
import 'dotenv/config';
export const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
});
//# sourceMappingURL=db.js.map