"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Search, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { flashDealSchema, type FlashDealInput, type FlashDealProductInput } from "@/lib/validations/flashDeal";

type Product = {
  _id: string;
  name: string;
  sku: string;
  price: number;
  mrp: number;
  stock: number;
  images: string[];
  category: string;
  brand: string;
  flashDeal?: {
    isActive: boolean;
  };
};

export default function CreateFlashDealPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedProducts, setSelectedProducts] = useState<Map<string, Product>>(new Map());
  const [previewData, setPreviewData] = useState<{
    totalRevenue: number;
    totalDiscount: number;
    marginWarning: boolean;
  } | null>(null);

  const form = useForm<FlashDealInput>({
    resolver: zodResolver(flashDealSchema),
    defaultValues: {
      title: "",
      dealType: "flash-deal",
      discountType: "flat-price",
      products: [],
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to 24 hours from now
      showOnHomepage: false,
      priority: 0,
      badgeText: "",
      showCountdown: true,
      eligibleSections: ["homepage"],
      maxOrdersPerUser: 1,
      paymentMethodRestrictions: [],
      geoRestrictions: [],
      enableCaptcha: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (product.stock === 0) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !product.name.toLowerCase().includes(query) &&
        !product.sku.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }

    if (selectedBrand !== "all" && product.brand !== selectedBrand) {
      return false;
    }

    if (priceRange.min && product.price < parseFloat(priceRange.min)) {
      return false;
    }

    if (priceRange.max && product.price > parseFloat(priceRange.max)) {
      return false;
    }

    // Check if product already has active flash deal
    if (product.flashDeal?.isActive) {
      return false;
    }

    return true;
  });

  const categories = Array.from(new Set(products.map((p) => p.category))).sort();
  const brands = Array.from(new Set(products.map((p) => p.brand))).sort();

  const handleAddProduct = (product: Product) => {
    if (selectedProducts.has(product._id)) return;

    const newProduct: FlashDealProductInput = {
      productId: product._id,
      basePrice: product.price,
      dealPrice: product.price * 0.9, // Default 10% discount
      discountPercent: 10,
      dealQuantity: 1,
      initialStock: Math.min(product.stock, 100),
      maxQuantityPerUser: 1,
      minOrderQuantity: 1,
    };

    append(newProduct);
    setSelectedProducts(new Map(selectedProducts).set(product._id, product));
  };

  const handleRemoveProduct = (index: number) => {
    const product = form.getValues(`products.${index}`);
    if (product) {
      const newSelected = new Map(selectedProducts);
      newSelected.delete(product.productId);
      setSelectedProducts(newSelected);
    }
    remove(index);
  };

  // Calculate preview data
  const watchedProducts = form.watch("products");
  const watchedDiscountType = form.watch("discountType");

  useEffect(() => {
    if (watchedProducts.length === 0) {
      setPreviewData(null);
      return;
    }

    let totalRevenue = 0;
    let totalOriginalValue = 0;

    watchedProducts.forEach((product) => {
      const revenue = product.dealPrice * product.initialStock;
      const originalValue = product.basePrice * product.initialStock;
      totalRevenue += revenue;
      totalOriginalValue += originalValue;
    });

    const totalDiscount = totalOriginalValue - totalRevenue;
    const discountPercent = (totalDiscount / totalOriginalValue) * 100;

    // Margin warning if discount > 50%
    const marginWarning = discountPercent > 50;

    setPreviewData({
      totalRevenue,
      totalDiscount,
      marginWarning,
    });
  }, [watchedProducts, watchedDiscountType]);

  const onSubmit = async (data: FlashDealInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/flash-deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error ?? "Failed to create flash deal");
      }

      router.push("/(admin)/flashDeals");
    } catch (error) {
      console.error("Error creating flash deal:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create flash deal";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  // Calculate duration
  const duration =
    startDate && endDate
      ? Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60))
      : 0;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Flash Deal</h1>
          <p className="text-muted-foreground mt-1">
            Create a new flash deal with multiple products
          </p>
        </div>
        <Link href="/(admin)/flashDeals">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Deal Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Deal Configuration</CardTitle>
              <CardDescription>Basic deal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Summer Sale Flash Deal" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive title for this flash deal
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dealType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deal Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select deal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="flash-deal">Flash Deal</SelectItem>
                          <SelectItem value="lightning-deal">Lightning Deal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select discount type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="flat-price">Flat Price</SelectItem>
                          <SelectItem value="percentage">Percentage Discount</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Product Selection</CardTitle>
              <CardDescription>Select products for this flash deal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min Price"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Max Price"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Product List */}
              <div className="max-h-64 overflow-y-auto border rounded-lg p-2 space-y-2">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No products found matching your criteria.
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleAddProduct(product)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {product.sku} • Price: ₹{product.price} • Stock: {product.stock}
                        </div>
                      </div>
                      {selectedProducts.has(product._id) && (
                        <Badge variant="secondary">Selected</Badge>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Selected Products */}
              {fields.length > 0 && (
                <div className="space-y-4">
                  <Separator />
                  <div className="text-sm font-medium">Selected Products ({fields.length})</div>
                  {fields.map((field, index) => {
                    const product = selectedProducts.get(form.getValues(`products.${index}.productId`));
                    return (
                      <Card key={field.id} className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="font-medium">{product?.name || "Product"}</div>
                            <div className="text-sm text-muted-foreground">
                              SKU: {product?.sku} • Base Price: ₹{form.watch(`products.${index}.basePrice`)}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProduct(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`products.${index}.dealPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Deal Price *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(e) => {
                                      const value = parseFloat(e.target.value) || 0;
                                      field.onChange(value);
                                      const basePrice = form.getValues(`products.${index}.basePrice`);
                                      if (basePrice > 0 && watchedDiscountType === "percentage") {
                                        const discount = ((basePrice - value) / basePrice) * 100;
                                        form.setValue(`products.${index}.discountPercent`, Math.round(discount * 100) / 100);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {watchedDiscountType === "percentage" && (
                            <FormField
                              control={form.control}
                              name={`products.${index}.discountPercent`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Discount %</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.01" {...field} readOnly />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          <FormField
                            control={form.control}
                            name={`products.${index}.initialStock`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Initial Deal Stock *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    max={product?.stock}
                                    {...field}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value) || 0;
                                      field.onChange(value);
                                    }}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Max available: {product?.stock || 0}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`products.${index}.dealQuantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Deal Quantity *</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`products.${index}.maxQuantityPerUser`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Max Quantity Per User *</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`products.${index}.minOrderQuantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Min Order Quantity *</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Time Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle>Time Scheduling</CardTitle>
              <CardDescription>Set deal start and end times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date & Time *</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={
                            field.value
                              ? new Date(field.value).toISOString().slice(0, 16)
                              : ""
                          }
                          onChange={(e) => {
                            field.onChange(new Date(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date & Time *</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={
                            field.value
                              ? new Date(field.value).toISOString().slice(0, 16)
                              : ""
                          }
                          onChange={(e) => {
                            field.onChange(new Date(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {duration > 0 && (
                <div className="text-sm text-muted-foreground">
                  Deal Duration: {Math.floor(duration / 60)} hours {duration % 60} minutes
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visibility & Placement */}
          <Card>
            <CardHeader>
              <CardTitle>Visibility & Placement</CardTitle>
              <CardDescription>Control where and how the deal appears</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="showOnHomepage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show on Homepage</FormLabel>
                      <FormDescription>
                        Display this deal on the homepage
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deal Priority</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Higher priority deals appear first (0 = lowest)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="badgeText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badge Text</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Limited Time, Hot Deal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="showCountdown"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show Countdown Timer</FormLabel>
                      <FormDescription>
                        Display a countdown timer for this deal
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eligibleSections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eligible Sections *</FormLabel>
                    <div className="space-y-2">
                      {(["homepage", "category", "search"] as const).map((section) => (
                        <div key={section} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={field.value?.includes(section)}
                            onChange={(e) => {
                              const current = field.value || [];
                              if (e.target.checked) {
                                field.onChange([...current, section]);
                              } else {
                                field.onChange(current.filter((s) => s !== section));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <label className="text-sm font-medium capitalize">
                            {section}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Safety & Limits */}
          <Card>
            <CardHeader>
              <CardTitle>Safety & Limits</CardTitle>
              <CardDescription>Set restrictions and safety measures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="maxOrdersPerUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Orders Per User *</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum number of orders a single user can place
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enableCaptcha"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable CAPTCHA</FormLabel>
                      <FormDescription>
                        Require CAPTCHA verification for high-traffic deals
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Review & Confirmation */}
          {previewData && (
            <Card>
              <CardHeader>
                <CardTitle>Deal Preview</CardTitle>
                <CardDescription>Review before publishing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Expected Revenue</div>
                    <div className="text-2xl font-bold">₹{previewData.totalRevenue.toFixed(2)}</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Discount</div>
                    <div className="text-2xl font-bold">₹{previewData.totalDiscount.toFixed(2)}</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Discount %</div>
                    <div className="text-2xl font-bold">
                      {((previewData.totalDiscount / (previewData.totalRevenue + previewData.totalDiscount)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {previewData.marginWarning && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Margin Warning</AlertTitle>
                    <AlertDescription>
                      The discount percentage exceeds 50%. Please review the deal pricing carefully.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href="/(admin)/flashDeals">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Flash Deal"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

