import React, { useState } from "react";
import { Search, ShoppingCart, ChevronDown, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ProductGrid from "./ProductGrid";
import FilterPanel from "./FilterPanel";
import CartPreview from "./CartPreview";

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
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortOption, setSortOption] = useState("newest");
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
    [],
  );

  // Mock products data
  const products: Product[] = [
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
  ];

  // Filter products based on search, category, price, and rating
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory.length === 0 ||
      selectedCategory.includes(product.category);
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesRating = product.rating >= ratingFilter;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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

  // Add product to cart
  const addToCart = (product: Product) => {
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
    setIsCartOpen(true);
  };

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId),
    );
  };

  // Update product quantity in cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
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
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => {}}
                className="flex items-center"
              >
                Sort by:{" "}
                {sortOption === "newest"
                  ? "Newest"
                  : sortOption === "priceHighToLow"
                    ? "Price: High to Low"
                    : sortOption === "priceLowToHigh"
                      ? "Price: Low to High"
                      : "Popularity"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-10 hidden group-hover:block">
                <div className="py-1">
                  <button
                    onClick={() => setSortOption("newest")}
                    className="block w-full text-left px-4 py-2 hover:bg-accent"
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => setSortOption("priceHighToLow")}
                    className="block w-full text-left px-4 py-2 hover:bg-accent"
                  >
                    Price: High to Low
                  </button>
                  <button
                    onClick={() => setSortOption("priceLowToHigh")}
                    className="block w-full text-left px-4 py-2 hover:bg-accent"
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => setSortOption("popularity")}
                    className="block w-full text-left px-4 py-2 hover:bg-accent"
                  >
                    Popularity
                  </button>
                </div>
              </div>
            </div>

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
              categories={Array.from(new Set(products.map((p) => p.category)))}
              selectedCategories={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              maxPrice={Math.max(...products.map((p) => p.price))}
              ratingFilter={ratingFilter}
              onRatingChange={setRatingFilter}
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
                  categories={Array.from(
                    new Set(products.map((p) => p.category)),
                  )}
                  selectedCategories={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  maxPrice={Math.max(...products.map((p) => p.price))}
                  ratingFilter={ratingFilter}
                  onRatingChange={setRatingFilter}
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
            <ProductGrid products={sortedProducts} onAddToCart={addToCart} />

            {/* Empty state */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Cart preview */}
      <CartPreview
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        total={cartTotal}
      />
    </div>
  );
};

export default HomePage;
