import * as z from "zod";

export const productSchema = z
  .object({
    name: z
      .string()
      .min(1, "Product name is required")
      .min(3, "Product name must be at least 3 characters"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only"),
    sku: z.string().min(1, "SKU is required"),
    brand: z.string().min(1, "Brand is required"),
    category: z.string().min(1, "Category is required"),
    subcategory: z.string().optional(),
    images: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image is required"),
    price: z.coerce.number().positive("Price must be greater than 0"),
    mrp: z.coerce.number().positive("MRP must be greater than 0"),
    costPrice: z.coerce.number().positive("Cost price must be greater than 0"),
    discountPercent: z
      .coerce.number()
      .min(0, "Discount must be 0 or greater")
      .max(100, "Discount cannot exceed 100%"),
    rating: z
      .coerce.number()
      .min(0, "Rating must be 0 or greater")
      .max(5, "Rating cannot exceed 5")
      .default(0),
    ratingCount: z.coerce.number().min(0, "Rating count must be 0 or greater").default(0),
    stock: z
      .coerce.number()
      .min(0, "Stock must be 0 or greater")
      .int("Stock must be a whole number"),
    lowStockThreshold: z
      .coerce.number()
      .min(0, "Low stock threshold must be 0 or greater")
      .int("Threshold must be a whole number"),
    backorder: z.boolean().default(false),
    status: z.enum(["active", "draft", "inactive"], {
      required_error: "Please select a status",
    }),
    featured: z.boolean().default(false),
    bestseller: z.boolean().default(false),
    isNew: z.boolean().default(false),
    sponsored: z.boolean().default(false),
  })
  .refine((data) => data.price <= data.mrp, {
    message: "Price must be less than or equal to MRP",
    path: ["price"],
  })
  .refine((data) => {
    const calculatedDiscount = ((data.mrp - data.price) / data.mrp) * 100;
    return Math.abs(calculatedDiscount - data.discountPercent) < 0.01;
  }, {
    message: "Discount percentage doesn't match price and MRP",
    path: ["discountPercent"],
  });

export type ProductInput = z.infer<typeof productSchema>;


