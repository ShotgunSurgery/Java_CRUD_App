package com.example.demo;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "product_parameters")
public class ProductParameter {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    
    private String parameterName;
    private String dataType;
    
    @Column(name = "parameter_range")
    private String range;
    
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
