import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dkxadvivxgrsdioxvdkl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreGFkdml2eGdyc2Rpb3h2ZGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NzA3NTcsImV4cCI6MjA2MDQ0Njc1N30.5xgFrp-OEgXlaP3MhS_SSYuvmcc3FS0z-kVRk3t16GM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Product related functions
export async function fetchProducts() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data || [];
}

export async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data?.map((category) => category.name) || [];
}

// Cart related functions
export async function saveCartItem(
  userId: string,
  productId: string,
  quantity: number,
) {
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
}

export async function fetchCartItems(userId: string) {
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
}

export async function removeCartItem(userId: string, productId: string) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .match({ user_id: userId, product_id: productId });

  if (error) {
    console.error("Error removing cart item:", error);
    return false;
  }

  return true;
}

// Order related functions
export async function createOrder(
  userId: string,
  items: any[],
  totalAmount: number,
) {
  // First create the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      status: "pending",
    })
    .select();

  if (orderError || !order || order.length === 0) {
    console.error("Error creating order:", orderError);
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
}

// Search function with Elasticsearch integration
export async function searchProducts(query: string) {
  // This would typically call an Elasticsearch endpoint
  // For now, we'll simulate with Supabase text search
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .textSearch("name", query, {
      config: "english",
    });

  if (error) {
    console.error("Error searching products:", error);
    return [];
  }

  return data || [];
}
