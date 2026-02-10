import { MenuRepository } from '../repositories/implementations/menu.repository.js';
export class MenuService {
    menuRepository;
    constructor() {
        this.menuRepository = new MenuRepository();
    }
    async createMenu(data) {
        return this.menuRepository.create(data);
    }
    async updateMenu(id, data) {
        return this.menuRepository.update(id, data);
    }
    async deleteMenu(id) {
        return this.menuRepository.delete(id);
    }
    async getAllMenus() {
        const menus = await this.menuRepository.findAll();
        return this.buildTree(menus);
    }
    async getRoleMenus(roleId) {
        const menus = await this.menuRepository.findByRoleId(roleId);
        return this.buildTree(menus);
    }
    buildTree(menus) {
        const map = new Map();
        const roots = [];
        // Initialize map
        for (const menu of menus) {
            map.set(menu.id, { ...menu, children: [] });
        }
        // Build hierarchy
        for (const menu of menus) {
            const node = map.get(menu.id);
            if (menu.parentId && map.has(menu.parentId)) {
                const parent = map.get(menu.parentId);
                parent.children.push(node);
            }
            else {
                // If parentId is null OR parent not found in the set (e.g. role restriction excludes parent), treat as root
                // If strict hierarchy is required (broken tree shouldn't happen), assume parent exists.
                // But for getRoleMenus, we might have partial trees.
                // It's safer to treat missing parent as root for display purposes or handle gracefully.
                roots.push(node);
            }
        }
        return roots;
    }
}
