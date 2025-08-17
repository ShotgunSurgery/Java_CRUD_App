package com.example.demo.service;

import com.example.demo.*;
import com.example.demo.dao.*;
import com.example.demo.dto.*;
import com.example.demo.dto.ProductParameterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    
    @Autowired
    private ProductDao productDao;
    
    @Autowired
    private ProductParameterDao parameterDao;
    
    @Autowired
    private ProductValueDao valueDao;

    // public ProductsOnly 
    
    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        product.setProductName(request.getProductName());
        Product savedProduct = productDao.save(product);
        
        List<ProductParameter> parameters = request.getParameters().stream()
            .map(paramDef -> {
                ProductParameter param = new ProductParameter();
                param.setParameterName(paramDef.getParameterName());
                param.setDataType(paramDef.getDataType());
                param.setRange(paramDef.getRange());
                param.setProduct(savedProduct);
                return parameterDao.save(param);
            })
            .collect(Collectors.toList());
        
        return convertToResponse(savedProduct, parameters);
    }
    
    public ProductResponse getProduct(Long productId) {
        Product product = productDao.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        List<ProductParameter> parameters = parameterDao.findByProductId(productId);
        return convertToResponse(product, parameters);
    }
    
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productDao.findAll();
        return products.stream()
            .map(product -> {
                List<ProductParameter> parameters = parameterDao.findByProductId(product.getId());
                return convertToResponse(product, parameters);
            })
            .collect(Collectors.toList());
    }
    
    public void saveProductValues(ProductValueRequest request) {
        List<ProductValue> values = request.getValues().stream()
            .map(valueEntry -> {
                ProductValue value = new ProductValue();
                value.setName(valueEntry.getName());
                value.setValue(valueEntry.getValue());
                value.setProduct(productDao.findById(request.getProductId()).orElse(null));
                value.setParameter(parameterDao.findById(valueEntry.getParameterId()).orElse(null));
                return valueDao.save(value);
            })
            .collect(Collectors.toList());
    }
    
    public List<ProductValueResponse> getProductValues(Long productId) {
        List<ProductValue> values = valueDao.findByProductId(productId);
        return values.stream()
            .map(this::convertToValueResponse)
            .collect(Collectors.toList());
    }

    public void deleteProductValue(Long valueId) {
        ProductValue value = valueDao.findById(valueId)
            .orElseThrow(() -> new RuntimeException("Product value not found"));
        valueDao.delete(value);
    }
    
    public ProductResponse updateProductParameters(ProductRequest request) {
        Product product = productDao.findById(request.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Update product name if provided
        if (request.getProductName() != null && !request.getProductName().isEmpty()) {
            product.setProductName(request.getProductName());
            productDao.save(product);
        }
        
        // Delete existing parameters
        List<ProductParameter> existingParameters = parameterDao.findByProductId(request.getProductId());
        parameterDao.deleteAll(existingParameters);
        
        // Create new parameters
        List<ProductParameter> parameters = request.getParameters().stream()
            .map(paramDef -> {
                ProductParameter param = new ProductParameter();
                param.setParameterName(paramDef.getParameterName());
                param.setDataType(paramDef.getDataType());
                param.setRange(paramDef.getRange());
                param.setProduct(product);
                return parameterDao.save(param);
            })
            .collect(Collectors.toList());
        
        return convertToResponse(product, parameters);
    }

    // Add these new methods
    public void deleteParameter(Long parameterId) {
        ProductParameter parameter = parameterDao.findById(parameterId)
            .orElseThrow(() -> new RuntimeException("Parameter not found"));
        
        // Delete associated values first
        List<ProductValue> associatedValues = valueDao.findByParameterId(parameterId);
        valueDao.deleteAll(associatedValues);
        
        // Delete the parameter
        parameterDao.delete(parameter);
    }

    public ProductResponse updateParameter(Long parameterId, ProductParameterRequest request) {
        ProductParameter parameter = parameterDao.findById(parameterId)
            .orElseThrow(() -> new RuntimeException("Parameter not found"));
        
        parameter.setParameterName(request.getParameterName());
        parameter.setDataType(request.getDataType());
        parameter.setRange(request.getRange());
        
        parameterDao.save(parameter);
        
        // Return updated product with all parameters
        Product product = parameter.getProduct();
        List<ProductParameter> parameters = parameterDao.findByProductId(product.getId());
        return convertToResponse(product, parameters);
    }

    public ProductResponse addParameter(Long productId, ProductParameterRequest request) {
        Product product = productDao.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        ProductParameter parameter = new ProductParameter();
        parameter.setParameterName(request.getParameterName());
        parameter.setDataType(request.getDataType());
        parameter.setRange(request.getRange());
        parameter.setProduct(product);
        
        parameterDao.save(parameter);
        
        // Return updated product with all parameters
        List<ProductParameter> parameters = parameterDao.findByProductId(productId);
        return convertToResponse(product, parameters);
    }
    
    private ProductResponse convertToResponse(Product product, List<ProductParameter> parameters) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setProductName(product.getProductName());
        
        List<ProductResponse.ParameterInfo> paramInfos = parameters.stream()
            .map(param -> {
                ProductResponse.ParameterInfo info = new ProductResponse.ParameterInfo();
                info.setId(param.getId());
                info.setParameterName(param.getParameterName());
                info.setDataType(param.getDataType());
                info.setRange(param.getRange());
                return info;
            })
            .collect(Collectors.toList());
        
        response.setParameters(paramInfos);
        return response;
    }
    
    private ProductValueResponse convertToValueResponse(ProductValue value) {
        ProductValueResponse response = new ProductValueResponse();
        response.setId(value.getId());
        response.setName(value.getName());
        response.setValue(value.getValue());
        
        if (value.getParameter() != null) {
            response.setParameterName(value.getParameter().getParameterName());
        } else {
            response.setParameterName("Unknown Parameter");
        }
        
        return response;
    }
}
