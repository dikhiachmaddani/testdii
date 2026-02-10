import type { User } from "@/types/user.type.js";

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  getActiveRoles(
    userId: string,
  ): Promise<{ roleId: string; roleName: string }[]>;
}
