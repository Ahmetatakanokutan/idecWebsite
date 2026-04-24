package com.example.idectt.controller;

import com.example.idectt.entity.CompanyProfile;
import com.example.idectt.entity.ERole;
import com.example.idectt.entity.Role;
import com.example.idectt.entity.User;
import com.example.idectt.payload.request.LoginRequest;
import com.example.idectt.payload.request.RegisterRequest;
import com.example.idectt.payload.response.JwtResponse;
import com.example.idectt.payload.response.MessageResponse;
import com.example.idectt.repository.RoleRepository;
import com.example.idectt.repository.UserRepository;
import com.example.idectt.service.EmailVerificationService;
import com.example.idectt.security.jwt.JwtUtils;
import com.example.idectt.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import java.net.URI;
import java.util.HashSet;
import java.util.Hashtable;
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
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    EmailVerificationService emailVerificationService;

    @Value("${idectt.app.frontendBaseUrl:http://localhost:5173}")
    private String frontendBaseUrl;

    @GetMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestParam("code") String code,
                                        @RequestParam(value = "mode", defaultValue = "redirect") String mode) {
        User user = userRepository.findByVerificationCode(code).orElse(null);
        boolean apiMode = "api".equalsIgnoreCase(mode);

        if (user == null) {
            if (apiMode) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid verification code."));
            }
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(buildFrontendRedirectUrl("error")))
                    .build();
        }

        user.setIsEmailVerified(true);
        user.setVerificationCode(null); // Clear code after use
        userRepository.save(user);

        if (!apiMode) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(buildFrontendRedirectUrl("success")))
                    .build();
        }
        return ResponseEntity.ok(new MessageResponse("Email verified successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        User existingUser = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);
        if (existingUser != null && !Boolean.TRUE.equals(existingUser.getIsEmailVerified())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Please verify your email before logging in."));
        }

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
        final String genericRegistrationMessage = "If the email can be registered, a verification email will be sent.";

        if (!isValidEmailDomain(registerRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Invalid email domain. Please use a real email address."));
        }

        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.ok(new MessageResponse(genericRegistrationMessage));
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
                if (isBlank(registerRequest.getCompanyName()) || isBlank(registerRequest.getTaxId()) || isBlank(registerRequest.getSector())) {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Error: Company name, tax ID and sector are required for corporate registration."));
                }

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
        
        // Generate Verification Code
        String verificationCode = java.util.UUID.randomUUID().toString();
        user.setVerificationCode(verificationCode);
        user.setIsEmailVerified(false);
        
        userRepository.save(user);

        try {
            emailVerificationService.sendVerificationEmail(user.getUsername(), verificationCode);
        } catch (MailException | IllegalStateException ex) {
            userRepository.delete(user);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error: Verification email could not be sent. Please try again."));
        }

        return ResponseEntity.ok(new MessageResponse(genericRegistrationMessage));
    }

    private boolean isValidEmailDomain(String email) {
        try {
            String domain = email.substring(email.indexOf('@') + 1);
            Hashtable<String, String> env = new Hashtable<>();
            env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");
            DirContext ctx = new InitialDirContext(env);
            Attributes attrs = ctx.getAttributes(domain, new String[] { "MX" });
            Attribute attr = attrs.get("MX");
            return attr != null && attr.size() > 0;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String buildFrontendRedirectUrl(String verifiedStatus) {
        String baseUrl = frontendBaseUrl == null ? "" : frontendBaseUrl.trim();
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        return baseUrl + "/login?verified=" + verifiedStatus;
    }
}
