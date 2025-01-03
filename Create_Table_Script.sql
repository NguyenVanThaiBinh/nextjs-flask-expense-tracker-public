
DROP TABLE User_Expense;

DELETE FROM Expense
WHERE user_email = 'nguyenvanthaibinh2210@gmail.com';
DELETE FROM Category
WHERE user_email = 'nguyenvanthaibinh2210@gmail.com';
DELETE FROM User_Expense
WHERE user_email = 'nguyenvanthaibinh2210@gmail.com';

UPDATE User_Expense set isVN_language = FALSE 
WHERE user_email = 'nguyenvanthaibinh2210@gmail.com';
-- Create User table
CREATE TABLE User_Expense (
  user_email VARCHAR NOT NULL UNIQUE PRIMARY KEY,
  user_name VARCHAR(30) NOT NULL,
  user_avatar VARCHAR,
  isVN_language BOOLEAN NOT NULL DEFAULT TRUE,
  default_wallet_id DECIMAL(10, 0) DEFAULT 0,
  del_flag BOOLEAN NOT NULL DEFAULT FALSE
);

DELETE FROM Category
WHERE user_email = 'nguyenvanthaibinh2210@gmail.com';
-- Create Category table
CREATE TABLE Category (
  category_id SERIAL PRIMARY KEY,
  user_email VARCHAR NOT NULL CHECK (user_email <> '') REFERENCES User_Expense(user_email),
  icon VARCHAR(30) NOT NULL CHECK (icon <> ''),
  category_name VARCHAR(40) NOT NULL CHECK (category_name <> ''),
  type_category VARCHAR(40) NOT NULL DEFAULT 'expense',
  del_flag BOOLEAN NOT NULL DEFAULT FALSE
);


UPDATE Wallet
SET wallet_balance = ROUND(wallet_balance * 165 / 1000) * 1000
WHERE user_email = 'nguyenvanthaibinh2210@gmail.com';

DROP TABLE Wallet;

DELETE FROM Wallet
WHERE user_email = 'nguyenvanthaibinh2210@gmail.com';
-- Create Wallet table
CREATE TABLE Wallet (
  wallet_id SERIAL PRIMARY KEY,
  user_email VARCHAR REFERENCES User_Expense(user_email),
  wallet_name VARCHAR(40) NOT NULL CHECK (wallet_name <> ''),
  wallet_balance DECIMAL(10, 0) NOT NULL DEFAULT 0,
  wallet_description VARCHAR(40) NOT NULL,
  del_flag BOOLEAN NOT NULL DEFAULT FALSE
);


SELECT 
extract(year from expense_created_at) as year,
extract(month from expense_created_at) as month,
extract(day from expense_created_at) as date,
extract(hour from expense_created_at) as hour ,
extract(minute from expense_created_at) as minute ,
extract(second from expense_created_at) as second 
 FROM Expense ;

select sum(expense_amount) from Expense, Category
where Expense.category_id = Category.category_id
and Category.type_category = 'expense'
and extract(year from Expense.expense_created_at) =2024
and extract(month from Expense.expense_created_at) = 07
and Expense.user_email = 'nguyenvanthaibinh2210@gmail.com';

-- Create Expense table
CREATE TABLE Expense (
  expense_id SERIAL PRIMARY KEY,
  user_email VARCHAR NOT NULL REFERENCES User_Expense(user_email),
  category_id INTEGER REFERENCES Category(category_id),
  wallet_id INTEGER REFERENCES Wallet(wallet_id),
  expense_amount DECIMAL(10, 0) NOT NULL,
  expense_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expense_description VARCHAR(40),
  del_flag BOOLEAN NOT NULL DEFAULT FALSE
);
