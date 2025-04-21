package com.shopnow.controller;

import com.shopnow.dto.CartItemDto;
import com.shopnow.dto.CartItemRequest;
import com.shopnow.dto.CartResponse;
import com.shopnow.model.User;
import com.shopnow.service.CartService;
import com.shopnow.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public ResponseEntity<CartResponse> getCartItems(@PathVariable String userId) {
        // Verify the authenticated user is accessing their own cart
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authenticatedUser = userService.findByEmail(authentication.getName());
        
        if (!authenticatedUser.getId().toString().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        List<CartItemDto> items = cartService.getCartItems(Long.parseLong(userId));
        return ResponseEntity.ok(new CartResponse(items));
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<Void> addOrUpdateCartItem(
            @PathVariable String userId,
            @RequestBody CartItemRequest request) {
        // Verify the authenticated user is modifying their own cart
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authenticatedUser = userService.findByEmail(authentication.getName());
        
        if (!authenticatedUser.getId().toString().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        cartService.addOrUpdateCartItem(
                Long.parseLong(userId),
                Long.parseLong(request.getProductId()),
                request.getQuantity());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/items/{productId}")
    public ResponseEntity<Void> removeCartItem(
            @PathVariable String userId,
            @PathVariable String productId) {
        // Verify the authenticated user is modifying their own cart
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authenticatedUser = userService.findByEmail(authentication.getName());
        
        if (!authenticatedUser.getId().toString().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        cartService.removeCartItem(Long.parseLong(userId), Long.parseLong(productId));
        return ResponseEntity.ok().build();
    }
}
