import { z } from 'zod';
import { RoleService } from '../services/role.service.js';
import { assignMenuSchema, assignUserSchema, createRoleSchema, updateRoleSchema } from '../validations/role.validation.js';
export class RoleController {
    roleService;
    constructor() {
        this.roleService = new RoleService();
    }
    create = async (req, res) => {
        try {
            const { name } = createRoleSchema.parse(req.body);
            const result = await this.roleService.createRole(name);
            res.status(201).json(result);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: 'Validation Error', errors: error.issues });
            }
            else {
                res.status(500).json({ message: error.message });
            }
        }
    };
    update = async (req, res) => {
        try {
            const { name } = updateRoleSchema.parse(req.body);
            const { id } = req.params;
            const result = await this.roleService.updateRole(id, name);
            res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: 'Validation Error', errors: error.issues });
            }
            else {
                res.status(500).json({ message: error.message });
            }
        }
    };
    delete = async (req, res) => {
        try {
            const { id } = req.params;
            await this.roleService.deleteRole(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    getAll = async (req, res) => {
        try {
            const result = await this.roleService.getAllRoles();
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    getById = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await this.roleService.getRoleById(id);
            if (!result) {
                res.status(404).json({ message: 'Role not found' });
            }
            else {
                res.status(200).json(result);
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    assignMenu = async (req, res) => {
        try {
            const body = assignMenuSchema.parse(req.body);
            const { roleId } = req.params;
            await this.roleService.assignMenuToRole(roleId, body.menuId);
            res.status(200).json({ message: 'Menu assigned to role' });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: 'Validation Error', errors: error.issues });
            }
            else {
                res.status(500).json({ message: error.message });
            }
        }
    };
    removeMenu = async (req, res) => {
        try {
            const { roleId, menuId } = req.params;
            await this.roleService.removeMenuFromRole(roleId, menuId);
            res.status(200).json({ message: 'Menu removed from role' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    assignUser = async (req, res) => {
        try {
            const body = assignUserSchema.parse(req.body);
            const { roleId } = req.params;
            await this.roleService.assignUserToRole(body.userId, roleId);
            res.status(200).json({ message: 'User assigned to role' });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: 'Validation Error', errors: error.issues });
            }
            else {
                res.status(500).json({ message: error.message });
            }
        }
    };
    removeUser = async (req, res) => {
        try {
            const { roleId, userId } = req.params;
            await this.roleService.removeUserFromRole(userId, roleId);
            res.status(200).json({ message: 'User removed from role' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}
