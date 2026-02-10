import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/implementations/user.repository.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util.js';
export class AuthService {
    userRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }
    async login(username, password) {
        console.log(username, password);
        const user = await this.userRepository.findByUsername(username);
        if (!user || !user.password) {
            throw new Error('Invalid credentials');
        }
        console.log(user);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        // Return user info and roles.
        // Logic: 
        // If multiple roles -> Frontend asks user to select.
        // If single role -> We still return list, frontend can auto-select.
        // The requirement says: "Untuk User dengan jabatan ganda setelah proses login sistem akan memberi pilihan role apa yang dipilih"
        return {
            userId: user.id,
            roles: user.roles || [],
            // Optionally return token if only 1 role? 
            // Plan said: "If the user has only one role, step 1 will immediately return the final access token."
            // Let's stick to the plan but the updated plan said "returning the list is consistent".
            // Let's return both if single role to allow frontend flexibility.
            // But adhering to the strict plan "after login system will give choice" implies 2 steps.
            // However, for single role it's annoying.
            // I'll return the list.
        };
    }
    async selectRole(userId, roleId) {
        const roles = await this.userRepository.getActiveRoles(userId);
        const role = roles.find(r => r.roleId === roleId);
        if (!role) {
            throw new Error('User does not have access to this role');
        }
        const payload = {
            userId,
            roleId,
            roleName: role.roleName,
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        return {
            accessToken,
            refreshToken,
            user: {
                id: userId,
                activeRole: role,
            }
        };
    }
}
