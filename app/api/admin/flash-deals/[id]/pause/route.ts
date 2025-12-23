import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import FlashDeal from "@/models/FlashDeal";
import Product from "@/models/Product";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

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

    if (flashDeal.status !== "active") {
      return NextResponse.json(
        { error: "Can only pause active deals." },
        { status: 400 }
      );
    }

    const json = await request.json();
    // TODO: Get current user from session/auth
    const pausedBy = json.pausedBy || "000000000000000000000000";

    await FlashDeal.findByIdAndUpdate(params.id, {
      status: "paused",
      pausedBy,
      pausedAt: new Date(),
    });

    // Update product flash deal status
    const productIds = flashDeal.products.map((p: any) => p.productId);
    await Product.updateMany(
      { _id: { $in: productIds } },
      {
        "flashDeal.isActive": false,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Flash deal paused successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Pause flash deal error:", error);
    return NextResponse.json(
      { error: "Something went wrong while pausing the flash deal." },
      { status: 500 }
    );
  }
}

