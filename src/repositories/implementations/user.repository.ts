import type { User } from "@/types/user.type.js";
import { InvariantError } from "@/utils/exceptions/invariant-error.exception.js";
import { prismaClient } from "@/utils/prisma/prisma-client.js";
import type { IUserRepository } from "../interfaces/i-user.repository.js";

export class UserRepository implements IUserRepository {
  async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await prismaClient.user.findUnique({
        where: { username },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) throw new InvariantError("User not found");

      return {
        id: user.id,
        username: user.username,
        password: user.password,
        roles:
          user.userRoles.map((ur) => ({
            id: ur.role.id,
            name: ur.role.name,
          })) || [],
      };
    } catch (_error) {
      throw new InvariantError("Failed to get user by username");
    }
  }

  async getActiveRoles(
    userId: string,
  ): Promise<{ roleId: string; roleName: string }[]> {
    const userRoles = await prismaClient.userRole.findMany({
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
