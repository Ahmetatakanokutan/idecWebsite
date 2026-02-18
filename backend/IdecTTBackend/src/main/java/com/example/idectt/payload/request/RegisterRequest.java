package com.example.idectt.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String fullName;

    @NotBlank
    @Size(max = 50)
    @Email
    private String username; // Using email as username

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    @Size(min = 6, max = 40)
    private String confirmPassword;

    @Size(max = 20)
    private String phone;

    @NotBlank
    private String userType; // "individual" or "corporate"

    // Corporate specific fields
    private String companyName;
    private String taxId;
    private String sector;

    // Individual specific fields
    private String profession;
}
