import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { z } from "zod";

const wishlistSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  action: z.enum(["add", "remove"], {
    required_error: "Action must be either 'add' or 'remove'",
  }),
});

export async function PUT(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const json = await request.json();

    // Validate the request body
    const { productId, action } = wishlistSchema.parse(json);
    console.log("Received wishlist request:", { productId, action, userId: session.user.id });

    // Convert productId to ObjectId
    let productObjectId;
    try {
      productObjectId = new mongoose.Types.ObjectId(productId);
      console.log("Converted productId to ObjectId:", productObjectId);
    } catch (error) {
      console.error("Invalid productId format:", productId);
      return NextResponse.json(
        { success: false, error: "Invalid product ID format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Convert userId to ObjectId
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(session.user.id);
      console.log("Session user ID:", session.user.id);
      console.log("Converted user ObjectId:", userObjectId);
    } catch (error) {
      console.error("Invalid userId format:", session.user.id);
      return NextResponse.json(
        { success: false, error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const userId = userObjectId;

    // First, check if user exists
    const existingUser = await User.findById(userId);
    console.log("Existing user found:", !!existingUser);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    if (action === "add") {
      // Add product to wishlist if not already present
      console.log("Adding to wishlist:", { userId, productObjectId });
      const result = await User.updateOne(
        { _id: userId },
        {
          $addToSet: {
            wishlist: {
              productId: productObjectId,
              addedAt: new Date(),
            },
          },
        }
      );
      console.log("Add result:", result);

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Product added to wishlist",
          action: "added",
          result: result,
        },
        { status: 200 }
      );
    } else if (action === "remove") {
      // Remove product from wishlist
      console.log("Removing from wishlist:", { userId, productObjectId });
      const result = await User.updateOne(
        { _id: userId },
        {
          $pull: {
            wishlist: { productId: productObjectId },
          },
        }
      );
      console.log("Remove result:", result);

      return NextResponse.json(
        {
          success: true,
          message: "Product removed from wishlist",
          action: "removed",
          result: result,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Wishlist update error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          issues: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while updating wishlist",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Convert userId to ObjectId
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(session.user.id);
      console.log("GET - Session user ID:", session.user.id);
      console.log("GET - Converted user ObjectId:", userObjectId);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const userId = userObjectId;

    // First, check if user exists
    const existingUser = await User.findById(userId);
    console.log("GET - Existing user found:", !!existingUser);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    // Get user's wishlist
    const user = await User.findById(userId).select("wishlist");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get product details for wishlist items
    const productIds = user?.wishlist?.map((item: any) => item.productId);
    const products = await Product.find({
      _id: { $in: productIds }
    }).select("name price images brand slug");

    // Create a map of products for easy lookup
    const productMap = products.reduce((map: any, product: any) => {
      map[product._id.toString()] = product;
      return map;
    }, {});

    // Combine wishlist with product details
    const wishlistWithProducts = user.wishlist.map((item: any) => ({
      ...item.toObject(),
      product: productMap[item.productId.toString()] || null,
    }));

    return NextResponse.json(
      {
        success: true,
        wishlist: wishlistWithProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get wishlist error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while fetching wishlist",
      },
      { status: 500 }
    );
  }
}