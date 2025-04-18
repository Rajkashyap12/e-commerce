# Java Backend Integration for E-commerce Cart

## Overview
This document outlines how to integrate a Java backend with our React frontend for enhanced cart functionality and order processing.

## Implementation Steps

### 1. Set Up Spring Boot Backend

```java
@RestController
@RequestMapping("/api/cart")
public class CartController {
    
    private final CartService cartService;
    
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<ShoppingCart> getCart(@PathVariable String userId) {
        ShoppingCart cart = cartService.getCartForUser(userId);
        return ResponseEntity.ok(cart);
    }
    
    @PostMapping("/{userId}/items")
    public ResponseEntity<ShoppingCart> addToCart(
            @PathVariable String userId,
            @RequestBody AddToCartRequest request) {
        
        ShoppingCart cart = cartService.addItemToCart(
            userId, 
            request.getProductId(), 
            request.getQuantity()
        );
        
        return ResponseEntity.ok(cart);
    }
    
    @PutMapping("/{userId}/items/{productId}")
    public ResponseEntity<ShoppingCart> updateCartItem(
            @PathVariable String userId,
            @PathVariable String productId,
            @RequestBody UpdateCartItemRequest request) {
        
        ShoppingCart cart = cartService.updateItemQuantity(
            userId, 
            productId, 
            request.getQuantity()
        );
        
        return ResponseEntity.ok(cart);
    }
    
    @DeleteMapping("/{userId}/items/{productId}")
    public ResponseEntity<ShoppingCart> removeFromCart(
            @PathVariable String userId,
            @PathVariable String productId) {
        
        ShoppingCart cart = cartService.removeItemFromCart(userId, productId);
        return ResponseEntity.ok(cart);
    }
    
    @PostMapping("/{userId}/checkout")
    public ResponseEntity<Order> checkout(
            @PathVariable String userId,
            @RequestBody CheckoutRequest request) {
        
        Order order = cartService.checkout(
            userId, 
            request.getShippingAddress(), 
            request.getPaymentMethod()
        );
        
        return ResponseEntity.ok(order);
    }
}
```

### 2. Database Integration with JPA

```java
@Entity
@Table(name = "cart_items")
public class CartItemEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "product_id", nullable = false)
    private String productId;
    
    @Column(nullable = false)
    private int quantity;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", referencedColumnName = "id", insertable = false, updatable = false)
    private ProductEntity product;
    
    // Getters and setters
}

@Entity
@Table(name = "orders")
public class OrderEntity {
    
    @Id
    private String id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(nullable = false)
    private double total;
    
    @Column(name = "shipping_address", nullable = false)
    private String shippingAddress;
    
    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;
    
    @Column(nullable = false)
    private String status;
    
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItemEntity> items;
    
    // Getters and setters
}
```

### 3. Connect to Frontend

Update the React frontend to call these Java backend endpoints instead of Supabase:

```typescript
// src/services/cart.ts

export async function fetchCartItems(userId: string) {
  const response = await fetch(`/api/cart/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  const data = await response.json();
  return data.items.map(item => ({
    product: item.product,
    quantity: item.quantity
  }));
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const response = await fetch(`/api/cart/${userId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId, quantity })
  });
  
  if (!response.ok) {
    throw new Error('Failed to add item to cart');
  }
  
  return await response.json();
}

export async function checkout(userId: string, shippingAddress: string, paymentMethod: string) {
  const response = await fetch(`/api/cart/${userId}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ shippingAddress, paymentMethod })
  });
  
  if (!response.ok) {
    throw new Error('Checkout failed');
  }
  
  return await response.json();
}
```

## Deployment Considerations

1. Deploy the Spring Boot application to a server or cloud service
2. Configure CORS to allow requests from your frontend domain
3. Set up a production database (PostgreSQL recommended)
4. Implement proper authentication and authorization
5. Consider using a message queue for order processing

## Benefits of Java Backend

- Strong typing and compile-time safety
- Excellent performance for high-traffic e-commerce sites
- Rich ecosystem of libraries for payment processing, inventory management, etc.
- Enterprise-grade security features
- Scalable architecture for growing businesses
