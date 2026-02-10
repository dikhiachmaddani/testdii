import { z } from "zod";

export const createMenuSchema = z.object({
  name: z.string().min(1),
  parentId: z.string().uuid().nullable().optional(),
});

export const updateMenuSchema = z.object({
  name: z.string().min(1).optional(),
  parentId: z.string().uuid().nullable().optional(),
});

export type CreateMenuRequest = z.infer<typeof createMenuSchema>;
export type UpdateMenuRequest = z.infer<typeof updateMenuSchema>;
