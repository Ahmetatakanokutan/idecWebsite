package com.example.idectt.payload.dto;

import lombok.Data;

@Data
public class UserUpdateDto {
    private String fullName;
    private String phone;
    
    // Admin fields
    private String email;
    private String password;
    private Boolean isEmailVerified;
    private java.util.List<String> roles;
}
