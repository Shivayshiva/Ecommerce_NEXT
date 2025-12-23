import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { connectToDatabase } from "@/lib/db";
import FlashDeal from "@/models/FlashDeal";
import Product from "@/models/Product";
import { flashDealSchema, type FlashDealInput } from "@/lib/validations/flashDeal";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const dealType = searchParams.get("dealType");
    const createdBy = searchParams.get("createdBy");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const query = { deletedAt: null };

    if (status && status !== "all") {
      query.status = status;
    }
    if (dealType && dealType !== "all") {
      query.dealType = dealType;
    }
    if (createdBy) {
      query.createdBy = createdBy;
    }
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const flashDeals = await FlashDeal.find(query)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .populate("products.productId", "name sku images price mrp")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        flashDeals,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch flash deals error:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching flash deals." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    let data: FlashDealInput;
    try {
      data = flashDealSchema.parse(json);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: "Validation failed",
            issues: error.issues,
          },
          { status: 400 }
        );
      }
      throw error;
    }

    await connectToDatabase();

    // Validate products exist and are available
    const productIds = data.products.map((p) => p.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products not found." },
        { status: 404 }
      );
    }

    // Check for overlapping deals and stock availability
    for (const product of data.products) {
      const dbProduct = products.find((p) => p._id.toString() === product.productId);
      if (!dbProduct) continue;

      // Check stock availability
      if (dbProduct.stock < product.initialStock) {
        return NextResponse.json(
          {
            error: `Product ${dbProduct.name} doesn't have enough stock. Available: ${dbProduct.stock}, Required: ${product.initialStock}`,
          },
          { status: 400 }
        );
      }

      // Check for active flash deals
      if (dbProduct.flashDeal?.isActive) {
        return NextResponse.json(
          {
            error: `Product ${dbProduct.name} already has an active flash deal.`,
          },
          { status: 400 }
        );
      }

      // Check for overlapping deals
      const overlappingDeal = await FlashDeal.findOne({
        "products.productId": product.productId,
        status: { $in: ["scheduled", "active"] },
        $or: [
          {
            startDate: { $lte: data.endDate },
            endDate: { $gte: data.startDate },
          },
        ],
        deletedAt: null,
      });

      if (overlappingDeal) {
        return NextResponse.json(
          {
            error: `Product ${dbProduct.name} has an overlapping deal scheduled.`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate discount percentages if not provided
    const productsWithDiscounts = data.products.map((product) => {
      if (data.discountType === "percentage" && !product.discountPercent) {
        const discount = ((product.basePrice - product.dealPrice) / product.basePrice) * 100;
        return {
          ...product,
          discountPercent: Math.round(discount * 100) / 100,
        };
      }
      return product;
    });

    // TODO: Get current user from session/auth
    const createdBy = json.createdBy || "000000000000000000000000"; // Placeholder

    const flashDeal = await FlashDeal.create({
      ...data,
      products: productsWithDiscounts,
      createdBy,
      status: "scheduled",
    });

    // Update product flashDeal status
    for (const product of data.products) {
      await Product.findByIdAndUpdate(product.productId, {
        "flashDeal.isActive": true,
        "flashDeal.dealPrice": product.dealPrice,
        "flashDeal.discountPercent": productsWithDiscounts.find((p) => p.productId === product.productId)?.discountPercent,
        "flashDeal.startAt": data.startDate,
        "flashDeal.endAt": data.endDate,
        "flashDeal.maxQuantity": product.maxQuantityPerUser,
        "flashDeal.soldQuantity": 0,
        "flashDeal.priority": data.priority,
        "flashDeal.createdBy": createdBy,
      });
    }

    return NextResponse.json(
      {
        success: true,
        flashDeal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create flash deal error:", error);
    return NextResponse.json(
      { error: "Something went wrong while creating the flash deal." },
      { status: 500 }
    );
  }
}

