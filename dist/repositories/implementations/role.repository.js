import { prisma } from "@/lib/prisma.js";
export class RoleRepository {
    async create(data) {
        return prisma.role.create({
            data,
        });
    }
    async update(id, data) {
        return prisma.role.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        await prisma.role.delete({
            where: { id },
        });
    }
    async findAll() {
        return prisma.role.findMany();
    }
    async findById(id) {
        return prisma.role.findUnique({
            where: { id },
        });
    }
    async findRolesByUserId(userId) {
        const userRoles = await prisma.userRole.findMany({
            where: { userId },
            include: {
                role: true,
            },
        });
        return userRoles.map(ur => ur.role);
    }
    // Access Management
    async addMenuToRole(roleId, menuId) {
        await prisma.roleMenu.upsert({
            where: { roleId_menuId: { roleId, menuId } },
            update: {},
            create: { roleId, menuId },
        });
    }
    async removeMenuFromRole(roleId, menuId) {
        await prisma.roleMenu.delete({
            where: { roleId_menuId: { roleId, menuId } },
        });
    }
    async addUserToRole(userId, roleId) {
        await prisma.userRole.upsert({
            where: { userId_roleId: { userId, roleId } },
            update: {},
            create: { userId, roleId },
        });
    }
    async removeUserFromRole(userId, roleId) {
        await prisma.userRole.delete({
            where: { userId_roleId: { userId, roleId } },
        });
    }
}
