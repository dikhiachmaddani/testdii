import type { Request, Response } from "express";
import { RestResponse } from "@/utils/response.utils.js";
import {
  assignMenuSchema,
  assignUserSchema,
} from "../dto/requests/role.request.js";
import { RoleService } from "../services/role.service.js";

export class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  create = async (req: Request, res: Response) => {
    const result = await this.roleService.createRole(req.body);
    RestResponse.success(res, result);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.roleService.updateRole(id, req.body);
    RestResponse.success(res, result);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await this.roleService.deleteRole(id);
    RestResponse.success(res, { message: "Role deleted successfully" });
  };

  getAll = async (_req: Request, res: Response) => {
    const result = await this.roleService.getAllRoles();
    RestResponse.success(res, result);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.roleService.getRoleById(id);
    RestResponse.success(res, result);
  };

  assignMenu = async (req: Request, res: Response) => {
    const body = assignMenuSchema.parse(req.body);
    const { roleId } = req.params as { roleId: string };
    await this.roleService.assignMenuToRole(roleId, body.menuId);
    RestResponse.success(res, { message: "Menu assigned to role" });
  };

  removeMenu = async (req: Request, res: Response) => {
    const { roleId, menuId } = req.params as { roleId: string; menuId: string };
    await this.roleService.removeMenuFromRole(roleId, menuId);
    RestResponse.success(res, { message: "Menu removed from role" });
  };

  assignUser = async (req: Request, res: Response) => {
    const body = assignUserSchema.parse(req.body);
    const { roleId } = req.params as { roleId: string };
    await this.roleService.assignUserToRole(body.userId, roleId);
    RestResponse.success(res, { message: "User assigned to role" });
  };

  removeUser = async (req: Request, res: Response) => {
    const { roleId, userId } = req.params as { roleId: string; userId: string };
    await this.roleService.removeUserFromRole(userId, roleId);
    RestResponse.success(res, { message: "User removed from role" });
  };
}
