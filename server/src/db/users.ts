import { db } from "../config/db";
import type { Prisma } from "@prisma/client";

export default class UserRepository {
    private readonly db;
    constructor() {
        this.db = db;
    }
    async getAll() {
        return await this.db.users.findMany();
    }

    async getById(userId: string) {
        return await this.db.users.findUnique({ where: { userId } });
    }

    async getByKey(key: keyof Prisma.UsersWhereInput, value: Prisma.UsersWhereInput[keyof Prisma.UsersWhereInput]) {
        return await this.db.users.findFirst({ where: { [key]: value } });
    }

    async create(data: Prisma.UsersCreateInput) {
        return await this.db.users.create({ data });
    }

    async update(userId: string, data: Prisma.UsersUpdateInput) {
        return await this.db.users.update({ where: { userId }, data });
    }
    async delete(userId: string) {
        return await this.db.users.delete({ where: { userId } });
    }
}

export const getUserByEmail = (email: string) => db.users.findUnique({ where: { email } })
