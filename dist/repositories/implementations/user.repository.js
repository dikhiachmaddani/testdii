import { prisma } from "@/lib/prisma.js";
export class UserRepository {
    async findByUsername(username) {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!user)
            return null;
        return {
            id: user.id,
            username: user.username,
            roles: user.userRoles.map((ur) => ({ id: ur.role.id, name: ur.role.name })),
        };
    }
    async getActiveRoles(userId) {
        const userRoles = await prisma.userRole.findMany({
            where: { userId },
            include: {
                role: true,
            },
        });
        return userRoles.map((ur) => ({
            roleId: ur.role.id,
            roleName: ur.role.name,
        }));
    }
}
