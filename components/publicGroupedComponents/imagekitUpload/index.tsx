"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadImageKitProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploadImageKit({
  value,
  onChange,
}: ImageUploadImageKitProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadSingle = async (file: File): Promise<string> => {
    const authRes = await fetch("/api/imagekit-auth");
    const auth = await authRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("publicKey", auth.publicKey);
    formData.append("signature", auth.signature);
    formData.append("expire", auth.expire);
    formData.append("token", auth.token);
    formData.append("folder", "/products");

    const uploadRes = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await uploadRes.json();
    return data.url as string;
  };

  const handleFiles = async (files: FileList) => {
    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      const urls = await Promise.all(fileArray.map(uploadSingle));
      onChange([...value, ...urls]);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (url: string) => {
    onChange(value.filter((img) => img !== url));
  };

  console.log("url___url", )

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url) => (
            <div key={url} className="relative group">
              <div className="relative w-full aspect-square border border-border rounded-lg overflow-hidden bg-muted">
                <Image
                  src={url}
                  alt="Product preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(url)}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              void handleFiles(files);
              e.target.value = "";
            }
          }}
        />
        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm font-medium text-foreground mb-1">
          {isUploading ? "Uploading..." : "Click to upload images"}
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, GIF up to 10MB each
        </p>
      </div>
    </div>
  );
}
