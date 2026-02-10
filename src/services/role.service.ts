import {
  type CreateRoleRequest,
  createRoleSchema,
  type UpdateRoleRequest,
  updateRoleSchema,
} from "@/dto/requests/role.request.js";
import { ZodValidation } from "@/utils/zod-validation.js";
import { RoleRepository } from "../repositories/implementations/role.repository.js";
import type { Role } from "../utils/prisma/generated/prisma/client.js";

export class RoleService {
  private roleRepository: RoleRepository;

  constructor() {
    this.roleRepository = new RoleRepository();
  }

  async createRole(data: CreateRoleRequest): Promise<Role> {
    const validatedData = ZodValidation.validate(createRoleSchema, data);
    return this.roleRepository.create(validatedData);
  }

  async updateRole(id: string, data: UpdateRoleRequest): Promise<Role> {
    const validatedData = ZodValidation.validate(updateRoleSchema, data);
    return this.roleRepository.update(id, validatedData);
  }

  async deleteRole(id: string): Promise<void> {
    return this.roleRepository.delete(id);
  }

  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async getRoleById(id: string): Promise<Role | null> {
    return this.roleRepository.findById(id);
  }

  async assignMenuToRole(roleId: string, menuId: string): Promise<void> {
    return this.roleRepository.addMenuToRole(roleId, menuId);
  }

  async removeMenuFromRole(roleId: string, menuId: string): Promise<void> {
    return this.roleRepository.removeMenuFromRole(roleId, menuId);
  }

  async assignUserToRole(userId: string, roleId: string): Promise<void> {
    return this.roleRepository.addUserToRole(userId, roleId);
  }

  async removeUserFromRole(userId: string, roleId: string): Promise<void> {
    return this.roleRepository.removeUserFromRole(userId, roleId);
  }
}
