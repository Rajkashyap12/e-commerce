import React, { useState, useEffect, useMemo } from "react";
import { Search, ShoppingCart, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ProductGrid from "./ProductGrid";
import FilterPanel from "./FilterPanel";
import CartPreview from "./CartPreview";
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
}

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 1000] as [number, number],
    ratings: [],
  });
  const [sortOption, setSortOption] = useState("newest");
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Load products and categories from Supabase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Import dynamically to avoid issues with SSR
        const { fetchProducts, fetchCategories } = await import(
          "../lib/supabase"
        );

        // Fetch products and categories
        const productsData = await fetchProducts();
        const categoriesData = await fetchCategories();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load data:", error);
        // Fallback to mock data if API fails
        setProducts([
          {
            id: "1",
            name: "Wireless Headphones",
            price: 129.99,
            image:
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
            category: "Electronics",
            rating: 4.5,
            description: "Premium wireless headphones with noise cancellation.",
          },
          {
            id: "2",
            name: "Smart Watch",
            price: 199.99,
            image:
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
            category: "Electronics",
            rating: 4.2,
            description:
              "Track your fitness and stay connected with this smart watch.",
          },
          {
            id: "3",
            name: "Cotton T-Shirt",
            price: 24.99,
            image:
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
            category: "Clothing",
            rating: 4.0,
            description: "Comfortable cotton t-shirt for everyday wear.",
          },
          {
            id: "4",
            name: "Leather Wallet",
            price: 49.99,
            image:
              "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
            category: "Accessories",
            rating: 4.8,
            description: "Genuine leather wallet with multiple card slots.",
          },
          {
            id: "5",
            name: "Ceramic Coffee Mug",
            price: 14.99,
            image:
              "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80",
            category: "Home",
            rating: 3.9,
            description: "Stylish ceramic coffee mug for your morning brew.",
          },
          {
            id: "6",
            name: "Running Shoes",
            price: 89.99,
            image:
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
            category: "Footwear",
            rating: 4.7,
            description: "Lightweight running shoes with superior cushioning.",
          },
          {
            id: "7",
            name: "Backpack",
            price: 59.99,
            image:
              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
            category: "Accessories",
            rating: 4.3,
            description: "Durable backpack with multiple compartments.",
          },
          {
            id: "8",
            name: "Sunglasses",
            price: 79.99,
            image:
              "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
            category: "Accessories",
            rating: 4.1,
            description: "Stylish sunglasses with UV protection.",
          },
        ]);
        setCategories([
          "Electronics",
          "Clothing",
          "Accessories",
          "Home",
          "Footwear",
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Search products when query changes
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim() === "") return;

      setIsLoading(true);
      try {
        const { searchProducts } = await import("../lib/supabase");
        const results = await searchProducts(searchQuery);
        if (results.length > 0) {
          setProducts(results);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      searchProducts();
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    // Apply filters
    let result = [...products];

    console.log("Filtering products:", {
      totalProducts: products.length,
      categories: filters.categories,
      priceRange: filters.priceRange,
      ratings: filters.ratings,
    });

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((product) => {
        const categoryMatches = filters.categories.includes(
          product.category.toLowerCase(),
        );
        return categoryMatches;
      });
      console.log("After category filter:", result.length);
    }

    // Price range filter
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1],
    );
    console.log("After price filter:", result.length);

    // Rating filter
    if (filters.ratings.length > 0) {
      result = result.filter((product) =>
        filters.ratings.includes(Math.floor(product.rating)),
      );
      console.log("After rating filter:", result.length);
    }

    // Apply sorting
    const sortedResult = result.sort((a, b) => {
      switch (sortOption) {
        case "priceHighToLow":
          return b.price - a.price;
        case "priceLowToHigh":
          return a.price - b.price;
        case "popularity":
          return b.rating - a.rating;
        case "newest":
        default:
          return parseInt(b.id) - parseInt(a.id);
      }
    });

    console.log("Final filtered products:", sortedResult.length);
    return sortedResult;
  }, [products, filters, sortOption]);

  // Listen for add to cart events from ProductGrid
  useEffect(() => {
    const handleAddToCart = (event: any) => {
      const product = event.detail;
      if (product && product.id) {
        addToCartHandler(product);
      }
    };

    window.addEventListener("add-to-cart", handleAddToCart);
    return () => window.removeEventListener("add-to-cart", handleAddToCart);
  }, [cart]);

  // Load cart from Supabase on initial load
  useEffect(() => {
    const loadCart = async () => {
      try {
        // In a real app, you'd get the user ID from auth
        const userId = "current-user-id";
        const { fetchCartItems } = await import("../lib/supabase");
        const cartItems = await fetchCartItems(userId);
        if (cartItems.length > 0) {
          setCart(cartItems);
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    };

    loadCart();
  }, []);

  // Add product to cart
  const addToCartHandler = async (product: Product) => {
    // Update local state first for immediate feedback
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id,
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });

    // Then update in Supabase
    try {
      const userId = "current-user-id"; // In a real app, get from auth
      const { saveCartItem } = await import("../lib/supabase");
      const newQuantity =
        cart.find((item) => item.product.id === product.id)?.quantity + 1 || 1;
      await saveCartItem(userId, product.id, newQuantity);
    } catch (error) {
      console.error("Failed to save cart item:", error);
    }

    setIsCartOpen(true);
  };

  // Remove product from cart
  const removeFromCart = async (productId: string) => {
    // Update local state first
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId),
    );

    // Then update in Supabase
    try {
      const userId = "current-user-id"; // In a real app, get from auth
      const { removeCartItem } = await import("../lib/supabase");
      await removeCartItem(userId, productId);
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  // Update product quantity in cart
  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Update local state first
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );

    // Then update in Supabase
    try {
      const userId = "current-user-id"; // In a real app, get from auth
      const { saveCartItem } = await import("../lib/supabase");
      await saveCartItem(userId, productId, quantity);
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  // Handle checkout process
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      const userId = "current-user-id"; // In a real app, get from auth
      const { createOrder } = await import("../lib/supabase");

      console.log("Processing checkout with items:", cart);
      const orderId = await createOrder(userId, cart, cartTotal);

      if (orderId) {
        // Clear local cart after successful checkout
        setCart([]);
        setIsCartOpen(false);
        // You could redirect to an order confirmation page here
        alert(`Order placed successfully! Order ID: ${orderId}`);
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to process your order. Please try again.");
    }
  };

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-8">ShopNow</h1>
            <nav className="hidden md:flex space-x-6">
              <a
                href="#"
                className="text-foreground hover:text-primary transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-foreground hover:text-primary transition-colors"
              >
                Categories
              </a>
              <a
                href="#"
                className="text-foreground hover:text-primary transition-colors"
              >
                New Arrivals
              </a>
              <a
                href="#"
                className="text-foreground hover:text-primary transition-colors"
              >
                Sale
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block w-64">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page title and filter toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Products</h2>
          <div className="flex items-center space-x-4">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="priceHighToLow">
                  Price: High to Low
                </SelectItem>
                <SelectItem value="priceLowToHigh">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden"
            >
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter panel - desktop */}
          <div className="hidden md:block w-64 shrink-0">
            <FilterPanel
              isOpen={true}
              categories={categories.map((cat) => ({
                id: cat.toLowerCase(),
                name: cat,
              }))}
              onApplyFilters={(newFilters) => setFilters(newFilters)}
            />
          </div>

          {/* Filter panel - mobile */}
          {isFilterOpen && (
            <div className="fixed inset-0 bg-background z-50 md:hidden overflow-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <FilterPanel
                  isOpen={true}
                  categories={categories.map((cat) => ({
                    id: cat.toLowerCase(),
                    name: cat,
                  }))}
                  onApplyFilters={(newFilters) => {
                    setFilters(newFilters);
                    setIsFilterOpen(false);
                  }}
                />
                <div className="mt-6">
                  <Button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-muted rounded-lg h-[350px] animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <>
                <ProductGrid
                  products={filteredAndSortedProducts}
                  filters={filters}
                  searchQuery={searchQuery}
                  sortOption={sortOption}
                />

                {/* Empty state */}
                {filteredAndSortedProducts.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">
                      No products found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Cart preview */}
      <CartPreview
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        }))}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default HomePage;
