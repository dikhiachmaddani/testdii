import { RoleRepository } from '../repositories/implementations/role.repository.js';
export class RoleService {
    roleRepository;
    constructor() {
        this.roleRepository = new RoleRepository();
    }
    async createRole(name) {
        return this.roleRepository.create({ name });
    }
    async updateRole(id, name) {
        return this.roleRepository.update(id, { name });
    }
    async deleteRole(id) {
        return this.roleRepository.delete(id);
    }
    async getAllRoles() {
        return this.roleRepository.findAll();
    }
    async getRoleById(id) {
        return this.roleRepository.findById(id);
    }
    async assignMenuToRole(roleId, menuId) {
        return this.roleRepository.addMenuToRole(roleId, menuId);
    }
    async removeMenuFromRole(roleId, menuId) {
        return this.roleRepository.removeMenuFromRole(roleId, menuId);
    }
    async assignUserToRole(userId, roleId) {
        return this.roleRepository.addUserToRole(userId, roleId);
    }
    async removeUserFromRole(userId, roleId) {
        return this.roleRepository.removeUserFromRole(userId, roleId);
    }
}
