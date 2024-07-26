import { z } from "zod";

// INDIVIDUAL schema
const numberSchema = z.coerce
  .number({
    required_error: "Number is required",
    invalid_type_error: "Input must be a number",
  })
  .nonnegative({
    message: "Number must be positive",
  });

// FORM schema
const monthlyUtilityFormSchema = z.object({
  electricity: numberSchema,
  internet: numberSchema,
  water: numberSchema,
  gas: numberSchema,
  cook: numberSchema,
  otherUtils: numberSchema,
});

export { monthlyUtilityFormSchema };
export type FormType = z.infer<typeof monthlyUtilityFormSchema>;
