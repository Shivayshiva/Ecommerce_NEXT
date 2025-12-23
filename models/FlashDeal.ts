import mongoose, { Schema, models } from "mongoose";

export interface IFlashDeal {
  _id: mongoose.Types.ObjectId;
  title: string;
  dealType: "flash-deal" | "lightning-deal";
  discountType: "flat-price" | "percentage";
  products: Array<{
    productId: mongoose.Types.ObjectId;
    basePrice: number;
    dealPrice: number;
    discountPercent?: number;
    dealQuantity: number;
    initialStock: number;
    soldQuantity: number;
    maxQuantityPerUser: number;
    minOrderQuantity: number;
  }>;
  startDate: Date;
  endDate: Date;
  status: "scheduled" | "active" | "ended" | "paused";
  showOnHomepage: boolean;
  priority: number;
  badgeText?: string;
  showCountdown: boolean;
  eligibleSections: Array<"homepage" | "category" | "search">;
  maxOrdersPerUser: number;
  paymentMethodRestrictions?: string[];
  geoRestrictions?: string[];
  enableCaptcha: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  pausedBy?: mongoose.Types.ObjectId;
  endedBy?: mongoose.Types.ObjectId;
  pausedAt?: Date;
  endedAt?: Date;
  deletedAt?: Date;
  // Performance metrics
  totalRevenue: number;
  totalUnitsSold: number;
  averageOrderValue: number;
  conversionRate: number;
}

const FlashDealSchema = new Schema<IFlashDeal>(
  {
    title: { type: String, required: true, trim: true },
    dealType: {
      type: String,
      enum: ["flash-deal", "lightning-deal"],
      required: true,
    },
    discountType: {
      type: String,
      enum: ["flat-price", "percentage"],
      required: true,
    },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        basePrice: { type: Number, required: true, min: 0 },
        dealPrice: { type: Number, required: true, min: 0 },
        discountPercent: { type: Number, min: 0, max: 100 },
        dealQuantity: { type: Number, required: true, min: 1 },
        initialStock: { type: Number, required: true, min: 1 },
        soldQuantity: { type: Number, default: 0, min: 0 },
        maxQuantityPerUser: { type: Number, required: true, min: 1 },
        minOrderQuantity: { type: Number, default: 1, min: 1 },
      },
    ],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["scheduled", "active", "ended", "paused"],
      default: "scheduled",
    },
    showOnHomepage: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
    badgeText: { type: String, trim: true },
    showCountdown: { type: Boolean, default: true },
    eligibleSections: [
      {
        type: String,
        enum: ["homepage", "category", "search"],
      },
    ],
    maxOrdersPerUser: { type: Number, default: 1, min: 1 },
    paymentMethodRestrictions: [{ type: String }],
    geoRestrictions: [{ type: String }],
    enableCaptcha: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    pausedBy: { type: Schema.Types.ObjectId, ref: "User" },
    endedBy: { type: Schema.Types.ObjectId, ref: "User" },
    pausedAt: { type: Date },
    endedAt: { type: Date },
    deletedAt: { type: Date },
    totalRevenue: { type: Number, default: 0 },
    totalUnitsSold: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes
FlashDealSchema.index({ status: 1 });
FlashDealSchema.index({ startDate: 1, endDate: 1 });
FlashDealSchema.index({ "products.productId": 1 });
FlashDealSchema.index({ deletedAt: 1 });
FlashDealSchema.index({ createdAt: -1 });

const FlashDeal = models.FlashDeal || mongoose.model<IFlashDeal>("FlashDeal", FlashDealSchema);

export default FlashDeal;

