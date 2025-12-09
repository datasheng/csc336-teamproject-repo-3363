-- =====================================================
--  SnapEats- Database Schema (2NF compliant)
--  Group: 3363
--  Version: 2.0 (2025-12)
-- =====================================================

CREATE DATABASE IF NOT EXISTS SnapEats;
USE SnapEats;

-- =====================================================
--  USERS
-- Assume user could only register with email
-- 'admin' is the user that manage restaurant
-- =====================================================
CREATE TABLE users (
    usrID INT AUTO_INCREMENT PRIMARY KEY,
    usrpwd VARCHAR(50) NOT NULL,
    usrLastName VARCHAR(10) NOT NULL,
    usrFirstName VARCHAR(10) NOT NULL,
    usrRole ENUM('customer', 'admin', 'deliveryPerson') NOT NULL DEFAULT 'customer',
    emailAddr VARCHAR(50) NOT NULL UNIQUE
);

-- =====================================================
--  PAYMENTS
-- store customers' payment info
-- =====================================================
CREATE TABLE payments (
    paymentID INT AUTO_INCREMENT PRIMARY KEY,
    usrID INT NOT NULL,
    cardNum VARCHAR(20) NOT NULL UNIQUE,
    FOREIGN KEY (usrID) REFERENCES users(usrID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================================
--  RESTAURANTS
-- =====================================================
CREATE TABLE restaurants (
    restID INT AUTO_INCREMENT PRIMARY KEY,
    restName VARCHAR(50) NOT NULL,
    usrID INT NOT NULL,
    restTelNum VARCHAR(20),
    restLoc VARCHAR(255),
    FOREIGN KEY (usrID) REFERENCES users(usrID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================================
--  CUSTOMER ADDRESS BOOK
-- 'contactNum' is optional for user to fill in or not
-- =====================================================
CREATE TABLE customerAddressBook (
    addID INT AUTO_INCREMENT PRIMARY KEY,
    usrID INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    contactNum VARCHAR(20),
    FOREIGN KEY (usrID) REFERENCES users(usrID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================================
--  MENUS
-- =====================================================
CREATE TABLE menus (
    menuID INT AUTO_INCREMENT PRIMARY KEY,
    restID INT NOT NULL,
    FOREIGN KEY (restID) REFERENCES restaurants(restID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================================
--  ITEMS
-- =====================================================
CREATE TABLE items (
    itemID INT AUTO_INCREMENT PRIMARY KEY,
    itemName VARCHAR(255) NOT NULL,
    itemDSC TEXT,
    itemPrice DECIMAL(5,2) NOT NULL
);

-- =====================================================
--  MENU-ITEM (Mapping)
-- =====================================================
CREATE TABLE menuItem (
    menuID INT NOT NULL,
    itemID INT NOT NULL,
    PRIMARY KEY (menuID, itemID),
    FOREIGN KEY (menuID) REFERENCES menus(menuID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (itemID) REFERENCES items(itemID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================================
--  ORDERS
-- =====================================================
CREATE TABLE orders (
    orderID INT AUTO_INCREMENT PRIMARY KEY,
    usrID INT NOT NULL,
    restID INT NOT NULL,
    orderTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    orderStatus ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
    FOREIGN KEY (usrID) REFERENCES users(usrID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (restID) REFERENCES restaurants(restID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================================
--  ORDER-ITEMS (Mapping)
-- =====================================================
CREATE TABLE orderItems (
    orderID INT NOT NULL,
    itemID INT NOT NULL,
    quantity INT DEFAULT 1,
    PRIMARY KEY (orderID, itemID),
    FOREIGN KEY (orderID) REFERENCES orders(orderID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (itemID) REFERENCES items(itemID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================================
--  DELIVERIES
-- =====================================================
CREATE TABLE deliveries (
    deliID INT AUTO_INCREMENT PRIMARY KEY,
    orderID INT NOT NULL,
    restID INT NOT NULL,
    custAddrID INT NOT NULL,
    deliveredTime TIMESTAMP NULL,
    deliveryStatus ENUM('pending', 'on_the_way', 'delivered', 'failed') DEFAULT 'pending',
    FOREIGN KEY (orderID) REFERENCES orders(orderID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (restID) REFERENCES restaurants(restID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (custAddrID) REFERENCES customerAddressBook(addID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================================
--  END OF SCHEMA
-- =====================================================

-- =====================================================
--  SEED DATA (Sample users, restaurants, menus, items)
--  Note: simple plaintext passwords per course requirement
-- =====================================================

-- Users
INSERT INTO users (usrpwd, usrLastName, usrFirstName, usrRole, emailAddr) VALUES
('owner1', 'owner', 'owner', 'admin', 'owner@snapeats.local'),
('cust1', 'cust1', 'cust1', 'customer', 'cust1@example.com');


-- Sample payment for customer
INSERT INTO payments (usrID, cardNum)
SELECT u.usrID, '4485275692051372' FROM users u WHERE u.emailAddr = 'cust1@example.com';

-- Sample address for the customer
INSERT INTO customerAddressBook (usrID, address, contactNum)
SELECT usrID, '123 Main Street, New York, NY', '+1 555-123-4567'
FROM users WHERE emailAddr = 'cust1@example.com';

-- Restaurants (owned by the single admin)
INSERT INTO restaurants (restName, usrID, restTelNum, restLoc)
SELECT name, a.usrID, tel, loc
FROM (
  SELECT 'Sushi Zen'          AS name, '555-1001' AS tel, '123 Sakura St' AS loc UNION ALL
  SELECT 'Pasta House',               '555-1002',        '45 Roma Ave'        UNION ALL
  SELECT 'Burger Hub',                '555-1003',        '78 Grill Rd'        UNION ALL
  SELECT 'Spicy Garden',              '555-1004',        '9 Chili Blvd'       UNION ALL
  SELECT 'Vegan Paradise',            '555-1005',        '66 Green Way'       UNION ALL
  SELECT 'Seafood Bay',               '555-1006',        '2 Ocean Dr'
) r
JOIN (SELECT usrID FROM users WHERE emailAddr = 'owner@snapeats.local') a;

-- One menu per restaurant
INSERT INTO menus (restID)
SELECT restID FROM restaurants ORDER BY restID;

-- Items
INSERT INTO items (itemName, itemDSC, itemPrice) VALUES
-- Sushi Zen
('Salmon Nigiri', 'Fresh salmon over vinegared rice', 12.00),
('Tuna Roll', 'Classic tuna maki roll', 10.00),
('Dragon Roll', 'Eel and avocado specialty roll', 15.00),
('Miso Soup', 'Warm miso broth with tofu and seaweed', 5.00),
-- Pasta House
('Carbonara', 'Creamy sauce with pancetta and egg', 14.00),
('Alfredo', 'Rich parmesan cream sauce', 13.00),
('Lasagna', 'Layered pasta with beef and cheese', 16.00),
('Garlic Bread', 'Toasted bread with garlic butter', 5.00),
-- Burger Hub
('Cheeseburger', 'Beef patty with cheddar cheese', 11.00),
('Bacon Burger', 'Smoky bacon with special sauce', 13.00),
('Veggie Burger', 'Plant-based patty and fresh veggies', 10.00),
('French Fries', 'Crispy golden fries', 4.00),
-- Spicy Garden
('Kung Pao Chicken', 'Stir-fried chicken with peanuts and chili', 12.00),
('Mapo Tofu', 'Tofu in spicy Sichuan pepper sauce', 11.00),
('Hotpot', 'Spicy hotpot base with assorted items', 20.00),
('Spring Rolls', 'Crispy rolls with veggies', 6.00),
-- Vegan Paradise
('Avocado Salad', 'Ripe avocado with greens and lemon', 10.00),
('Vegan Burger', 'Plant protein patty and vegan mayo', 12.00),
('Tofu Bowl', 'Tofu, grains, and veggies', 11.00),
('Coconut Smoothie', 'Coconut milk smoothie', 6.00),
-- Seafood Bay
('Grilled Salmon', 'Salmon fillet with herbs', 18.00),
('Shrimp Pasta', 'Shrimp with garlic butter pasta', 16.00),
('Lobster Tail', 'Buttered lobster tail', 25.00),
('Seafood Chowder', 'Creamy chowder with mixed seafood', 9.00);

-- Map items to each restaurant's single menu (assumes insertion order by restaurant blocks above)
-- Helper: capture menu IDs by restaurant name
-- Sushi Zen
INSERT INTO menuItem (menuID, itemID)
SELECT m.menuID, i.itemID
FROM menus m
JOIN restaurants r ON r.restID = m.restID AND r.restName = 'Sushi Zen'
JOIN items i ON i.itemName IN ('Salmon Nigiri','Tuna Roll','Dragon Roll','Miso Soup');

-- Pasta House
INSERT INTO menuItem (menuID, itemID)
SELECT m.menuID, i.itemID
FROM menus m
JOIN restaurants r ON r.restID = m.restID AND r.restName = 'Pasta House'
JOIN items i ON i.itemName IN ('Carbonara','Alfredo','Lasagna','Garlic Bread');

-- Burger Hub
INSERT INTO menuItem (menuID, itemID)
SELECT m.menuID, i.itemID
FROM menus m
JOIN restaurants r ON r.restID = m.restID AND r.restName = 'Burger Hub'
JOIN items i ON i.itemName IN ('Cheeseburger','Bacon Burger','Veggie Burger','French Fries');

-- Spicy Garden
INSERT INTO menuItem (menuID, itemID)
SELECT m.menuID, i.itemID
FROM menus m
JOIN restaurants r ON r.restID = m.restID AND r.restName = 'Spicy Garden'
JOIN items i ON i.itemName IN ('Kung Pao Chicken','Mapo Tofu','Hotpot','Spring Rolls');

-- Vegan Paradise
INSERT INTO menuItem (menuID, itemID)
SELECT m.menuID, i.itemID
FROM menus m
JOIN restaurants r ON r.restID = m.restID AND r.restName = 'Vegan Paradise'
JOIN items i ON i.itemName IN ('Avocado Salad','Vegan Burger','Tofu Bowl','Coconut Smoothie');

-- Seafood Bay
INSERT INTO menuItem (menuID, itemID)
SELECT m.menuID, i.itemID
FROM menus m
JOIN restaurants r ON r.restID = m.restID AND r.restName = 'Seafood Bay'
JOIN items i ON i.itemName IN ('Grilled Salmon','Shrimp Pasta','Lobster Tail','Seafood Chowder');

-- =====================================================
--  STORED PROCEDURES
--  Purpose:
--    sp_user_order_profit : per-user order totals and platform profit (10%)
--    sp_revenue_range     : revenue & profit by date range, optional restaurant
-- =====================================================
DELIMITER //

DROP PROCEDURE IF EXISTS sp_user_order_profit//
CREATE PROCEDURE sp_user_order_profit(IN pUserId INT)
BEGIN
  SELECT o.orderID,
         o.orderTime,
         o.restID,
         r.restName,
         SUM(oi.quantity * i.itemPrice) AS totalAmount,
         ROUND(SUM(oi.quantity * i.itemPrice) * 0.10, 2) AS profit
  FROM orders o
  JOIN restaurants r ON r.restID = o.restID
  JOIN orderItems oi ON oi.orderID = o.orderID
  JOIN items i ON i.itemID = oi.itemID
  WHERE o.usrID = pUserId
    AND o.orderStatus <> 'cancelled'
  GROUP BY o.orderID, o.orderTime, o.restID, r.restName
  ORDER BY o.orderTime DESC;
END//

DROP PROCEDURE IF EXISTS sp_revenue_range//
CREATE PROCEDURE sp_revenue_range(
  IN pStart DATETIME,
  IN pEnd   DATETIME,
  IN pRestId INT
)
BEGIN
  SELECT r.restName,
         SUM(oi.quantity * i.itemPrice) AS totalAmount,
         ROUND(SUM(oi.quantity * i.itemPrice) * 0.10, 2) AS profit
  FROM orders o
  JOIN orderItems oi ON oi.orderID = o.orderID
  JOIN items i ON i.itemID = oi.itemID
  JOIN restaurants r ON r.restID = o.restID
  WHERE o.orderTime BETWEEN pStart AND pEnd
    AND (pRestId IS NULL OR o.restID = pRestId)
    AND o.orderStatus <> 'cancelled'
  GROUP BY r.restName;
END//

DELIMITER ;
