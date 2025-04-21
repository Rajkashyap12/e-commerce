package com.shopnow.controller;

import com.shopnow.model.CartItem;
import com.shopnow.model.User;
import com.shopnow.service.CartService;
import com.shopnow.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;
    private final UserService userService;

    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCart(@PathVariable Long userId) {
        User user = userService.findById(userId);
        return ResponseEntity.ok(cartService.getCartItems(user));
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<CartItem> addToCart(
            @PathVariable Long userId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        User user = userService.findById(userId);
        return ResponseEntity.ok(cartService.addToCart(user, productId, quantity));
    }

    @DeleteMapping("/{userId}/items/{productId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        User user = userService.findById(userId);
        cartService.removeFromCart(user, productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        User user = userService.findById(userId);
        cartService.clearCart(user);
        return ResponseEntity.ok().build();
    }
}
