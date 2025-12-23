"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlobalButton } from "@/components/ui/global-button";

const categories = [
  { id: "electronics", name: "Electronics", description: "Phones, laptops, and gadgets" },
  { id: "clothing", name: "Clothing", description: "Men's, women's, and kids wear" },
  { id: "home", name: "Home & Garden", description: "Furniture, decor, and appliances" },
  { id: "sports", name: "Sports & Outdoors", description: "Equipment and accessories" },
  { id: "books", name: "Books & Media", description: "Books, movies, and music" },
  { id: "beauty", name: "Beauty & Personal Care", description: "Cosmetics and health products" },
];

export default function CategorySelectionPage() {
  const router = useRouter();

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/products/add/subcategory?category=${categoryId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Select a Category</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <GlobalButton
                  title="Select"
                  onClick={() => handleCategorySelect(category.id)}
                  className="w-full"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}