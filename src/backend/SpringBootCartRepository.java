package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.CartItem;
import com.ecommerce.backend.model.Order;
import com.ecommerce.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(String userId);
    Optional<CartItem> findByUserIdAndProductId(String userId, String productId);
    void deleteByUserIdAndProductId(String userId, String productId);
    void deleteByUserId(String userId);
}

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByCategory(String category);
    List<Product> findByNameContainingIgnoreCase(String name);
}

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(String userId);
}
