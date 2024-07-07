import { z } from "zod";

import { nameSchema } from "@/libs/validations/auth";

// FORM schema
const userInfoFormSchema = z.object({
  name: nameSchema,
});

export { userInfoFormSchema };
