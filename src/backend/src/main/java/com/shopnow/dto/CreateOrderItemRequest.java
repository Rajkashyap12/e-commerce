package com.shopnow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderItemRequest {
    private String productId;
    private Integer quantity;
    private Double price;
}
