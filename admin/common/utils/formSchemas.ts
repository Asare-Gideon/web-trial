import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const addNewProductSchema = z.object({
  productName: z.string().min(2, {
    message: "prodcut name must be at least 2 characters.",
  }),
  productDescription: z.string().min(2, {
    message: "description must be at least 2 characters.",
  }),
  productPrice: z.string(),
  productQuantity: z.string(),
  category: z.string({
    required_error: "Please select category",
  }),
});

export const addNewBlogSchema = z.object({
  title: z.string().min(2, {
    message: "blog title must be at least 2 characters.",
  }),
  blogType: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});
