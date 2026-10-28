import * as zod from "zod";
export const RegisterSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("name is required")
      .min(3, "min length is 3 chars")
      .max(13, "max length is 13 chars"),

    email: zod
      .email()
      .nonempty("email is required")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalid email"),

    dateOfBirth: zod
      .string()
      .nonempty("date is required")
      .refine((dateOfBirthValue) => {
        const userDate = new Date(dateOfBirthValue).getFullYear(); // user year
        const nowDate = new Date().getFullYear(); // now year
        return nowDate - userDate > 10 ? true : false;
      }, "Date should be less than ===> 2015"),

    gender: zod.enum(["male", "female"]),

    password: zod
      .string()
      .nonempty("password is required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "The password must be ≥ 8 characters and contain: an uppercase letter + a lowercase letter + a number + a special character from the list above",
      ),

    rePassword: zod.string().nonempty("password is required"),
  })
  .refine(
    (obj) => {
      if (obj.password === obj.rePassword) {
        return true;
      } else {
        return false;
      }
    },
    {
      path: ["rePassword"],
      error: "Password and rePassword not match",
    },
  );
export type RegisterSchemaType = zod.infer<typeof RegisterSchema>;
///////////////////////////////////////////////////

export const LoginSchema = zod.object({
  email: zod
    .email()
    .nonempty("email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalid email"),

  password: zod
    .string()
    .nonempty("password is required")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "The password must be ≥ 8 characters and contain: an uppercase letter + a lowercase letter + a number + a special character from the list above",
    ),
});

export type LoginSchemaType = zod.infer<typeof LoginSchema>;
