


package com.example.demo.dao;

import com.example.demo.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDao extends JpaRepository<Product, Long> {
    Product findByProductName(String productName);
}