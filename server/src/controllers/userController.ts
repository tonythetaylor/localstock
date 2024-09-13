import type { NextFunction, Request, Response } from "express";
import UserService from "../services/userService";
import { getUserByEmail } from "../db/users";
import { authentication, random } from '../helpers';

const userService = new UserService();
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/api-error";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password, name } = req.body
  // const { productId, name, price, rating, stockQuantity } = req.body;

  if (!email || !password || !name) {
    res.sendStatus(400)
  }

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    res.sendStatus(400)
  }
  try {
    const user = await userService.create(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAll();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getById(req.params.id);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) throw new ApiError('User not found', 404)

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.delete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

