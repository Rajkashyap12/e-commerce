package com.shopnow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDto {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
}
