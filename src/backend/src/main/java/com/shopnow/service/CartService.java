package com.shopnow.service;

import com.shopnow.dto.CartItemDto;
import com.shopnow.dto.ProductDto;
import com.shopnow.model.CartItem;
import com.shopnow.model.Product;
import com.shopnow.model.User;
import com.shopnow.repository.CartItemRepository;
import com.shopnow.repository.ProductRepository;
import com.shopnow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public List<CartItemDto> getCartItems(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartItemRepository.findByUser(user).stream()
                .map(this::mapToCartItemDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void addOrUpdateCartItem(Long userId, Long productId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existingItem = cartItemRepository.findByUserAndProduct(user, product);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cartItemRepository.save(newItem);
        }
    }

    @Transactional
    public void removeCartItem(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        cartItemRepository.deleteByUserAndProduct(user, product);
    }

    @Transactional
    public void clearCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        cartItemRepository.deleteAll(cartItems);
    }

    private CartItemDto mapToCartItemDto(CartItem cartItem) {
        ProductDto productDto = new ProductDto(
                cartItem.getProduct().getId().toString(),
                cartItem.getProduct().getName(),
                cartItem.getProduct().getPrice(),
                cartItem.getProduct().getImage(),
                cartItem.getProduct().getCategory(),
                cartItem.getProduct().getRating(),
                cartItem.getProduct().getDescription()
        );

        return new CartItemDto(productDto, cartItem.getQuantity());
    }
}
