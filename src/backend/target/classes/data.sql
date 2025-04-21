-- Insert sample users
INSERT INTO users (email, password, first_name, last_name, created_at)
SELECT 'user@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'John', 'Doe', '2023-01-01 00:00:00'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user@example.com');

INSERT INTO users (email, password, first_name, last_name, created_at)
SELECT 'admin@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Admin', 'User', '2023-01-01 00:00:00'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');

-- Insert sample products
INSERT INTO products (name, price, image, category, rating, description) VALUES
('Wireless Headphones', 129.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', 'Electronics', 4.5, 'Premium wireless headphones with noise cancellation.'),
('Smart Watch', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', 'Electronics', 4.2, 'Track your fitness and stay connected with this smart watch.'),
('Cotton T-Shirt', 24.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', 'Clothing', 4.0, 'Comfortable cotton t-shirt for everyday wear.'),
('Leather Wallet', 49.99, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80', 'Accessories', 4.8, 'Genuine leather wallet with multiple card slots.'),
('Ceramic Coffee Mug', 14.99, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80', 'Home', 3.9, 'Stylish ceramic coffee mug for your morning brew.'),
('Running Shoes', 89.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', 'Footwear', 4.7, 'Lightweight running shoes with superior cushioning.'),
('Backpack', 59.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', 'Accessories', 4.3, 'Durable backpack with multiple compartments.'),
('Sunglasses', 79.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80', 'Accessories', 4.1, 'Stylish sunglasses with UV protection.');

-- Insert sample cart items
INSERT INTO cart_items (user_id, product_id, quantity) VALUES
(1, 1, 1),
(1, 3, 2);
