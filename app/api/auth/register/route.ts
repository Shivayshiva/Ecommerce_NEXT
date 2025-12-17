import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password should be at least 6 characters." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const errorMessage =
        existingUser.provider === "google"
          ? "User already exists. Please continue with Google."
          : "User already exists.";
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);

    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      provider: "credentials",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

