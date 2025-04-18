package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.CartItem;
import com.ecommerce.backend.model.Order;
import com.ecommerce.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable String userId) {
        List<CartItem> cartItems = cartService.getCartItems(userId);
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<CartItem> addToCart(
            @PathVariable String userId,
            @RequestBody AddToCartRequest request) {
        CartItem cartItem = cartService.addItemToCart(userId, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cartItem);
    }

    @PutMapping("/{userId}/items/{productId}")
    public ResponseEntity<CartItem> updateCartItem(
            @PathVariable String userId,
            @PathVariable String productId,
            @RequestBody UpdateCartRequest request) {
        CartItem cartItem = cartService.updateCartItemQuantity(userId, productId, request.getQuantity());
        return ResponseEntity.ok(cartItem);
    }

    @DeleteMapping("/{userId}/items/{productId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable String userId,
            @PathVariable String productId) {
        cartService.removeCartItem(userId, productId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/checkout")
    public ResponseEntity<Order> checkout(
            @PathVariable String userId,
            @RequestBody CheckoutRequest request) {
        Order order = cartService.checkout(userId, request.getShippingAddress(), request.getPaymentMethod());
        return ResponseEntity.ok(order);
    }

    // Request/Response classes
    public static class AddToCartRequest {
        private String productId;
        private int quantity;

        public String getProductId() {
            return productId;
        }

        public void setProductId(String productId) {
            this.productId = productId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }

    public static class UpdateCartRequest {
        private int quantity;

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }

    public static class CheckoutRequest {
        private String shippingAddress;
        private String paymentMethod;

        public String getShippingAddress() {
            return shippingAddress;
        }

        public void setShippingAddress(String shippingAddress) {
            this.shippingAddress = shippingAddress;
        }

        public String getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }
    }
}
