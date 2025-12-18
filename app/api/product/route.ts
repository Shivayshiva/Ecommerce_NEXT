import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { productSchema, type ProductInput } from "@/lib/validations/product";

export async function GET() {
  try {
    await connectToDatabase();

    const products = await Product.find().sort({ updatedAt: -1 }).lean();

    return NextResponse.json(
      {
        success: true,
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching products." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    let data: ProductInput;
    try {
      data = productSchema.parse(json);
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

    const existingBySlug = await Product.findOne({ slug: data.slug });
    if (existingBySlug) {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 409 }
      );
    }

    const existingBySku = await Product.findOne({ sku: data.sku });
    if (existingBySku) {
      return NextResponse.json(
        { error: "A product with this SKU already exists." },
        { status: 409 }
      );
    }

    const product = await Product.create({
      ...data,
      slug: data.slug.toLowerCase().trim(),
    });

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Something went wrong while creating the product." },
      { status: 500 }
    );
  }
}

