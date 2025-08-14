// data access object (dao) -> design pattern in java -> a layer whoose job is to talk to db
package com.example.demo.dao;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.authModel;

@Repository
public interface loginDao extends JpaRepository<authModel, Long> {
    Optional<authModel> findByTokenId(String tokenId);
}
