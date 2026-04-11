import { z } from 'zod';
export const adminCreateSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters").max(50),
        password: z.string().min(6, "Password must be at least 6 characters")
    })
});
export const adminUpdateSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, "ID must be a number")
    }),
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters").max(50).optional(),
        password: z.string().min(6, "Password must be at least 6 characters").optional()
    })
});
export const adminDeleteSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, "ID must be a number")
    })
});
//# sourceMappingURL=admin.schema.js.map