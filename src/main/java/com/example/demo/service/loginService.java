package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.authModel;
import com.example.demo.dao.loginDao;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;

@Service
public class loginService {
    @Autowired
    loginDao loginDao;
    
    public List<authModel> login() {
        return loginDao.findAll();
    }
    
    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        LoginResponse response = new LoginResponse();
        
        // in loginDao as such there is no method called findByTokenId defined by in that file we can see 
        // that the class is extending from JpaRepository and JpaRepository has a method called findByTokenId
        // so we can use that method to find the user by tokenId
        Optional<authModel> user = loginDao.findByTokenId(loginRequest.getTokenId());
        
        if (user.isPresent()) {
            authModel foundUser = user.get();
            if (foundUser.getPassword().equals(loginRequest.getPassword())) {
                response.setSuccess(true);
                response.setMessage("Login successful!");
                response.setTokenId(foundUser.getTokenId());
            } else {
                response.setSuccess(false);
                response.setMessage("Invalid password!");
            }
        } else {
            response.setSuccess(false);
            response.setMessage("User not found!");
        }
        
        return response;
    }
}
