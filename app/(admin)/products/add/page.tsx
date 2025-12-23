"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

import { GlobalButton } from "@/components/ui/global-button";
import {
  GlobalCard,
  GlobalCardContent,
  GlobalCardDescription,
  GlobalCardHeader,
  GlobalCardTitle,
} from "@/components/ui/global-card";
import { GlobalFormField } from "@/components/ui/global-form-field";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { productSchema, type ProductInput } from "@/lib/validations/product";

// Common brands (you can expand this or load from API)
const brands = [
  "Nike",
  "Apple",
  "Samsung",
  "LG",
  "Dyson",
  "Sony",
  "Adidas",
  "Canon",
  "Bose",
  "Other",
];

export default function AddProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      brand: "",
      category: category || "",
      subcategory: subcategory || "",
      images: [],
      price: 0,
      mrp: 0,
      costPrice: 0,
      discountPercent: 0,
      rating: 0,
      ratingCount: 0,
      stock: 0,
      lowStockThreshold: 10,
      backorder: false,
      status: "draft",
      featured: false,
      bestseller: false,
      isNew: false,
      sponsored: false,
    },
  });

  useEffect(() => {
    if (!category) {
      router.push("/products/add/category");
    }
  }, [category, router]);

  // Auto-calculate discount from price and MRP
  const handlePriceChange = (field: "price" | "mrp", value: number) => {
    form.setValue(field, value);
    const price = form.getValues("price");
    const mrp = form.getValues("mrp");
    if (price > 0 && mrp > 0) {
      const discount = ((mrp - price) / mrp) * 100;
      form.setValue("discountPercent", Math.round(discount * 100) / 100);
    }
  };

  const onSubmit = async (data: ProductInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error ?? "Failed to create product");
      }

      // Redirect to products list after successful creation
      router.push("/products");
    } catch (error) {
      console.error("Error creating product:", error);
      // TODO: Show error toast/notification
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!category) return <div>Redirecting...</div>;

  return (
    <div className="container mx-auto max-w-5xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground mt-1">
            Add a new product to your catalog
          </p>
        </div>
        <Link href="/(admin)/products">
          <GlobalButton title="Cancel" variant="outline"/>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 1. Categories Section */}
          <GlobalCard>
            <GlobalCardHeader>
              <GlobalCardTitle>Categories</GlobalCardTitle>
              <GlobalCardDescription>Product categorization</GlobalCardDescription>
            </GlobalCardHeader>
            <GlobalCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlobalFormField
                  control={form.control}
                  name="category"
                  type="input"
                  label="Category"
                  placeholder=""
                  disabled
                  readOnly
                  description="Category selected from previous step"
                />

                <GlobalFormField
                  control={form.control}
                  name="subcategory"
                  type="input"
                  label="Subcategory"
                  placeholder="e.g., Sneakers, Smartphones"
                  disabled
                  readOnly
                  description="Subcategory selected from previous step"
                />
              </div>
            </GlobalCardContent>
          </GlobalCard>

          {/* 2. Basic Details */}
          <GlobalCard>
            <GlobalCardHeader>
              <GlobalCardTitle>Basic Details</GlobalCardTitle>
              <GlobalCardDescription>Essential product information</GlobalCardDescription>
            </GlobalCardHeader>
            <GlobalCardContent className="space-y-4">
              <GlobalFormField
                control={form.control}
                name="name"
                type="input"
                label="Product Name"
                placeholder="e.g., Nike Air Max 270"
                required
                description="The name of your product as it will appear to customers"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlobalFormField
                  control={form.control}
                  name="sku"
                  type="input"
                  label="SKU"
                  placeholder="NK-270-RED-42"
                  required
                  description="Stock Keeping Unit identifier"
                />

                <GlobalFormField
                  control={form.control}
                  name="brand"
                  type="select"
                  label="Brand"
                  placeholder="Select a brand"
                  required
                  options={brands.map((brand) => ({ value: brand, label: brand }))}
                  description="Product manufacturer or brand"
                />
              </div>
            </GlobalCardContent>
          </GlobalCard>

          {/* 3. Product Specific Details */}
          <GlobalCard>
            <GlobalCardHeader>
              <GlobalCardTitle>Product Specific Details</GlobalCardTitle>
              <GlobalCardDescription>Pricing, inventory, and ratings information</GlobalCardDescription>
            </GlobalCardHeader>
            <GlobalCardContent className="space-y-6">
              {/* Pricing Sub-section */}
              <div>
                <h4 className="text-lg font-medium mb-4">Pricing</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <GlobalFormField
                      control={form.control}
                      name="mrp"
                      type="input"
                      label="MRP (Maximum Retail Price)"
                      placeholder="159.00"
                      inputType="number"
                      step="0.01"
                      required
                      onChange={(value) => handlePriceChange("mrp", parseFloat(value) || 0)}
                    />

                    <GlobalFormField
                      control={form.control}
                      name="price"
                      type="input"
                      label="Selling Price"
                      placeholder="129.00"
                      inputType="number"
                      step="0.01"
                      required
                      onChange={(value) => handlePriceChange("price", parseFloat(value) || 0)}
                    />

                    <GlobalFormField
                      control={form.control}
                      name="discountPercent"
                      type="input"
                      label="Discount (%)"
                      placeholder="0"
                      inputType="number"
                      step="0.01"
                      readOnly
                      description="Auto-calculated from price and MRP"
                    />
                  </div>

                  <GlobalFormField
                    control={form.control}
                    name="costPrice"
                    type="input"
                    label="Cost Price"
                    placeholder="80.00"
                    inputType="number"
                    step="0.01"
                    required
                    description="The cost you paid for this product"
                  />
                </div>
              </div>

              <Separator />

              {/* Inventory Sub-section */}
              <div>
                <h4 className="text-lg font-medium mb-4">Inventory</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GlobalFormField
                      control={form.control}
                      name="stock"
                      type="input"
                      label="Stock Quantity"
                      placeholder="42"
                      inputType="number"
                      required
                      description="Current inventory count"
                    />

                    <GlobalFormField
                      control={form.control}
                      name="lowStockThreshold"
                      type="input"
                      label="Low Stock Threshold"
                      placeholder="10"
                      inputType="number"
                      required
                      description="Alert when stock falls below this number"
                    />
                  </div>

                  <GlobalFormField
                    control={form.control}
                    name="backorder"
                    type="switch"
                    label="Allow Backorder"
                    switchLabel="Allow Backorder"
                    description="Allow customers to purchase out-of-stock items"
                  />
                </div>
              </div>

              <Separator />

              {/* Ratings Sub-section */}
              <div>
                <h4 className="text-lg font-medium mb-4">Ratings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GlobalFormField
                    control={form.control}
                    name="rating"
                    type="input"
                    label="Rating"
                    placeholder="4.5"
                    inputType="number"
                    step="0.1"
                    min="0"
                    max="5"
                    description="Average rating (0-5)"
                  />

                  <GlobalFormField
                    control={form.control}
                    name="ratingCount"
                    type="input"
                    label="Rating Count"
                    placeholder="101"
                    inputType="number"
                    description="Number of customer ratings"
                  />
                </div>
              </div>
            </GlobalCardContent>
          </GlobalCard>

          {/* 4. Image Upload Section */}
          <GlobalCard>
            <GlobalCardHeader>
              <GlobalCardTitle>Product Images</GlobalCardTitle>
              <GlobalCardDescription>Upload product images</GlobalCardDescription>
            </GlobalCardHeader>
            <GlobalCardContent>
              <GlobalFormField
                control={form.control}
                name="images"
                type="image"
                label="Product Images"
                required
                description="Upload one or more product images. Supported formats: PNG, JPG, GIF"
              />
            </GlobalCardContent>
          </GlobalCard>

          {/* 6. Advance Section */}
          <GlobalCard>
            <GlobalCardHeader>
              <GlobalCardTitle>Advanced Settings</GlobalCardTitle>
              <GlobalCardDescription>Product visibility and special attributes</GlobalCardDescription>
            </GlobalCardHeader>
            <GlobalCardContent className="space-y-4">
              <GlobalFormField
                control={form.control}
                name="status"
                type="select"
                label="Status"
                placeholder="Select a status"
                required
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
                description="Draft: Not visible to customers | Active: Visible and available | Inactive: Hidden from customers"
              />

              <Separator />

              <div className="space-y-4">
                <GlobalFormField
                  control={form.control}
                  name="featured"
                  type="switch"
                  label="Featured Product"
                  switchLabel="Featured Product"
                  description="Highlight this product as featured"
                />

                <GlobalFormField
                  control={form.control}
                  name="bestseller"
                  type="switch"
                  label="Bestseller"
                  switchLabel="Bestseller"
                  description="Mark as a best-selling product"
                />

                <GlobalFormField
                  control={form.control}
                  name="isNew"
                  type="switch"
                  label="New Product"
                  switchLabel="New Product"
                  description="Show &quot;NEW&quot; badge on product"
                />

                <GlobalFormField
                  control={form.control}
                  name="sponsored"
                  type="switch"
                  label="Sponsored"
                  switchLabel="Sponsored"
                  description="Mark as sponsored/advertised product"
                />
              </div>
            </GlobalCardContent>
          </GlobalCard>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href="/(admin)/products">
              <GlobalButton title="Cancel" type="button" variant="outline"/>
            </Link>
            <GlobalButton title={isSubmitting ? "Creating..." : "Create Product"} type="submit" disabled={isSubmitting}/>
          </div>
        </form>
      </Form>
    </div>
  );
}
