package com.example.idectt.controller;

import com.example.idectt.entity.CompanyProfile;
import com.example.idectt.entity.ERole;
import com.example.idectt.entity.Role;
import com.example.idectt.entity.User;
import com.example.idectt.payload.request.LoginRequest;
import com.example.idectt.payload.request.RegisterRequest;
import com.example.idectt.payload.response.JwtResponse;
import com.example.idectt.payload.response.MessageResponse;
import com.example.idectt.repository.CompanyProfileRepository;
import com.example.idectt.repository.RoleRepository;
import com.example.idectt.repository.UserRepository;
import com.example.idectt.security.jwt.JwtUtils;
import com.example.idectt.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    CompanyProfileRepository companyProfileRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getFullName(),
                roles));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Passwords do not match!"));
        }

        // Create new user's account
        User user = new User(registerRequest.getUsername(),
                encoder.encode(registerRequest.getPassword()),
                registerRequest.getFullName(),
                registerRequest.getPhone());

        Set<Role> roles = new HashSet<>();

        if (registerRequest.getUserType() == null) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User type not specified!"));
        }

        switch (registerRequest.getUserType()) {
            case "corporate":
                Role companyRole = roleRepository.findByRoleName(ERole.ROLE_COMPANY)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(companyRole);

                // Create company profile
                CompanyProfile companyProfile = new CompanyProfile();
                companyProfile.setCompanyName(registerRequest.getCompanyName());
                companyProfile.setTaxId(registerRequest.getTaxId());
                companyProfile.setSector(registerRequest.getSector());
                companyProfile.setUser(user); // Link company profile to user
                user.setCompanyProfile(companyProfile); // Link user to company profile
                break;
            case "individual":
                Role userRole = roleRepository.findByRoleName(ERole.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(userRole);
                // Optionally set profession for individual users
                // user.setProfession(registerRequest.getProfession());
                break;
            default:
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Invalid user type!"));
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
