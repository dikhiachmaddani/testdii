import { prismaClient } from "@/utils/prisma/prisma-client.js";
import type { Menu } from "../../utils/prisma/generated/prisma/client.js";
import type { IMenuRepository } from "../interfaces/i-menu.repository.js";

export class MenuRepository implements IMenuRepository {
  async create(data: {
    name: string;
    parentId?: string | null;
  }): Promise<Menu> {
    return prismaClient.$transaction(async (tx) => {
      return tx.menu.create({
        data,
      });
    });
  }

  async update(
    id: string,
    data: { name?: string; parentId?: string | null },
  ): Promise<Menu> {
    return prismaClient.$transaction(async (tx) => {
      return tx.menu.update({
        where: { id },
        data,
      });
    });
  }

  async delete(id: string): Promise<void> {
    await prismaClient.$transaction(async (tx) => {
      await tx.roleMenu.deleteMany({
        where: { menuId: id },
      });

      await tx.menu.delete({
        where: { id },
      });
    });
  }

  async findAll(): Promise<Menu[]> {
    return prismaClient.menu.findMany({
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(id: string): Promise<Menu | null> {
    return prismaClient.menu.findUnique({
      where: { id },
    });
  }

  async findByRoleId(roleId: string): Promise<Menu[]> {
    const roleMenus = await prismaClient.roleMenu.findMany({
      where: { roleId },
      include: {
        menu: true,
      },
    });

    return roleMenus.map((rm) => rm.menu);
  }
}
