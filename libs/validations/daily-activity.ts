import { z } from "zod";

// INDIVIDUAL schema
const dateSchema = z.date({ required_error: "Date must be given" });
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
const dailyActivityFormSchema = z.object({
  date: dateSchema,
  groups: z.array(
    z.object({
      meal: numberSchema,
      grocery: numberSchema,
    })
  ),
});

const updateDailyActivityFormSchema = z.object({
  groups: z.array(
    z.object({
      id: z.string(),
      meal: numberSchema,
      grocery: numberSchema,
      user: z.object({
        name: z.string(),
      }),
    })
  ),
});

export { dailyActivityFormSchema, updateDailyActivityFormSchema };
export type FormType = z.infer<typeof dailyActivityFormSchema>;
