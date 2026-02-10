import type { Request, Response } from "express";
import { InvariantError } from "@/utils/exceptions/invariant-error.exception.js";
import { RestResponse } from "@/utils/response.utils.js";
import type { LoginRequest } from "../dto/requests/auth.request.js";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      LoginRequest,
      Record<string, never>
    >,
    res: Response,
  ) {
    const result = await this.authService.login(req.body);
    RestResponse.success(res, result);
  }

  async selectRole(req: Request, res: Response) {
    const result = await this.authService.selectRole(req.body);
    if (!result) throw new InvariantError("Role selection failed");

    RestResponse.success(res, result);
  }
}
