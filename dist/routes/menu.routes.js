import { Router } from 'express';
import { MenuController } from '../controllers/menu.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
const router = Router();
const menuController = new MenuController();
// Create, Update, Delete usually require higher privileges (e.g. ADMIN)
// For now just basic auth.
router.post('/', authenticate, menuController.create);
router.put('/:id', authenticate, menuController.update);
router.delete('/:id', authenticate, menuController.delete);
router.get('/', authenticate, menuController.getAll);
router.get('/role/:roleId', authenticate, menuController.getRoleMenus);
export default router;
