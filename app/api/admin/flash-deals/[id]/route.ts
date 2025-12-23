import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { connectToDatabase } from "@/lib/db";
import FlashDeal from "@/models/FlashDeal";
import Product from "@/models/Product";
import { flashDealSchema, type FlashDealInput } from "@/lib/validations/flashDeal";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const flashDeal = await FlashDeal.findOne({
      _id: params.id,
      deletedAt: null,
    })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .populate("pausedBy", "name email")
      .populate("endedBy", "name email")
      .populate("products.productId")
      .lean();

    if (!flashDeal) {
      return NextResponse.json(
        { error: "Flash deal not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        flashDeal,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch flash deal error:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching the flash deal." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const flashDeal = await FlashDeal.findOne({
      _id: params.id,
      deletedAt: null,
    });

    if (!flashDeal) {
      return NextResponse.json(
        { error: "Flash deal not found." },
        { status: 404 }
      );
    }

    // Only allow editing if deal is scheduled
    if (flashDeal.status !== "scheduled") {
      return NextResponse.json(
        { error: "Can only edit scheduled deals." },
        { status: 400 }
      );
    }

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

    // Validate products
    const productIds = data.products.map((p) => p.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products not found." },
        { status: 404 }
      );
    }

    // Calculate discount percentages if needed
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
    const updatedBy = json.updatedBy || "000000000000000000000000";

    // Remove old product flash deal references
    const oldProductIds = flashDeal.products.map((p: any) => p.productId.toString());
    await Product.updateMany(
      { _id: { $in: oldProductIds } },
      {
        $unset: { flashDeal: "" },
      }
    );

    // Update flash deal
    const updatedFlashDeal = await FlashDeal.findByIdAndUpdate(
      params.id,
      {
        ...data,
        products: productsWithDiscounts,
        updatedBy,
      },
      { new: true }
    );

    // Update new product flash deal references
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
        "flashDeal.createdBy": updatedBy,
      });
    }

    return NextResponse.json(
      {
        success: true,
        flashDeal: updatedFlashDeal,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update flash deal error:", error);
    return NextResponse.json(
      { error: "Something went wrong while updating the flash deal." },
      { status: 500 }
    );
  }
}

