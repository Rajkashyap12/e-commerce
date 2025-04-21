package com.shopnow.service;

import com.shopnow.dto.CreateOrderItemRequest;
import com.shopnow.model.Order;
import com.shopnow.model.OrderItem;
import com.shopnow.model.Product;
import com.shopnow.model.User;
import com.shopnow.repository.OrderItemRepository;
import com.shopnow.repository.OrderRepository;
import com.shopnow.repository.ProductRepository;
import com.shopnow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository, UserRepository userRepository, ProductRepository productRepository, CartService cartService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.cartService = cartService;
    }

    @Transactional
    public Long createOrder(Long userId, List<CreateOrderItemRequest> items, Double totalAmount, String shippingAddress, String paymentMethod) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setStatus("pending");
        order.setShippingAddress(shippingAddress);
        order.setPaymentMethod(paymentMethod);
        order.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));

        Order savedOrder = orderRepository.save(order);

        for (CreateOrderItemRequest itemRequest : items) {
            Product product = productRepository.findById(Long.parseLong(itemRequest.getProductId()))
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(itemRequest.getPrice());

            orderItemRepository.save(orderItem);
        }

        // Clear the user's cart after successful order creation
        cartService.clearCart(userId);

        return savedOrder.getId();
    }
}
