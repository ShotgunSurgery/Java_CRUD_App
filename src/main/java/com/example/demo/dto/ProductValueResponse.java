package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProductValueResponse {
    private Long id;
    private String name;
    private String value;
    private String parameterName;
}
