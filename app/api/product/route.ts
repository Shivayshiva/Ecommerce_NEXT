import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { generateSlug } from "@/lib/slug";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const brand = searchParams.get("brand");
    const status = searchParams.get("status") || "active";
    const featured = searchParams.get("featured");
    const bestseller = searchParams.get("bestseller");
    const isNew = searchParams.get("isNew");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    // Build query
    const query: any = {};
console.log("DFDFDFDFDFDF___DFWWWWWW", category, subcategory, brand, status, featured, bestseller, isNew, minPrice, maxPrice);
    if (category) {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    if (brand) {
      query.brand = brand;
    }

    if (status) {
      query.status = status;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (bestseller === "true") {
      query.bestseller = true;
    }

    if (isNew === "true") {
      query.isNew = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    console.log("Products fetched:", products.length, "Total:", total);

    return NextResponse.json(
      {
        success: true,
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
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

    const slug = generateSlug(data.name);

    const existingBySlug = await Product.findOne({ slug });
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
      slug,
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

