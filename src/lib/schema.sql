-- Schema for Supabase/PostgreSQL database

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  category TEXT,
  rating DECIMAL(3, 1) DEFAULT 0,
  is_new BOOLEAN DEFAULT false,
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  count INTEGER DEFAULT 0
);

-- Cart items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable full text search for products
ALTER TABLE products ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
  to_tsvector('english', name || ' ' || COALESCE(description, ''))
) STORED;

CREATE INDEX products_search_idx ON products USING GIN (search_vector);

-- Sample data insertion
INSERT INTO categories (name, count) VALUES
('Electronics', 42),
('Clothing', 56),
('Accessories', 31),
('Home', 38),
('Footwear', 19);

INSERT INTO products (name, description, price, image, category, rating, is_new, popularity) VALUES
('Wireless Headphones', 'Premium wireless headphones with noise cancellation', 129.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', 'Electronics', 4.5, true, 95),
('Smart Watch', 'Fitness tracker with heart rate monitor', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', 'Electronics', 4.2, false, 87),
('Cotton T-Shirt', 'Comfortable 100% cotton t-shirt', 24.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', 'Clothing', 4.0, true, 92),
('Leather Wallet', 'Handcrafted genuine leather wallet', 49.99, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80', 'Accessories', 4.8, false, 76),
('Ceramic Coffee Mug', 'Stylish ceramic coffee mug for your morning brew', 14.99, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80', 'Home', 3.9, false, 65),
('Running Shoes', 'Lightweight running shoes with cushioned sole', 89.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', 'Footwear', 4.7, false, 88),
('Backpack', 'Durable backpack with laptop compartment', 59.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', 'Accessories', 4.3, true, 79),
('Sunglasses', 'UV protection sunglasses with polarized lenses', 79.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80', 'Accessories', 4.1, false, 82);
