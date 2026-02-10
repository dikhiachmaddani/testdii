import {
  type CreateMenuRequest,
  createMenuSchema,
  type UpdateMenuRequest,
  updateMenuSchema,
} from "@/dto/requests/menu.request.js";
import { ZodValidation } from "@/utils/zod-validation.js";
import type { MenuTree } from "../dto/response/three-menu.response.js";
import { MenuRepository } from "../repositories/implementations/menu.repository.js";
import type { Menu } from "../utils/prisma/generated/prisma/client.js";

export class MenuService {
  private menuRepository: MenuRepository;

  constructor() {
    this.menuRepository = new MenuRepository();
  }

  async createMenu(data: CreateMenuRequest): Promise<Menu> {
    const validatedData = ZodValidation.validate(createMenuSchema, data);
    return this.menuRepository.create(validatedData);
  }

  async updateMenu(id: string, data: UpdateMenuRequest): Promise<Menu> {
    const validatedData = ZodValidation.validate(updateMenuSchema, data);
    return this.menuRepository.update(id, validatedData);
  }

  async deleteMenu(id: string): Promise<void> {
    return this.menuRepository.delete(id);
  }

  async getAllMenus(): Promise<MenuTree[]> {
    const menus = await this.menuRepository.findAll();
    return this.buildTree(menus);
  }

  async getRoleMenus(roleId: string): Promise<MenuTree[]> {
    const menus = await this.menuRepository.findByRoleId(roleId);
    return this.buildTree(menus);
  }

  private buildTree(menus: Menu[]): MenuTree[] {
    const map = new Map<string, MenuTree>();
    const roots: MenuTree[] = [];

    // Initialize map
    for (const menu of menus) {
      map.set(menu.id, { ...menu, children: [] });
    }

    // Build hierarchy
    for (const menu of menus) {
      const node = map.get(menu.id);
      if (!node) continue;

      if (menu.parentId && map.has(menu.parentId)) {
        const parent = map.get(menu.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    return roots;
  }
}
