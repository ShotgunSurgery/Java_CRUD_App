package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProductValueRequest {
    private Long productId;
    private List<ValueEntry> values;
    
    @Data
    public static class ValueEntry {
        private String name;
        private Long parameterId;
        private String value;
    }
}
