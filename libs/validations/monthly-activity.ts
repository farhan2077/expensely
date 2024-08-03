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
const monthlyActivityFormSchema = z.object({
  formGroups: z.array(
    z.object({
      rent: numberSchema,
      paid: numberSchema,
    })
  ),
});

const editMonthlyActivityFormSchema = z.object({
  rent: numberSchema,
  paid: numberSchema,
});

export { monthlyActivityFormSchema, editMonthlyActivityFormSchema };
export type FormType = z.infer<typeof monthlyActivityFormSchema>;
export type EditMonthlyActivityFormType = z.infer<
  typeof editMonthlyActivityFormSchema
>;
