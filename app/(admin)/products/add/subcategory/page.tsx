"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlobalButton } from "@/components/ui/global-button";

const subcategories: Record<string, { id: string; name: string; description: string }[]> = {
  electronics: [
    { id: "smartphones", name: "Smartphones", description: "Mobile phones and accessories" },
    { id: "laptops", name: "Laptops", description: "Computers and notebooks" },
    { id: "accessories", name: "Accessories", description: "Chargers, cases, and more" },
  ],
  clothing: [
    { id: "mens", name: "Men's Clothing", description: "Shirts, pants, and jackets" },
    { id: "womens", name: "Women's Clothing", description: "Dresses, tops, and skirts" },
    { id: "kids", name: "Kids' Clothing", description: "Clothing for children" },
  ],
  home: [
    { id: "furniture", name: "Furniture", description: "Chairs, tables, and beds" },
    { id: "decor", name: "Home Decor", description: "Art, lamps, and cushions" },
    { id: "kitchen", name: "Kitchen", description: "Appliances and utensils" },
  ],
  sports: [
    { id: "equipment", name: "Sports Equipment", description: "Balls, rackets, and gear" },
    { id: "apparel", name: "Sports Apparel", description: "Clothing and shoes" },
    { id: "outdoor", name: "Outdoor Gear", description: "Tents, backpacks, and more" },
  ],
  books: [
    { id: "fiction", name: "Fiction", description: "Novels and stories" },
    { id: "nonfiction", name: "Non-Fiction", description: "Biographies and educational" },
    { id: "children", name: "Children's Books", description: "Books for kids" },
  ],
  beauty: [
    { id: "skincare", name: "Skincare", description: "Creams, serums, and masks" },
    { id: "makeup", name: "Makeup", description: "Foundation, lipstick, and eyeshadow" },
    { id: "haircare", name: "Hair Care", description: "Shampoos, conditioners, and treatments" },
  ],
};

export default function SubcategorySelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const subs = useMemo(() => {
    if (category && subcategories[category]) {
      return subcategories[category];
    }
    return [];
  }, [category]);

  useEffect(() => {
    if (!category || !subcategories[category]) {
      router.push("/products/add/category"); // Redirect if invalid
    }
  }, [category, router]);

  const handleSubcategorySelect = (subId: string) => {
    // Navigate to the actual add product page with category and subcategory
    router.push(`/products/add?category=${category}&subcategory=${subId}`);
  };

  if (!category) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Select a Subcategory for {category.charAt(0).toUpperCase() + category.slice(1)}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subs.map((sub) => (
            <Card key={sub.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{sub.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{sub.description}</p>
                <GlobalButton
                  onClick={() => handleSubcategorySelect(sub.id)}
                  className="w-full"
                  title="Select"
                />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <GlobalButton  title="Back to Categories" variant="outline" onClick={() => router.back()}/>
            Back to Categories
        </div>
      </div>
    </div>
  );
}