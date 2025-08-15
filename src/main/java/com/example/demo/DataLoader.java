package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.demo.dao.loginDao;
import com.example.demo.dao.ProductDao;
import com.example.demo.dao.ProductParameterDao;
import com.example.demo.dao.ProductValueDao;

@Component
public class DataLoader implements CommandLineRunner {
    
    @Autowired
    private loginDao loginDao;
    
    @Autowired
    private ProductDao productDao;
    
    @Autowired
    private ProductParameterDao parameterDao;
    
    @Autowired
    private ProductValueDao valueDao;
    
    @Override
    public void run(String... args) throws Exception {
        // Only create test users if they don't already exist
        if (!loginDao.existsByTokenId("admin123")) {
            authModel admin1 = new authModel();
            admin1.setTokenId("admin123");
            admin1.setPassword("password123");
            loginDao.save(admin1);
        }
    
        if (!loginDao.existsByTokenId("user456")) {
            authModel admin2 = new authModel();
            admin2.setTokenId("user456");
            admin2.setPassword("secret456");
            loginDao.save(admin2);
        }
    
        // Create sample product only once
        Product sampleProduct = productDao.findByProductName("Sample Product");
        if (sampleProduct == null) {
            sampleProduct = new Product();
            sampleProduct.setProductName("Sample Product");
            sampleProduct = productDao.save(sampleProduct);
    
            ProductParameter param1 = new ProductParameter();
            param1.setParameterName("Size");
            param1.setDataType("String");
            param1.setRange("Small, Medium, Large");
            param1.setProduct(sampleProduct);
            parameterDao.save(param1);
    
            ProductParameter param2 = new ProductParameter();
            param2.setParameterName("Weight");
            param2.setDataType("Number");
            param2.setRange("1-100 kg");
            param2.setProduct(sampleProduct);
            parameterDao.save(param2);
        }
    
        System.out.println("Test data loaded successfully!");
    }}