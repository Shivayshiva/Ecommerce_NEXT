import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";

type RouteContext = {
  params?: { id?: string };
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  // In App Router, `params` should be populated automatically from the folder `[id]`.
  // As a safety fallback (in case `params` is somehow undefined), also parse the id from the URL path.
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/").filter(Boolean); // e.g. ["api", "product", "my-slug"]
  const idFromPath = pathSegments[pathSegments.length - 1];

  const id = params?.id ?? idFromPath;

  if (!id || id === "product") {
    return NextResponse.json(
      { success: false, error: "Product id (slug) is required in the URL." },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const product = await Product.findOne({ slug: id }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch product detail error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while fetching product.",
      },
      { status: 500 }
    );
  }
}


