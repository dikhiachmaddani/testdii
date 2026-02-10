import { prisma } from "@/lib/prisma.js";
export class MenuRepository {
    async create(data) {
        return prisma.menu.create({
            data,
        });
    }
    async update(id, data) {
        return prisma.menu.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        await prisma.menu.delete({
            where: { id },
        });
    }
    async findAll() {
        return prisma.menu.findMany({
            orderBy: { createdAt: 'asc' }, // Or any logical order
        });
    }
    async findById(id) {
        return prisma.menu.findUnique({
            where: { id },
        });
    }
    async findByRoleId(roleId) {
        const roleMenus = await prisma.roleMenu.findMany({
            where: { roleId },
            include: {
                menu: true,
            },
        });
        return roleMenus.map(rm => rm.menu);
    }
}
