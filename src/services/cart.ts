import { supabase } from "../lib/supabase";

// API base URL - will use Supabase as fallback if Java backend is not available
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
}

// Helper function to determine if we should use Java backend or Supabase
const useJavaBackend = async (): Promise<boolean> => {
  try {
    // Try to ping the Java backend
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Short timeout to quickly fall back to Supabase if Java backend is not available
      signal: AbortSignal.timeout(1000),
    });
    return response.ok;
  } catch (error) {
    console.log("Java backend not available, falling back to Supabase");
    return false;
  }
};

// Fetch cart items for a user
export async function fetchCartItems(userId: string): Promise<CartItem[]> {
  // Try Java backend first
  if (await useJavaBackend()) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching cart items: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error(
        "Error fetching from Java backend, falling back to Supabase:",
        error,
      );
      // Fall back to Supabase if Java backend fails
    }
  }

  // Supabase fallback
  try {
    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        quantity,
        products (*)
      `,
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }

    return (
      data?.map((item) => ({
        product: item.products,
        quantity: item.quantity,
      })) || []
    );
  } catch (error) {
    console.error("Unexpected error fetching cart:", error);
    return [];
  }
}

// Add or update item in cart
export async function saveCartItem(
  userId: string,
  productId: string,
  quantity: number,
): Promise<boolean> {
  // Try Java backend first
  if (await useJavaBackend()) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error saving cart item: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error(
        "Error saving to Java backend, falling back to Supabase:",
        error,
      );
      // Fall back to Supabase if Java backend fails
    }
  }

  // Supabase fallback
  try {
    const { error } = await supabase.from("cart_items").upsert(
      {
        user_id: userId,
        product_id: productId,
        quantity: quantity,
      },
      {
        onConflict: "user_id,product_id",
      },
    );

    if (error) {
      console.error("Error saving cart item:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error saving cart item:", error);
    return false;
  }
}

// Remove item from cart
export async function removeCartItem(
  userId: string,
  productId: string,
): Promise<boolean> {
  // Try Java backend first
  if (await useJavaBackend()) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/cart/${userId}/items/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error removing cart item: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error(
        "Error removing from Java backend, falling back to Supabase:",
        error,
      );
      // Fall back to Supabase if Java backend fails
    }
  }

  // Supabase fallback
  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .match({ user_id: userId, product_id: productId });

    if (error) {
      console.error("Error removing cart item:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error removing cart item:", error);
    return false;
  }
}

// Create an order from cart items
export async function createOrder(
  userId: string,
  items: CartItem[],
  totalAmount: number,
  shippingAddress: string = "",
  paymentMethod: string = "credit_card",
): Promise<string | null> {
  // Try Java backend first
  if (await useJavaBackend()) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          userId,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          totalAmount,
          shippingAddress,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error creating order: ${response.statusText}`);
      }

      const data = await response.json();
      return data.orderId || null;
    } catch (error) {
      console.error(
        "Error creating order in Java backend, falling back to Supabase:",
        error,
      );
      // Fall back to Supabase if Java backend fails
    }
  }

  // Supabase fallback
  try {
    // First create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: "pending",
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        created_at: new Date().toISOString(),
      })
      .select();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return null;
    }

    if (!order || order.length === 0) {
      console.error("No order returned after insert");
      return null;
    }

    const orderId = order[0].id;

    // Then create order items
    const orderItems = items.map((item) => ({
      order_id: orderId,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      return null;
    }

    // Clear the cart after successful order
    await supabase.from("cart_items").delete().eq("user_id", userId);

    return orderId;
  } catch (error) {
    console.error("Unexpected error in createOrder:", error);
    return null;
  }
}
