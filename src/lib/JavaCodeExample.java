/**
 * Example Java code for e-commerce cart functionality
 * This would be used in a Java backend implementation
 */
package com.ecommerce.cart;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ShoppingCart {
    private String userId;
    private Map<String, CartItem> items;
    private double total;

    public ShoppingCart(String userId) {
        this.userId = userId;
        this.items = new HashMap<>();
        this.total = 0.0;
    }

    public void addItem(Product product, int quantity) {
        String productId = product.getId();
        if (items.containsKey(productId)) {
            CartItem item = items.get(productId);
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            items.put(productId, new CartItem(product, quantity));
        }
        calculateTotal();
    }

    public void updateItemQuantity(String productId, int quantity) {
        if (items.containsKey(productId)) {
            if (quantity <= 0) {
                removeItem(productId);
            } else {
                items.get(productId).setQuantity(quantity);
                calculateTotal();
            }
        }
    }

    public void removeItem(String productId) {
        items.remove(productId);
        calculateTotal();
    }

    public void clear() {
        items.clear();
        total = 0.0;
    }

    private void calculateTotal() {
        total = items.values().stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
    }

    public List<CartItem> getItems() {
        return new ArrayList<>(items.values());
    }

    public double getTotal() {
        return total;
    }

    public String getUserId() {
        return userId;
    }

    public int getItemCount() {
        return items.values().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }

    // Inner classes for cart functionality
    public static class CartItem {
        private Product product;
        private int quantity;

        public CartItem(Product product, int quantity) {
            this.product = product;
            this.quantity = quantity;
        }

        public Product getProduct() {
            return product;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public double getSubtotal() {
            return product.getPrice() * quantity;
        }
    }

    public static class Product {
        private String id;
        private String name;
        private double price;
        private String imageUrl;
        private String category;

        public Product(String id, String name, double price, String imageUrl, String category) {
            this.id = id;
            this.name = name;
            this.price = price;
            this.imageUrl = imageUrl;
            this.category = category;
        }

        public String getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public double getPrice() {
            return price;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public String getCategory() {
            return category;
        }
    }

    // Example checkout process
    public Order checkout(String shippingAddress, String paymentMethod) {
        if (items.isEmpty()) {
            throw new IllegalStateException("Cannot checkout an empty cart");
        }

        Order order = new Order(userId, new ArrayList<>(items.values()), total, shippingAddress, paymentMethod);
        // In a real implementation, this would save to database
        // orderRepository.save(order);
        
        // Clear the cart after successful checkout
        clear();
        
        return order;
    }

    public static class Order {
        private String id;
        private String userId;
        private List<CartItem> items;
        private double total;
        private String shippingAddress;
        private String paymentMethod;
        private String status;
        private long createdAt;

        public Order(String userId, List<CartItem> items, double total, String shippingAddress, String paymentMethod) {
            this.id = generateOrderId();
            this.userId = userId;
            this.items = items;
            this.total = total;
            this.shippingAddress = shippingAddress;
            this.paymentMethod = paymentMethod;
            this.status = "pending";
            this.createdAt = System.currentTimeMillis();
        }

        private String generateOrderId() {
            return "ORD-" + System.currentTimeMillis();
        }

        // Getters and setters
        public String getId() {
            return id;
        }

        public String getUserId() {
            return userId;
        }

        public List<CartItem> getItems() {
            return items;
        }

        public double getTotal() {
            return total;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public long getCreatedAt() {
            return createdAt;
        }

        public String getShippingAddress() {
            return shippingAddress;
        }

        public String getPaymentMethod() {
            return paymentMethod;
        }
    }
}
