import { z } from "zod";

// INDIVIDUAL schema
const dateSchema = z.date({ required_error: "Date must be given" });
const mealSchema = z.coerce
  .number({
    required_error: "Number is required",
    invalid_type_error: "Input must be a number",
  })
  .nonnegative({
    message: "Number must be positive",
  });
const grocerySchema = z.coerce
  .number({
    required_error: "Number is required",
    invalid_type_error: "Input must be a number",
  })
  .nonnegative({
    message: "Number must be positive",
  });

// FORM schema
const dailyActivityFormSchema = z.object({
  date: dateSchema,
  groups: z.array(
    z.object({
      meal: mealSchema,
      grocery: grocerySchema,
    })
  ),
});

const updateDailyActivityFormSchema = z.object({
  groups: z.array(
    z.object({
      id: z.string(),
      meal: mealSchema,
      grocery: grocerySchema,
      user: z.object({
        name: z.string(),
      }),
    })
  ),
});

export { dailyActivityFormSchema, updateDailyActivityFormSchema };
export type FormType = z.infer<typeof dailyActivityFormSchema>;
