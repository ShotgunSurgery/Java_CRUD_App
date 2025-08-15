package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.authModel;
import com.example.demo.Product;
import com.example.demo.dto.*;
import com.example.demo.service.loginService;
import com.example.demo.service.ProductService;

@RestController
@RequestMapping("login")
@CrossOrigin(origins = "*")
public class mainController {
    
    @Autowired
    loginService loginService;
    
    @Autowired  
    ProductService productService;
    
    @GetMapping("admin")
    public List<authModel> admin_login(){
        return loginService.login();
    }
    
    @GetMapping("productsonly")
    public ResponseEntity<List<ProductResponse>> getAllProductsonly() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }   

    @PostMapping("authenticate")
    //wrapper class for the response
    //@RequestBody -> http -> java object
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = loginService.authenticateUser(loginRequest);
        //static factory method -> ok
        return ResponseEntity.ok(response);
    }
    
    // Product endpoints
    @PostMapping("products")
    //spring class
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("products")
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("products/{productId}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long productId) {
        ProductResponse product = productService.getProduct(productId);
        return ResponseEntity.ok(product);
    }
    
    @PostMapping("products/{productId}/values")
    public ResponseEntity<String> saveProductValues(@PathVariable Long productId, @RequestBody ProductValueRequest request) {
        request.setProductId(productId);
        productService.saveProductValues(request);
        return ResponseEntity.ok("Values saved successfully");
    }
    
    @GetMapping("products/{productId}/values")
    public ResponseEntity<List<ProductValueResponse>> getProductValues(@PathVariable Long productId) {
        List<ProductValueResponse> values = productService.getProductValues(productId);
        return ResponseEntity.ok(values);
    }

    @DeleteMapping("products/{productId}/values/{valueId}")
    public ResponseEntity<String> deleteProductValue(@PathVariable Long productId, @PathVariable Long valueId) {
        productService.deleteProductValue(valueId);
        return ResponseEntity.ok("Value deleted successfully");
    }
}
