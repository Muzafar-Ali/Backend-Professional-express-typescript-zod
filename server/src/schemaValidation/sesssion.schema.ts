import { z } from "zod";

const createSessionSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }),
    password: z.string({ required_error: "Password is required "})
  })
})


export type CreateSessionInputType = z.infer<typeof createSessionSchema>

export default createSessionSchema;
