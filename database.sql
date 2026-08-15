CREATE DATABASE IF NOT EXISTS stock_management;
USE stock_management;

CREATE TABLE users(
 id INT AUTO_INCREMENT PRIMARY KEY,
 fullname VARCHAR(100) NOT NULL,
 email VARCHAR(120) UNIQUE NOT NULL,
 password VARCHAR(255) NOT NULL,
 role ENUM('admin','staff') DEFAULT 'staff',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories(
 id INT AUTO_INCREMENT PRIMARY KEY,
 category_name VARCHAR(100) NOT NULL UNIQUE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers(
 id INT AUTO_INCREMENT PRIMARY KEY,
 supplier_name VARCHAR(120) NOT NULL,
 phone VARCHAR(30),
 address VARCHAR(255),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products(
 id INT AUTO_INCREMENT PRIMARY KEY,
 product_name VARCHAR(150) NOT NULL,
 category_id INT NULL,
 supplier_id INT NULL,
 quantity INT DEFAULT 0,
 price DECIMAL(12,2) DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL,
 FOREIGN KEY(supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

CREATE TABLE sales(
 id INT AUTO_INCREMENT PRIMARY KEY,
 product_id INT NOT NULL,
 quantity_sold INT NOT NULL,
 total_price DECIMAL(12,2) NOT NULL,
 sold_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Login: admin@gmail.com / 123456
-- bcrypt hash for 123456
INSERT INTO users(fullname,email,password,role) VALUES
('System Admin','admin@gmail.com','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','admin');

INSERT INTO categories(category_name) VALUES
('Electronics'),('Food & Beverages'),('Clothes'),('Home Items');

INSERT INTO suppliers(supplier_name,phone,address) VALUES
('Kigali Suppliers','0788000000','Kigali'),
('Rwanda Wholesale','0788111111','Gasabo');

INSERT INTO products(product_name,category_id,supplier_id,quantity,price) VALUES
('Laptop HP',1,1,10,650000),
('Rice 25KG',2,2,50,30000),
('T-Shirt',3,1,30,12000),
('Mattress',4,2,15,85000);
