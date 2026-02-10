import type { Role } from "../../utils/prisma/generated/prisma/client.js";

export interface IRoleRepository {
  create(data: { name: string }): Promise<Role>;
  update(id: string, data: { name?: string }): Promise<Role>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  findRolesByUserId(userId: string): Promise<Role[]>;

  // Access Management
  addMenuToRole(roleId: string, menuId: string): Promise<void>;
  removeMenuFromRole(roleId: string, menuId: string): Promise<void>;

  addUserToRole(userId: string, roleId: string): Promise<void>;
  removeUserFromRole(userId: string, roleId: string): Promise<void>;
}
