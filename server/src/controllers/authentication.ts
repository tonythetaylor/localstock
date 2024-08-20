import type { Request, Response, NextFunction, CookieOptions } from "express";
import AuthService from "../services/authService";

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "none",
  secure: process.env.NODE_ENV === "production",
};

const authService = new AuthService();

export default class AuthController {
  private readonly authService: AuthService;
  constructor() {
    this.authService = authService;
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken } = await this.authService.login(req.body);
      res
        .cookie("jwt", refreshToken, COOKIE_OPTIONS)
        .status(200)
        .send({ accessToken });
    } catch (err) {
      next(err);
    }
  }
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken } = await this.authService.register(req.body);
      res
        .cookie("jwt", refreshToken, COOKIE_OPTIONS)
        .status(201)
        .send({ accessToken });
    } catch (err) {
      next(err);
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken } = await this.authService.refresh(req.cookies.jwt);
      res.status(200).send({ accessToken });
    } catch (err) {
      next(err);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.jwt;
      if (!refreshToken) {
        res.sendStatus(204);
        return;
      }
      const user = await this.authService.logout(refreshToken);
      if (user) {
        res.clearCookie("jwt", COOKIE_OPTIONS).sendStatus(204);
        return;
      }
      res.clearCookie("jwt", COOKIE_OPTIONS).sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}