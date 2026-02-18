package com.example.idectt.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String username; // email
    private String fullName;
    private String phone;
    private List<String> roles;
    private Boolean isEmailVerified;
}
