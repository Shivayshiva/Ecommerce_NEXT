import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const { file } = await req.json(); // base64 or URL

  const uploadResponse = await cloudinary.uploader.upload(file, {
    folder: "products",
  });

  return NextResponse.json({
    url: uploadResponse.secure_url,
    public_id: uploadResponse.public_id,
  });
}
