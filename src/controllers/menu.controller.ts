import type { Request, Response } from "express";
import { RestResponse } from "@/utils/response.utils.js";
import { MenuService } from "../services/menu.service.js";

export class MenuController {
  private menuService: MenuService;

  constructor() {
    this.menuService = new MenuService();
  }

  create = async (req: Request, res: Response) => {
    const result = await this.menuService.createMenu(req.body);
    RestResponse.success(res, result);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.menuService.updateMenu(id, req.body);
    RestResponse.success(res, result);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await this.menuService.deleteMenu(id);
    RestResponse.success(res, { message: "Menu deleted successfully" });
  };

  getAll = async (_req: Request, res: Response) => {
    const result = await this.menuService.getAllMenus();
    RestResponse.success(res, result);
  };

  getRoleMenus = async (req: Request, res: Response) => {
    const { roleId } = req.params as { roleId: string };
    const result = await this.menuService.getRoleMenus(roleId);
    RestResponse.success(res, result);
  };
}
