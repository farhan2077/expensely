import { z } from "zod";

// INDIVIDUAL schema
const numberSchema = z.preprocess(
  (val) => (val === "" ? undefined : Number(val)),
  z
    .number({
      required_error: "Input is required",
      invalid_type_error: "Input must be a number",
    })
    .nonnegative({
      message: "Input number must be positive",
    })
);

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
