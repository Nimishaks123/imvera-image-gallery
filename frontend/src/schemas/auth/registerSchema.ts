import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters"),

    email: z.string().min(1, "Email is required").email("Enter a valid email address"),

    phone: z
      .string()
      .min(1, "Phone number is required")
      .refine(
        (val) => {
          const digits = val.replace(/\D/g, "");
          return digits.length >= 7 && digits.length <= 15;
        },
        { message: "Enter a valid phone number (7–15 digits)" },
      ),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Za-z]/, "Password must include at least one letter")
      .regex(/\d/, "Password must include at least one number"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
