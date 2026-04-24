package com.example.idectt.controller;

import com.example.idectt.entity.ERole;
import com.example.idectt.entity.User;
import com.example.idectt.payload.dto.UserDto;
import com.example.idectt.payload.dto.UserUpdateDto;
import com.example.idectt.payload.response.MessageResponse;
import com.example.idectt.repository.CompanyProfileRepository;
import com.example.idectt.repository.EnrollmentRepository;
import com.example.idectt.repository.FavoriteRepository;
import com.example.idectt.repository.UserRepository;
import com.example.idectt.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private com.example.idectt.repository.RoleRepository roleRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    // === Admin Endpoints ===

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(user -> new UserDto(
                        user.getId(),
                        user.getUsername(),
                        user.getFullName(),
                        user.getPhone(),
                        // role.getName() returns String, simple and safe
                        user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toList()),
                        user.getIsEmailVerified()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Kendi hesabinizi silemezsiniz."));
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        boolean isAdminUser = user.getRoles() != null
                && user.getRoles().stream().anyMatch(role -> "ROLE_ADMIN".equals(role.getName()));
        if (isAdminUser && userRepository.countByRolesRoleName(ERole.ROLE_ADMIN) <= 1) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Son admin kullanici silinemez."));
        }

        try {
            // Clean dependent rows first to avoid FK violations.
            enrollmentRepository.deleteByUserId(id);
            favoriteRepository.deleteByUserId(id);
            companyProfileRepository.deleteByUserId(id);
            if (user.getRoles() != null) {
                user.getRoles().clear();
            }
            userRepository.save(user);
            userRepository.delete(user);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new MessageResponse("Kullanicinin bagli kayitlari oldugu icin silinemedi."));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserUpdateDto updateDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updateDto.getFullName() != null) user.setFullName(updateDto.getFullName());
        if (updateDto.getPhone() != null) user.setPhone(updateDto.getPhone());
        
        // Admin Updates
        if (updateDto.getEmail() != null && !updateDto.getEmail().equals(user.getUsername())) {
             if (userRepository.existsByUsername(updateDto.getEmail())) {
                 throw new RuntimeException("Error: Email is already in use!");
             }
             user.setUsername(updateDto.getEmail());
        }

        if (updateDto.getPassword() != null && !updateDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateDto.getPassword()));
        }

        if (updateDto.getIsEmailVerified() != null) {
            user.setIsEmailVerified(updateDto.getIsEmailVerified());
        }

        if (updateDto.getRoles() != null && !updateDto.getRoles().isEmpty()) {
            java.util.Set<com.example.idectt.entity.Role> newRoles = new java.util.HashSet<>();
            for (String roleName : updateDto.getRoles()) {
                 com.example.idectt.entity.ERole eRole;
                 try {
                     eRole = com.example.idectt.entity.ERole.valueOf(roleName);
                 } catch (IllegalArgumentException ex) {
                     throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role: " + roleName);
                 }
                 com.example.idectt.entity.Role role = roleRepository.findByRoleName(eRole)
                         .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " is not found."));
                 newRoles.add(role);
            }
            user.setRoles(newRoles);
        }

        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(new UserDto(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getFullName(),
                updatedUser.getPhone(),
                updatedUser.getRoles().stream().map(role -> role.getName()).collect(Collectors.toList()),
                updatedUser.getIsEmailVerified()
        ));
    }

    // === User Endpoints ===

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> getCurrentUserProfile() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(new UserDto(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getPhone(),
                user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toList()),
                user.getIsEmailVerified()
        ));
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> updateMyProfile(@RequestBody UserUpdateDto updateDto) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updateDto.getFullName() != null) user.setFullName(updateDto.getFullName());
        if (updateDto.getPhone() != null) user.setPhone(updateDto.getPhone());

        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(new UserDto(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getFullName(),
                updatedUser.getPhone(),
                updatedUser.getRoles().stream().map(role -> role.getName()).collect(Collectors.toList()),
                updatedUser.getIsEmailVerified()
        ));
    }
}
