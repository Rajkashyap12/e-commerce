import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingCart,
  ChevronRight,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription } from "./ui/alert";
import { LoadingSpinner } from "./ui/loading-spinner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartPreviewProps {
  isOpen?: boolean;
  onClose?: () => void;
  items?: CartItem[];
  onRemoveItem?: (id: string) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onCheckout?: () => void;
  isLoading?: boolean;
  isProcessing?: boolean;
  error?: string | null;
  backendType?: "java" | "supabase" | null;
}

const CartPreview = ({
  isOpen = true,
  onClose = () => {},
  items = [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 129.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
    },
    {
      id: "2",
      name: "Smart Watch",
      price: 199.99,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
    },
    {
      id: "3",
      name: "Portable Speaker",
      price: 79.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80",
    },
  ],
  onRemoveItem = () => {},
  onUpdateQuantity = () => {},
  onCheckout = () => {},
  isLoading = false,
  isProcessing = false,
  error = null,
  backendType = null,
}: CartPreviewProps) => {
  const [itemProcessing, setItemProcessing] = useState<string | null>(null);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setItemProcessing(id);
    onUpdateQuantity(id, quantity);
    // Reset processing state after a short delay to simulate network request
    setTimeout(() => setItemProcessing(null), 500);
  };

  const handleRemoveItem = (id: string) => {
    setItemProcessing(id);
    onRemoveItem(id);
    // No need to reset processing state as the item will be removed from the list
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[350px] bg-background z-50 shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <h2 className="text-lg font-semibold">
                  Your Cart ({items.length})
                </h2>
                {backendType && (
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    {backendType === "java" ? "Java Backend" : "Supabase"}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="m-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <LoadingSpinner size="lg" className="mb-4" />
                <p className="text-lg font-medium">Loading your cart...</p>
              </div>
            ) : /* Cart Items */
            items.length > 0 ? (
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 rounded-full p-0"
                            disabled={itemProcessing === item.id}
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                          >
                            -
                          </Button>
                          <span className="mx-2 text-sm">
                            {itemProcessing === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin inline" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 rounded-full p-0"
                            disabled={itemProcessing === item.id}
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto h-7 w-7 p-0"
                            disabled={itemProcessing === item.id}
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            {itemProcessing === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add items to get started
                </p>
                <Button className="mt-6" onClick={onClose}>
                  Continue Shopping
                </Button>
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={onCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Checkout <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onClose}
                    disabled={isProcessing}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartPreview;
