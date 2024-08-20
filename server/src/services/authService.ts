import type { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import UserService from "./userService";
import { JwtService, type AuthTokens } from "./jwtService";
import type { LoginUserInput, RegisterUserInput } from "../validations/userValidations";
import { HttpException } from "../utils/httpExceptions";
import dotenv from "dotenv";

dotenv.config()

const userService = new UserService();
const jwtService = new JwtService();

export default class AuthService {
  private readonly userService: UserService;
  private readonly jwtService: JwtService;
  constructor() {
    this.userService = userService;
    this.jwtService = jwtService;
  }
  async login(data: LoginUserInput): Promise<AuthTokens> {
    let user;
    if (data.phone) user = await this.userService.getByKey("phone", data.phone);
    else user = await this.userService.getByKey("email", data.email);
    if (!user || !(await bcrypt.compare(data.password, user.password)))
      throw new HttpException(400, "Wrong credentials");
    const { email, roles } = user;
    const { accessToken, refreshToken } = this.jwtService.genAuthTokens({ email, roles });
    await this.userService.update(user.userId, { refreshToken });
    return { accessToken, refreshToken };
  }
  async register(data: RegisterUserInput): Promise<AuthTokens> {
    const newUser = await this.userService.create(data);
    const { email, roles } = newUser;
    const { accessToken, refreshToken } = this.jwtService.genAuthTokens({ email, roles });
    await this.userService.update(newUser.userId, { refreshToken });
    return { accessToken, refreshToken };
  }
  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const user = await this.userService.getByKey("refreshToken", refreshToken);
    if (!user) throw new HttpException(403, "Forbidden");
    const decoded = await this.jwtService.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
    const isRolesMatch = user.roles.every((role: Role) => decoded.roles.includes(role));
    if (decoded.email !== user.email || !isRolesMatch)
      throw new HttpException(403, "Forbidden");
    const { accessToken } = this.jwtService.genAuthTokens({ email: user.email, roles: user.roles });
    return { accessToken };
  }
  async logout(refreshToken: string) {
    const user = await this.userService.getByKey("refreshToken", refreshToken);
    if (user) return await this.userService.update(user.userId, { refreshToken: "" });
  }
}

// export const register = async (data: RegisterUserInput): Promise<AuthTokens> => {
//     const newUser = await userService.create(data);
//     const { email } = newUser;
//     const { accessToken, refreshToken } = jwtService.genAuthTokens({ email });
//     await userService.update(newUser.userId, { refreshToken });
//     return { accessToken, refreshToken };
//   }