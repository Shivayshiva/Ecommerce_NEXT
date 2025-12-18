import mongoose, { Schema, models } from "mongoose";

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  subcategory?: string;
  images: string[];
  price: number;
  mrp: number;
  costPrice: number;
  discountPercent: number;
  rating: number;
  ratingCount: number;
  stock: number;
  lowStockThreshold: number;
  backorder: boolean;
  status: "active" | "draft" | "inactive";
  featured: boolean;
  bestseller: boolean;
  isNew: boolean;
  sponsored: boolean;
  flashDeal?: {
    isActive: boolean;
    dealPrice?: number;
    discountPercent?: number;
    startAt?: Date;
    endAt?: Date;
    maxQuantity?: number;
    soldQuantity: number;
    priority: number;
    createdBy?: mongoose.Types.ObjectId;
  };
  trending?: {
    isTrending: boolean;
    score: number;
    reason?:
      | "HIGH_SALES"
      | "HIGH_VIEWS"
      | "HIGH_CONVERSION"
      | "MANUAL"
      | "FLASH_DEAL";
    validTill?: Date;
    priority: number;
  };
  salesMetrics?: {
    views: number;
    addToCart: number;
    orders: number;
    last7DaysOrders: number;
    last30DaysOrders: number;
    conversionRate: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, trim: true },
    images: [{ type: String, required: true }],
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, required: true, min: 0, max: 100 },
    rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
    ratingCount: { type: Number, required: true, min: 0, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, required: true, min: 0, default: 0 },
    backorder: { type: Boolean, required: true, default: false },
    status: {
      type: String,
      enum: ["active", "draft", "inactive"],
      required: true,
      default: "draft",
    },
    featured: { type: Boolean, required: true, default: false },
    bestseller: { type: Boolean, required: true, default: false },
    isNew: { type: Boolean, required: true, default: false },
    sponsored: { type: Boolean, required: true, default: false },
    flashDeal: {
      isActive: { type: Boolean, default: false },
      dealPrice: { type: Number },
      discountPercent: { type: Number },
      startAt: { type: Date },
      endAt: { type: Date },
      maxQuantity: { type: Number },
      soldQuantity: { type: Number, default: 0 },
      priority: { type: Number, default: 0 },
      createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    trending: {
      isTrending: { type: Boolean, default: false },
      score: { type: Number, default: 0 },
      reason: {
        type: String,
        enum: ["HIGH_SALES", "HIGH_VIEWS", "HIGH_CONVERSION", "MANUAL", "FLASH_DEAL"],
      },
      validTill: { type: Date },
      priority: { type: Number, default: 0 },
    },
    salesMetrics: {
      views: { type: Number, default: 0 },
      addToCart: { type: Number, default: 0 },
      orders: { type: Number, default: 0 },
      last7DaysOrders: { type: Number, default: 0 },
      last30DaysOrders: { type: Number, default: 0 },
      conversionRate: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ sku: 1 }, { unique: true });

const Product = models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;


