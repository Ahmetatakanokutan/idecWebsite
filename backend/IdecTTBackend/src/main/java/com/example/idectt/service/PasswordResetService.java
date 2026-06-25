package com.example.idectt.service;

import com.example.idectt.entity.User;
import com.example.idectt.repository.UserRepository;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final PasswordEncoder passwordEncoder;
    private final boolean mailEnabled;
    private final String fromAddress;
    private final String frontendBaseUrl;

    public PasswordResetService(
            UserRepository userRepository,
            ObjectProvider<JavaMailSender> mailSenderProvider,
            PasswordEncoder passwordEncoder,
            @Value("${idectt.mail.enabled:false}") boolean mailEnabled,
            @Value("${idectt.mail.from:}") String fromAddress,
            @Value("${idectt.app.frontendBaseUrl:http://localhost:5173}") String frontendBaseUrl) {
        this.userRepository = userRepository;
        this.mailSenderProvider = mailSenderProvider;
        this.passwordEncoder = passwordEncoder;
        this.mailEnabled = mailEnabled;
        this.fromAddress = fromAddress;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @Transactional
    public void initiatePasswordReset(String email) {
        User user = userRepository.findByUsername(email).orElse(null);
        if (user == null || !Boolean.TRUE.equals(user.getIsEmailVerified())) {
            return;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (!mailEnabled || mailSender == null || isBlank(fromAddress)) {
            return;
        }

        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        String resetUrl = buildResetUrl(token);

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(fromAddress);
        mail.setTo(email);
        mail.setSubject("IDEC-TT — Şifre Sıfırlama / Password Reset");
        mail.setText(
                "Merhaba,\n\n" +
                "IDEC-TT platformu için şifre sıfırlama talebinde bulundunuz.\n" +
                "Aşağıdaki bağlantıya tıklayarak yeni şifrenizi belirleyebilirsiniz:\n\n" +
                resetUrl + "\n\n" +
                "Bu bağlantı 1 saat geçerlidir.\n" +
                "Eğer bu talebi siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.\n\n" +
                "---\n" +
                "Hello,\n\n" +
                "You requested a password reset for your IDEC-TT account.\n" +
                "Click the link below to set a new password:\n\n" +
                resetUrl + "\n\n" +
                "This link is valid for 1 hour.\n" +
                "If you did not request this, please ignore this email.\n"
        );

        mailSender.send(mail);
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token).orElse(null);
        if (user == null) {
            return false;
        }
        if (user.getPasswordResetTokenExpiry() == null ||
                user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return false;
        }
        if (newPassword == null || newPassword.length() < 8) {
            return false;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);
        return true;
    }

    private String buildResetUrl(String token) {
        String base = frontendBaseUrl == null ? "" : frontendBaseUrl.trim();
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        return base + "/reset-password?token=" + token;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
