import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1),
});

export const assignMenuSchema = z.object({
  menuId: z.string().uuid(),
});

export const assignUserSchema = z.object({
  userId: z.string().uuid(),
});

export type CreateRoleRequest = z.infer<typeof createRoleSchema>;
export type UpdateRoleRequest = z.infer<typeof updateRoleSchema>;
export type AssignMenuRequest = z.infer<typeof assignMenuSchema>;
export type AssignUserRequest = z.infer<typeof assignUserSchema>;
