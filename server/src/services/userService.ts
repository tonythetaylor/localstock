import type { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import UserRepository from "../db/users";
import { HttpException } from "../utils/httpExceptions";

const userRepository = new UserRepository();

export default class UserService {
  private userRepository: UserRepository;
  constructor() {
    //this is how dependency injection is done
    //we're injecting UserRepository into UserService
    this.userRepository = userRepository;
  }
  async getAll() {
    return await this.userRepository.getAll();
  }
  async getById(id: string) {
    const user = await this.userRepository.getById(id);
    if (!user) throw new HttpException(404, "User not found");
    return user;
  }
  async getByKey(key: keyof Prisma.UsersWhereInput, value: Prisma.UsersWhereInput[typeof key]) {
    return await this.userRepository.getByKey(key, value);
  }
  async create(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await this.userRepository.create({ ...data, password: hashedPassword });
  }
  async update(id: string, data: any) {
    await this.getById(id);
    if (data.password)
      data.password = await bcrypt.hash(data.password, 10);
    return await this.userRepository.update(id, data);
  }
  async delete(id: string) {
    await this.getById(id);
    await this.userRepository.delete(id);
  }
}