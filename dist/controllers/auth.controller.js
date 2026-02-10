import { z } from 'zod';
import { AuthService } from '../services/auth.service.js';
import { loginSchema, selectRoleSchema } from '../validations/auth.validation.js';
export class AuthController {
    authService;
    constructor() {
        this.authService = new AuthService();
    }
    login = async (req, res) => {
        console.log(req.body);
        try {
            const { username, password } = loginSchema.parse(req.body);
            const result = await this.authService.login(username, password);
            res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: 'Validation Error', errors: error.issues });
            }
            else {
                res.status(401).json({ message: error.message || 'Authentication failed' });
            }
        }
    };
    selectRole = async (req, res) => {
        try {
            const { userId, roleId } = selectRoleSchema.parse(req.body);
            const result = await this.authService.selectRole(userId, roleId);
            res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: 'Validation Error', errors: error.issues });
            }
            else {
                res.status(403).json({ message: error.message || 'Role selection failed' });
            }
        }
    };
}
