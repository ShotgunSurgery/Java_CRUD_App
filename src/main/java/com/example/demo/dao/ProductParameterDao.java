package com.example.demo.dao;

import com.example.demo.ProductParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductParameterDao extends JpaRepository<ProductParameter, Long> {
    List<ProductParameter> findByProductId(Long productId);
}
