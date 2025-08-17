package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.authModel;

@Repository
public interface loginDao extends JpaRepository<authModel, Long> {
    java.util.Optional<authModel> findByTokenId(String tokenId);
    boolean existsByTokenId(String tokenId);
}