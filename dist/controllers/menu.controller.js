import { z } from 'zod';
import { MenuService } from '../services/menu.service.js';
import { createMenuSchema, updateMenuSchema } from '../validations/menu.validation.js';
export class MenuController {
    menuService;
    constructor() {
        this.menuService = new MenuService();
    }
    create = async (req, res) => {
        try {
            const body = createMenuSchema.parse(req.body);
            const result = await this.menuService.createMenu(body);
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
            const body = updateMenuSchema.parse(req.body);
            const { id } = req.params;
            const result = await this.menuService.updateMenu(id, body);
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
            await this.menuService.deleteMenu(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    getAll = async (req, res) => {
        try {
            const result = await this.menuService.getAllMenus();
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    getRoleMenus = async (req, res) => {
        try {
            const { roleId } = req.params;
            const result = await this.menuService.getRoleMenus(roleId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}
