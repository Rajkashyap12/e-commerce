package com.shopnow.controller;

import com.shopnow.dto.CreateOrderRequest;
import com.shopnow.dto.OrderResponse;
import com.shopnow.model.User;
import com.shopnow.service.OrderService;
import com.shopnow.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        // Verify the authenticated user is creating their own order
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authenticatedUser = userService.findByEmail(authentication.getName());
        
        if (!authenticatedUser.getId().toString().equals(request.getUserId())) {
            return ResponseEntity.status(403).build();
        }
        
        Long orderId = orderService.createOrder(
                Long.parseLong(request.getUserId()),
                request.getItems(),
                request.getTotalAmount(),
                request.getShippingAddress(),
                request.getPaymentMethod());
        
        return ResponseEntity.ok(new OrderResponse(orderId.toString()));
    }
}
