import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X, Filter, Star } from "lucide-react";

interface FilterPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  onApplyFilters?: (filters: FilterState) => void;
  categories?: Category[];
}

interface Category {
  id: string;
  name: string;
  count?: number;
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  ratings: number[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen = true,
  onClose = () => {},
  onApplyFilters = () => {},
  categories = [
    { id: "electronics", name: "Electronics", count: 42 },
    { id: "clothing", name: "Clothing", count: 56 },
    { id: "home", name: "Home & Kitchen", count: 38 },
    { id: "books", name: "Books", count: 24 },
    { id: "beauty", name: "Beauty & Personal Care", count: 31 },
    { id: "sports", name: "Sports & Outdoors", count: 19 },
  ],
}) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000],
    ratings: [],
  });

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categoryId]
        : prev.categories.filter((id) => id !== categoryId),
    }));
  };

  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [value[0], value[1]] as [number, number],
    }));
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      ratings: checked
        ? [...prev.ratings, rating]
        : prev.ratings.filter((r) => r !== rating),
    }));
  };

  const handleReset = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1000],
      ratings: [],
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  return (
    <div
      className={`bg-background border-r border-border h-full w-full max-w-[280px] flex flex-col overflow-auto transition-all duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background z-10">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Accordion
          type="multiple"
          defaultValue={["categories", "price", "rating"]}
          className="space-y-4"
        >
          <AccordionItem value="categories" className="border-b-0">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium">Categories</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category.id, checked === true)
                      }
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm flex-1 flex items-center justify-between cursor-pointer"
                    >
                      <span>{category.name}</span>
                      {category.count !== undefined && (
                        <span className="text-muted-foreground text-xs">
                          {category.count}
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price" className="border-b-0">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium">Price Range</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-1">
                <Slider
                  value={[filters.priceRange[0], filters.priceRange[1]]}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={handlePriceChange}
                  className="my-6"
                />
                <div className="flex items-center justify-between">
                  <div className="bg-muted px-3 py-1 rounded-md">
                    <span className="text-xs font-medium">
                      ${filters.priceRange[0]}
                    </span>
                  </div>
                  <div className="bg-muted px-3 py-1 rounded-md">
                    <span className="text-xs font-medium">
                      ${filters.priceRange[1]}
                    </span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rating" className="border-b-0">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium">Rating</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={filters.ratings.includes(rating)}
                      onCheckedChange={(checked) =>
                        handleRatingChange(rating, checked === true)
                      }
                    />
                    <label
                      htmlFor={`rating-${rating}`}
                      className="text-sm flex items-center space-x-1 cursor-pointer"
                    >
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {rating}+ stars
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="p-4 border-t sticky bottom-0 bg-background">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button size="sm" className="flex-1" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
