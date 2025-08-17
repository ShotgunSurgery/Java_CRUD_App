package com.example.demo.dto;

import lombok.Data;

@Data
public class ProductParameterRequest {
    private Long id;
    private String parameterName;
    private String dataType;
    private String range;
}
