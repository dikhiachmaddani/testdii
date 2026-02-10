import type {
  CreateRoleRequest,
  UpdateRoleRequest,
} from "@/dto/requests/role.request.js";
import { prismaClient } from "@/utils/prisma/prisma-client.js";
import type { Role } from "../../utils/prisma/generated/prisma/client.js";
import type { IRoleRepository } from "../interfaces/i-role.repository.js";

export class RoleRepository implements IRoleRepository {
  async create(data: CreateRoleRequest): Promise<Role> {
    return prismaClient.$transaction(async (tx) => {
      return tx.role.create({
        data,
      });
    });
  }

  async update(id: string, data: UpdateRoleRequest): Promise<Role> {
    return prismaClient.$transaction(async (tx) => {
      return tx.role.update({
        where: { id },
        data,
      });
    });
  }

  async delete(id: string): Promise<void> {
    await prismaClient.$transaction(async (tx) => {
      await tx.roleMenu.deleteMany({
        where: { roleId: id },
      });

      await tx.userRole.deleteMany({
        where: { roleId: id },
      });

      await tx.role.delete({
        where: { id },
      });
    });
  }

  async findAll(): Promise<Role[]> {
    return prismaClient.role.findMany();
  }

  async findById(id: string): Promise<Role | null> {
    return prismaClient.role.findUnique({
      where: { id },
    });
  }

  async findRolesByUserId(userId: string): Promise<Role[]> {
    const userRoles = await prismaClient.userRole.findMany({
      where: { userId },
      include: {
        role: true,
      },
    });

    return userRoles.map((ur) => ur.role);
  }

  // Access Management
  async addMenuToRole(roleId: string, menuId: string): Promise<void> {
    await prismaClient.$transaction(async (tx) => {
      const role = await tx.role.findUnique({
        where: { id: roleId },
      });
      if (!role) {
        throw new Error(`Role with id ${roleId} not found`);
      }

      const menu = await tx.menu.findUnique({
        where: { id: menuId },
      });
      if (!menu) {
        throw new Error(`Menu with id ${menuId} not found`);
      }

      await tx.roleMenu.upsert({
        where: { roleId_menuId: { roleId, menuId } },
        update: {},
        create: { roleId, menuId },
      });
    });
  }

  async removeMenuFromRole(roleId: string, menuId: string): Promise<void> {
    await prismaClient.$transaction(async (tx) => {
      const roleMenu = await tx.roleMenu.findUnique({
        where: { roleId_menuId: { roleId, menuId } },
      });
      if (!roleMenu) {
        throw new Error(`Menu ${menuId} is not assigned to role ${roleId}`);
      }

      await tx.roleMenu.delete({
        where: { roleId_menuId: { roleId, menuId } },
      });
    });
  }

  async addUserToRole(userId: string, roleId: string): Promise<void> {
    await prismaClient.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }

      const role = await tx.role.findUnique({
        where: { id: roleId },
      });
      if (!role) {
        throw new Error(`Role with id ${roleId} not found`);
      }

      await tx.userRole.upsert({
        where: { userId_roleId: { userId, roleId } },
        update: {},
        create: { userId, roleId },
      });
    });
  }

  async removeUserFromRole(userId: string, roleId: string): Promise<void> {
    await prismaClient.$transaction(async (tx) => {
      const userRole = await tx.userRole.findUnique({
        where: { userId_roleId: { userId, roleId } },
      });
      if (!userRole) {
        throw new Error(`User ${userId} is not assigned to role ${roleId}`);
      }

      await tx.userRole.delete({
        where: { userId_roleId: { userId, roleId } },
      });
    });
  }
}
