import { z } from "zod";

const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).+$/; // must have at least 1 num and 1 char

// INDIVIDUAL schema
const nameSchema = z
  .string()
  .min(3, {
    message: "Your name should be at least have 3 characters",
  })
  .max(40, {
    message: "Your name can have maximum 40 characters",
  });

const emailSchema = z.string().email({
  message: "Invalid email address",
});

const passwordSchema = z
  .string()
  .regex(passwordRegex, {
    message: "Password must include both numbers and letters",
  })
  .min(8, {
    message: "Password must be at least 8 characters long",
  });

// FORM schema
const signupFormSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirm_password: passwordSchema,
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

const signinFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const forgotPasswordFormSchema = z.object({
  email: emailSchema,
});

const resetPasswordFormSchema = z
  .object({
    token: z.string(),
    password: passwordSchema,
    confirm_password: passwordSchema,
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export {
  nameSchema,
  emailSchema,
  signupFormSchema,
  signinFormSchema,
  forgotPasswordFormSchema,
  resetPasswordFormSchema,
};
