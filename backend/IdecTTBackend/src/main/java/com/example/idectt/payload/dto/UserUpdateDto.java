package com.example.idectt.payload.dto;

import lombok.Data;

@Data
public class UserUpdateDto {
    private String fullName;
    private String phone;
    // Password update usually requires a separate flow or current password verification
    // For simplicity, we'll stick to basic info first
}
