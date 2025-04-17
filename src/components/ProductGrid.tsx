import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  isNew?: boolean;
  popularity?: number;
}

interface ProductGridProps {
  products?: Product[];
  filters?: {
    categories: string[];
    priceRange: [number, number];
    ratings: number[];
  };
  searchQuery?: string;
  sortOption?: string;
}

const ProductGrid = ({
  products = mockProducts,
  filters = {
    categories: [],
    priceRange: [0, 1000],
    ratings: [],
  },
  searchQuery = "",
  sortOption = "newest",
}: ProductGridProps) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [columns, setColumns] = useState(4);
  const [isLoading, setIsLoading] = useState(false);

  // Handle responsive grid layout
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 768) setColumns(2);
      else if (width < 1024) setColumns(3);
      else setColumns(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter and sort products when dependencies change
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      let result = [...products];

      // Apply category filter
      if (filters.categories.length > 0) {
        result = result.filter((product) =>
          filters.categories.includes(product.category),
        );
      }

      // Apply price range filter
      result = result.filter(
        (product) =>
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1],
      );

      // Apply rating filter
      if (filters.ratings.length > 0) {
        result = result.filter((product) =>
          filters.ratings.includes(Math.floor(product.rating)),
        );
      }

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query),
        );
      }

      // Apply sorting
      switch (sortOption) {
        case "newest":
          result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case "price-high-low":
          result.sort((a, b) => b.price - a.price);
          break;
        case "price-low-high":
          result.sort((a, b) => a.price - b.price);
          break;
        case "popularity":
          result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
          break;
        default:
          break;
      }

      setFilteredProducts(result);
      setIsLoading(false);
    }, 300);
  }, [products, filters, searchQuery, sortOption]);

  return (
    <div className="w-full bg-background p-4">
      {/* Sorting controls */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="text-lg font-medium mb-2 sm:mb-0">
          {filteredProducts.length} Products
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select defaultValue={sortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-muted rounded-lg h-[350px] animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-4xl mb-4">😕</div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Try adjusting your filters or search query to find what you're
            looking for.
          </p>
        </div>
      ) : (
        // Product grid
        <motion.div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-4`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.price * 1.2}
                image={product.image}
                rating={product.rating}
                category={product.category}
                isNew={product.isNew}
                isSale={true}
                onAddToCart={() =>
                  window.dispatchEvent(
                    new CustomEvent("add-to-cart", { detail: product }),
                  )
                }
                onQuickView={() => {}}
                onAddToWishlist={() => {}}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// Mock data for default state
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    category: "Electronics",
    rating: 4.5,
    description: "Premium wireless headphones with noise cancellation",
    isNew: true,
    popularity: 95,
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    category: "Electronics",
    rating: 4.2,
    description: "Fitness tracker with heart rate monitor",
    popularity: 87,
  },
  {
    id: "3",
    name: "Leather Wallet",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
    category: "Accessories",
    rating: 4.8,
    description: "Handcrafted genuine leather wallet",
    popularity: 76,
  },
  {
    id: "4",
    name: "Cotton T-Shirt",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    category: "Clothing",
    rating: 4.0,
    description: "Comfortable 100% cotton t-shirt",
    isNew: true,
    popularity: 92,
  },
  {
    id: "5",
    name: "Coffee Mug",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80",
    category: "Home",
    rating: 4.3,
    description: "Ceramic coffee mug with minimalist design",
    popularity: 65,
  },
  {
    id: "6",
    name: "Sneakers",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    category: "Footwear",
    rating: 4.7,
    description: "Lightweight running shoes with cushioned sole",
    popularity: 88,
  },
  {
    id: "7",
    name: "Backpack",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    category: "Accessories",
    rating: 4.4,
    description: "Durable backpack with laptop compartment",
    isNew: true,
    popularity: 79,
  },
  {
    id: "8",
    name: "Sunglasses",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
    category: "Accessories",
    rating: 4.1,
    description: "UV protection sunglasses with polarized lenses",
    popularity: 82,
  },
];

export default ProductGrid;
