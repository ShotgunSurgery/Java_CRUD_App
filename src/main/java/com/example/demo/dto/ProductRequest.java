package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProductRequest {
    private String productName;
    private List<ParameterDefinition> parameters;
    
    @Data
    public static class ParameterDefinition {
        private String parameterName;
        private String dataType;
        private String range;
    }
}
