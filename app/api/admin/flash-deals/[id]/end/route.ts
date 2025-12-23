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

    if (flashDeal.status === "ended") {
      return NextResponse.json(
        { error: "Deal is already ended." },
        { status: 400 }
      );
    }

    const json = await request.json();
    // TODO: Get current user from session/auth
    const endedBy = json.endedBy || "000000000000000000000000";

    await FlashDeal.findByIdAndUpdate(params.id, {
      status: "ended",
      endedBy,
      endedAt: new Date(),
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
        message: "Flash deal ended successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("End flash deal error:", error);
    return NextResponse.json(
      { error: "Something went wrong while ending the flash deal." },
      { status: 500 }
    );
  }
}

