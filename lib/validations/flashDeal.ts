import * as z from "zod";

export const flashDealProductSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  basePrice: z.coerce.number().positive("Base price must be greater than 0"),
  dealPrice: z.coerce.number().positive("Deal price must be greater than 0"),
  discountPercent: z.coerce.number().min(0).max(100).optional(),
  dealQuantity: z.coerce.number().int().positive("Deal quantity must be at least 1"),
  initialStock: z.coerce.number().int().positive("Initial stock must be at least 1"),
  maxQuantityPerUser: z.coerce.number().int().positive("Max quantity per user must be at least 1"),
  minOrderQuantity: z.coerce.number().int().positive("Min order quantity must be at least 1").default(1),
});

export const flashDealSchema = z
  .object({
    title: z.string().min(1, "Deal title is required").min(3, "Title must be at least 3 characters"),
    dealType: z.enum(["flash-deal", "lightning-deal"], {
      required_error: "Please select a deal type",
    }),
    discountType: z.enum(["flat-price", "percentage"], {
      required_error: "Please select a discount type",
    }),
    products: z.array(flashDealProductSchema).min(1, "At least one product is required"),
    startDate: z.coerce.date({
      required_error: "Start date is required",
    }),
    endDate: z.coerce.date({
      required_error: "End date is required",
    }),
    showOnHomepage: z.boolean().default(false),
    priority: z.coerce.number().int().min(0).default(0),
    badgeText: z.string().optional(),
    showCountdown: z.boolean().default(true),
    eligibleSections: z
      .array(z.enum(["homepage", "category", "search"]))
      .min(1, "At least one eligible section is required")
      .default(["homepage"]),
    maxOrdersPerUser: z.coerce.number().int().positive().default(1),
    paymentMethodRestrictions: z.array(z.string()).optional(),
    geoRestrictions: z.array(z.string()).optional(),
    enableCaptcha: z.boolean().default(false),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine((data) => {
    const now = new Date();
    return data.startDate >= now;
  }, {
    message: "Start date must be in the future",
    path: ["startDate"],
  })
  .refine((data) => {
    const duration = data.endDate.getTime() - data.startDate.getTime();
    const minDuration = 60 * 60 * 1000; // 1 hour minimum
    return duration >= minDuration;
  }, {
    message: "Deal duration must be at least 1 hour",
    path: ["endDate"],
  })
  .refine((data) => {
    // Validate discount calculation for percentage type
    if (data.discountType === "percentage") {
      return data.products.every((product) => {
        if (product.discountPercent === undefined) return false;
        const calculatedDiscount = ((product.basePrice - product.dealPrice) / product.basePrice) * 100;
        return Math.abs(calculatedDiscount - product.discountPercent) < 0.01;
      });
    }
    return true;
  }, {
    message: "Discount percentage doesn't match base price and deal price",
    path: ["products"],
  });

export type FlashDealInput = z.infer<typeof flashDealSchema>;
export type FlashDealProductInput = z.infer<typeof flashDealProductSchema>;

