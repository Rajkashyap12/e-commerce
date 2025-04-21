-- Sample Users
INSERT INTO users (email, password, first_name, last_name, created_at) VALUES
('john.doe@example.com', '$2a$10$Xl0yhvzLIaJCDdKBS0Lld.ksK7c2Zytg/ZKFdtIz/q.HII6nwUGCW', 'John', 'Doe', CURRENT_TIMESTAMP),
('jane.smith@example.com', '$2a$10$VK/DtGPGSOFd8pkJh8v3A.kb4qvwGUH8FqXrh2mZFn.0L9TgIWlBi', 'Jane', 'Smith', CURRENT_TIMESTAMP);

-- Sample Products
INSERT INTO products (name, price, image, category, rating, description) VALUES
('Wireless Headphones', 129.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', 'Electronics', 4.5, 'Premium wireless headphones with noise cancellation'),
('Smart Watch', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', 'Electronics', 4.2, 'Fitness tracker with heart rate monitor'),
('Cotton T-Shirt', 24.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', 'Clothing', 4.0, 'Comfortable 100% cotton t-shirt'),
('Running Shoes', 89.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', 'Footwear', 4.7, 'Lightweight running shoes with cushioned sole'),
('Backpack', 59.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', 'Accessories', 4.3, 'Durable backpack with laptop compartment');

-- Sample Cart Items
INSERT INTO cart_items (user_id, product_id, quantity) VALUES
(1, 1, 1),
(1, 3, 2),
(2, 2, 1);

-- Sample Orders
INSERT INTO orders (user_id, total, shipping_address, payment_method, status, created_at) VALUES
(1, 179.97, '123 Main St, City, Country', 'CREDIT_CARD', 'COMPLETED', CURRENT_TIMESTAMP),
(2, 199.99, '456 Oak St, City, Country', 'PAYPAL', 'PENDING', CURRENT_TIMESTAMP);

-- Sample Order Items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 129.99),
(1, 3, 2, 24.99),
(2, 2, 1, 199.99);