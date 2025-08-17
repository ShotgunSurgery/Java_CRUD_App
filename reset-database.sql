-- Reset Database Tables
-- Run this in MySQL to clean up and recreate tables

USE dummy2o;

-- Drop existing tables in correct order (due to foreign key constraints)
DROP TABLE IF EXISTS product_values;
DROP TABLE IF EXISTS product_parameters;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS auth_model;

-- Tables will be recreated automatically by Spring Boot when you restart the application
