package com.example.idectt.service;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class EmailVerificationService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final boolean mailEnabled;
    private final String fromAddress;
    private final String backendBaseUrl;

    public EmailVerificationService(ObjectProvider<JavaMailSender> mailSenderProvider,
                                    @Value("${idectt.mail.enabled:false}") boolean mailEnabled,
                                    @Value("${idectt.mail.from:}") String fromAddress,
                                    @Value("${idectt.app.backendBaseUrl:http://localhost:8080}") String backendBaseUrl) {
        this.mailSenderProvider = mailSenderProvider;
        this.mailEnabled = mailEnabled;
        this.fromAddress = fromAddress;
        this.backendBaseUrl = backendBaseUrl;
    }

    public void sendVerificationEmail(String recipientEmail, String verificationCode) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (!mailEnabled || mailSender == null || isBlank(fromAddress)) {
            throw new IllegalStateException("Email verification service is not configured.");
        }

        String verificationUrl = buildVerificationUrl(verificationCode);

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(fromAddress);
        mail.setTo(recipientEmail);
        mail.setSubject("IDEC-TT Email Verification");
        mail.setText(
                "Hello,\n\n" +
                "Thank you for registering on IDEC-TT.\n" +
                "Please verify your email address by clicking the link below:\n\n" +
                verificationUrl + "\n\n" +
                "If you did not create this account, you can safely ignore this email.\n"
        );

        mailSender.send(mail);
    }

    private String buildVerificationUrl(String verificationCode) {
        String baseUrl = backendBaseUrl == null ? "" : backendBaseUrl.trim();
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        String code = URLEncoder.encode(verificationCode, StandardCharsets.UTF_8);
        return baseUrl + "/api/auth/verify?code=" + code;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
