import bcrypt from "bcrypt";
import {
  type LoginRequest,
  loginSchema,
  type SelectRoleRequest,
  selectRoleSchema,
} from "@/dto/requests/auth.request.js";
import type { LoginResponse } from "@/dto/response/login.response.js";
import type { SelectRoleResponse } from "@/dto/response/select-role.response.js";
import { ZodValidation } from "@/utils/zod-validation.js";
import { UserRepository } from "../repositories/implementations/user.repository.js";
import { generateAccessToken } from "../utils/jwt.util.js";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const validatedData = ZodValidation.validate(loginSchema, data);
    const user = await this.userRepository.findByUsername(
      validatedData.username,
    );
    if (!user || !user.password) throw new Error("Invalid credentials");
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password,
    );
    if (!isPasswordValid) throw new Error("Invalid credentials");

    return {
      userId: user.id,
      roles: user.roles || [],
    };
  }

  async selectRole(data: SelectRoleRequest): Promise<SelectRoleResponse> {
    const validatedData = ZodValidation.validate(selectRoleSchema, data);
    const roles = await this.userRepository.getActiveRoles(
      validatedData.userId,
    );
    const role = roles.find((r) => r.roleId === validatedData.roleId);

    if (!role) {
      throw new Error("User does not have access to this role");
    }

    const payload = {
      userId: validatedData.userId,
      roleId: validatedData.roleId,
      roleName: role.roleName,
    };

    const accessToken = generateAccessToken(payload);

    return {
      accessToken,
      user: {
        id: validatedData.userId,
        activeRole: role,
      },
    };
  }
}
