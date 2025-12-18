"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  value?: string;
}

export default function ImageUpload({ onUpload, value }: ImageUploadProps) {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!uploadPreset) {
    console.error("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set");
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative group">
          <div className="relative w-full h-48 border-2 border-dashed border-border rounded-lg overflow-hidden bg-muted">
            <Image
              src={value}
              alt="Product preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onUpload("")}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Remove Image
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset={uploadPreset || ""}
          options={{
            folder: "products",
            maxFiles: 1,
            sources: ["local", "camera"],
          }}
          onSuccess={(result) => {
            if (result && typeof result.info === 'object' && result.info !== null && 'secure_url' in result.info) {
              onUpload(result.info.secure_url as string);
            }
          }}
          onError={(error) => {
            console.error("Upload error:", error);
          }}
        >
          {({ open }: { open: () => void }) => (
            <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
              onClick={() => open()}
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground mb-1">
                Click to upload an image
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
