import { z } from "zod"

export const LoginSchema = z.object({
  // email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(1, { message: 'Name must be at least 1 characters long.' }),
})
