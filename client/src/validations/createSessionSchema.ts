import { z } from "zod";

export const createSessionSchema = z.object({
    email: z.string({ required_error: "Email is required" }),
    password: z.string({ required_error: "Password is required "})
})

export type CreateSessionInputType = z.TypeOf<typeof createSessionSchema>


  