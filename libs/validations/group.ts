import { z } from "zod";

// INDIVIDUAL schema
const nameSchema = z
  .string()
  .min(4, {
    message: "Group name should be at least have 4 characters",
  })
  .max(40, {
    message: "Group name can have maximum of 40 characters",
  });

// const codeSchema = z.coerce.number().refine(
//   (val) => {
//     const str = val.toString();
//     return str.length === 4;
//   },
//   {
//     message: "Code must be exactly 4 digits long",
//   }
// );

const codeSchema = z
  .number({ required_error: "Group code must be given" })
  .positive({ message: "Code must be positive" })
  .int({ message: "Code must be integer" })
  .or(z.string())
  .refine(
    (val) => {
      const str = val.toString();
      return str.length === 4;
    },
    {
      message: "Code must be exactly 4 digits long",
    }
  )
  .pipe(
    z.coerce
      .number({ required_error: "Group code must be given" })
      .positive({ message: "Code must be positive" })
      .int({ message: "Code must be integer" })
  );

// FORM schema
const groupFormSchema = z.object({
  name: nameSchema,
  code: codeSchema,
});

export { groupFormSchema };
export type FormType = z.infer<typeof groupFormSchema>;
