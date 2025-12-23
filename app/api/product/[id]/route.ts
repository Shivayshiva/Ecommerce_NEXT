import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { type ProductInput } from "@/lib/validations/product";
import { generateSlug } from "@/lib/slug";

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

export async function PATCH(request: NextRequest, { params }: RouteContext) {
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
    const json = await request.json();

    // For PATCH, we allow partial updates - only provided fields will be updated
    // Create a base schema without refinements for partial updates
    const baseProductSchema = z.object({
      name: z
        .string()
        .min(1, "Product name is required")
        .min(3, "Product name must be at least 3 characters"),
      sku: z.string().min(1, "SKU is required"),
      brand: z.string().min(1, "Brand is required"),
      category: z.string().min(1, "Category is required"),
      subcategory: z.string().optional(),
      images: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image is required"),
      price: z.coerce.number().positive("Price must be greater than 0"),
      mrp: z.coerce.number().positive("MRP must be greater than 0"),
      costPrice: z.coerce.number().positive("Cost price must be greater than 0"),
      discountPercent: z
        .coerce.number()
        .min(0, "Discount must be 0 or greater")
        .max(100, "Discount cannot exceed 100%"),
      rating: z
        .coerce.number()
        .min(0, "Rating must be 0 or greater")
        .max(5, "Rating cannot exceed 5")
        .default(0),
      ratingCount: z.coerce.number().min(0, "Rating count must be 0 or greater").default(0),
      stock: z
        .coerce.number()
        .min(0, "Stock must be 0 or greater")
        .int("Stock must be a whole number"),
      lowStockThreshold: z
        .coerce.number()
        .min(0, "Low stock threshold must be 0 or greater")
        .int("Threshold must be a whole number"),
      backorder: z.boolean().default(false),
      status: z.enum(["active", "draft", "inactive"], {
        required_error: "Please select a status",
      }),
      featured: z.boolean().default(false),
      bestseller: z.boolean().default(false),
      isNew: z.boolean().default(false),
      sponsored: z.boolean().default(false),
    });

    const updateSchema = baseProductSchema.partial();
    let data: Partial<ProductInput & { slug?: string }>;

    try {
      data = updateSchema.parse(json);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            issues: error.issues,
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // Check if there's at least one field to update
    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one field must be provided for update" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // First, verify the product exists
    const existingProduct = await Product.findOne({ slug: id });
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // If name is being updated, generate a new slug
    if (data.name && data.name !== existingProduct.name) {
      const newSlug = generateSlug(data.name);

      // Check if the new slug conflicts with another product
      const slugConflict = await Product.findOne({
        slug: newSlug,
        _id: { $ne: existingProduct._id }
      });

      if (slugConflict) {
        return NextResponse.json(
          { success: false, error: "A product with this name already exists." },
          { status: 409 }
        );
      }

      data.slug = newSlug;
    }

    // If SKU is being updated, check for conflicts
    if (data.sku && data.sku !== existingProduct.sku) {
      const skuConflict = await Product.findOne({
        sku: data.sku,
        _id: { $ne: existingProduct._id }
      });

      if (skuConflict) {
        return NextResponse.json(
          { success: false, error: "A product with this SKU already exists." },
          { status: 409 }
        );
      }
    }

    // Update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: id },
      { ...data, updatedAt: new Date() },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    ).lean();

    return NextResponse.json(
      {
        success: true,
        product: updatedProduct,
        message: "Product updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH product error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while updating the product.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
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

    // Find and delete the product
    const deletedProduct = await Product.findOneAndDelete({ slug: id }).lean();

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product: deletedProduct,
        message: "Product deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while deleting the product.",
      },
      { status: 500 }
    );
  }
}


