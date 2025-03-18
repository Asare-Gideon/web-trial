import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const signupSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  userEmail: z.string().email({
    message: "Enter correct email",
  }),
  userPhoneNumber: z.string().min(9, {
    message: "Username must be at valid phone number",
  }),
  userPasword: z.string().min(6, {
    message: "Username must be at least 2 characters.",
  }),
});

export const loginSchema = z.object({
  userEmail: z.string().email({
    message: "Enter correct email address",
  }),
  userPassword: z.string().min(6, {
    message: "Enter correct valid password",
  }),
});
export const newCategorySchema = z.object({
  name: z.string().min(2, {
    message: "category name must be at least 2 characters.",
  }),
});

export const contactUsSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Enter correct email address",
  }),
  phoneNumber: z.string().min(9, {
    message: "Username must be at least 2 characters.",
  }),
  message: z
    .string()
    .min(10, {
      message: "Message must be at least 10 characters.",
    })
    .max(160, {
      message: "Message must not be longer than 30 characters.",
    }),
});

export const procurementSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productQuantity: z.string().min(1, {
    message: "Product quantity must be at least 1 characters.",
  }),
  productBasePrice: z.string().min(1, {
    message: "Product base price must be at least 1 characters.",
  }),
  productLink: z.string().min(2, {
    message: "Product link must be at least 2 characters.",
  }),
  productImage: z.string().min(2, {
    message: "Product link must be at least 2 characters.",
  }),
});
