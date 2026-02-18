package com.example.idectt.security.services;

import com.example.idectt.entity.User; // Kendi User modelinizin yolu
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
@Getter
@Setter
public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String username;
    private String email;
    private String fullName; // Yeni alan

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String username, String email, String fullName, String password,
                           Collection<? extends GrantedAuthority> authorities) { // Constructor güncellendi
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName; // Yeni alan atandı
        this.password = password;
        this.authorities = authorities;
    }

    // Veritabanından gelen User nesnesini UserDetailsImpl nesnesine dönüştürür.
    public static UserDetailsImpl build(User user) {
        // user.getRoles() ve role.getName() metodlarının User ve Role sınıflarınızda var olduğundan emin olun.
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(), // fullName eklendi
                user.getPassword(),
                authorities);
    }

    // Getter'lar
    public Long getId() {
        return id;
    }

    public String getFullName() { // Yeni getter
        return fullName;
    }
    // Role.java içinde


    public String getEmail() {
        return email;
    }

    // UserDetails Arayüz Metotları
    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override public String getPassword() { return password; }
    @Override public String getUsername() { return username; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
