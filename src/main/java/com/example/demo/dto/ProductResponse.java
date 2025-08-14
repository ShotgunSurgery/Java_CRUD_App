package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProductResponse {
    private Long id;
    private String productName;
    private List<ParameterInfo> parameters;
    
    @Data
    public static class ParameterInfo {
        private Long id;
        private String parameterName;
        private String dataType;
        private String range;
    }
}
