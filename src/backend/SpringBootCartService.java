package com.ecommerce.cart.service;

import com.ecommerce.cart.model.CartItem;
import com.ecommerce.cart.model.Order;
import com.ecommerce.cart.model.OrderItem;
import com.ecommerce.cart.model.Product;
import com.ecommerce.cart.repository.CartItemRepository;
import com.ecommerce.cart.repository.OrderItemRepository;
import com.ecommerce.cart.repository.OrderRepository;
import com.ecommerce.cart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SpringBootCartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    // Get all cart items for a user
    public List<CartItem> getCartItems(String userId) {
        return cartItemRepository.findByUserId(userId);
    }

    // Add or update item in cart
    public CartItem saveCartItem(String userId, String productId, int quantity) {
        // Find existing cart item
        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductId(userId, productId);

        if (existingItem.isPresent()) {
            // Update quantity
            CartItem item = existingItem.get();
            item.setQuantity(quantity);
            return cartItemRepository.save(item);
        } else {
            // Create new cart item
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            CartItem newItem = new CartItem();
            newItem.setUserId(userId);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            return cartItemRepository.save(newItem);
        }
    }

    // Remove item from cart
    public void removeCartItem(String userId, String productId) {
        cartItemRepository.deleteByUserIdAndProductId(userId, productId);
    }

    // Create order from cart items
    @Transactional
    public Order createOrder(String userId, String shippingAddress, String paymentMethod) {
        // Get all cart items for user
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate total amount
        double totalAmount = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        // Create order
        Order order = new Order();
        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setStatus("pending");
        order.setShippingAddress(shippingAddress);
        order.setPaymentMethod(paymentMethod);
        order.setCreatedAt(LocalDateTime.now());
        order.setOrderNumber(generateOrderNumber());
        
        Order savedOrder = orderRepository.save(order);

        // Create order items
        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            return orderItem;
        }).collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);

        // Clear cart
        cartItemRepository.deleteByUserId(userId);

        return savedOrder;
    }

    // Generate unique order number
    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // Get order by id
    public Order getOrder(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // Get all orders for a user
    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
