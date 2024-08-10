import { z } from "zod";

import { nameSchema } from "@/libs/validations/auth";

// FORM schema
const userInfoFormSchema = z.object({
  name: nameSchema,
});

const userRoleUpdateFormSchema = z.object({
  role: z.enum(["editor", "member"]),
});

export { userInfoFormSchema, userRoleUpdateFormSchema };
