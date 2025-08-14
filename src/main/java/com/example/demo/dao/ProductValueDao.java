package com.example.demo.dao;

import com.example.demo.ProductValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductValueDao extends JpaRepository<ProductValue, Long> {
    List<ProductValue> findByProductId(Long productId);
}
