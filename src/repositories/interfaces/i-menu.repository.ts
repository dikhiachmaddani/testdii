import type { Menu } from "../../utils/prisma/generated/prisma/client.js";

export interface IMenuRepository {
  create(data: { name: string; parentId?: string | null }): Promise<Menu>;
  update(
    id: string,
    data: { name?: string; parentId?: string | null },
  ): Promise<Menu>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Menu[]>;
  findById(id: string): Promise<Menu | null>;
  findByRoleId(roleId: string): Promise<Menu[]>;
}
