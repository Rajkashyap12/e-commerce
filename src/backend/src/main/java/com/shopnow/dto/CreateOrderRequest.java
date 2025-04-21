package com.shopnow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private String userId;
    private List<CreateOrderItemRequest> items;
    private Double totalAmount;
    private String shippingAddress;
    private String paymentMethod;
}
