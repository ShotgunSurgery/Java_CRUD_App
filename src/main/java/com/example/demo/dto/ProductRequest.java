package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProductRequest {
    private String productName;
    private List<ParameterDefinition> parameters;
    private Long productId;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
    
    @Data
    public static class ParameterDefinition {
        private String parameterName;
        private String dataType;
        private String range;
    }
}
