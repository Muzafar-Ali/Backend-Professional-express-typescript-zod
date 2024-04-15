import { z } from "zod";

const createUserSchema = z.object({
  
  body: z.object({
    
    name: z.string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a character",
    }).min(3,"Name must be at least 3 characters"),

    email: z.string({
      required_error: "Email is required",
    }).email("Invalid email"),

    password: z.string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters")
    .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/(?=.*[0-9])/, "Password must contain at least one digit")
    .regex(/(?=.*[!@#$%^&*])/, "Password must contain at least one special character"),
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
    //   "Password must contain at least one lowercase letter, one uppercase letter one number and one special character"
    // )
    
    passwordConfirmation: z.string({ required_error: "Password confirmation is required" }),

  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password do not match",
    path: ["passwordConfirmation"],
  })

})

export type createUserInputType = Omit<z.infer<typeof createUserSchema>, "body.passwordConfirmation">;
// export type createUserSchemaTypeWithId = createUserSchemaType & { id: string }

export default createUserSchema;