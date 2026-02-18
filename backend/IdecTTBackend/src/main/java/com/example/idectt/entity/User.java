package com.example.idectt.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Email
    private String username; // Using email as username

    @NotBlank
    @Size(max = 120)
    private String password;

    @NotBlank
    @Size(max = 100)
    private String fullName;

    @Size(max = 20)
    private String phone;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @Column(name = "is_email_verified")
    private Boolean isEmailVerified = false;

    @Column(name = "verification_code")
    private String verificationCode;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private CompanyProfile companyProfile;

    public User(String username, String password, String fullName, String phone) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.phone = phone;
    }

    // User.java içinde
    public String getEmail() {
        return this.username;
    }

}
