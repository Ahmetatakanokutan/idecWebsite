package com.example.idectt.service;

import com.example.idectt.entity.SeminarCertificate;
import com.example.idectt.payload.dto.SeminarCertificateDto;
import com.example.idectt.repository.SeminarCertificateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SeminarCertificateService {

    private final SeminarCertificateRepository repository;
    private final Path storageLocation;

    public SeminarCertificateService(SeminarCertificateRepository repository) {
        this.repository = repository;
        // uploads/ klasorunden bilerek ayri: bu dizin WebConfig'te statik olarak
        // servis edilmiyor, dosyalara sadece auth kontrollu /download endpoint'i uzerinden erisilir.
        this.storageLocation = Paths.get("seminar-certificates").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.storageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Seminer sertifikaları için depolama dizini oluşturulamadı.", ex);
        }
    }

    @Transactional(readOnly = true)
    public List<SeminarCertificateDto> list(String q) {
        List<SeminarCertificate> certificates = (q == null || q.isBlank())
                ? repository.findAllByOrderByFullNameAsc()
                : repository.findBySearchNameContainingOrderByFullNameAsc(normalizeForSearch(q));
        return certificates.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public SeminarCertificateDto create(MultipartFile file, String fullNameOverride) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Dosya boş olamaz.");
        }

        String originalFilename = Optional.ofNullable(file.getOriginalFilename()).orElse("");
        boolean isPdfExtension = originalFilename.toLowerCase(Locale.ROOT).endsWith(".pdf");
        boolean isPdfContentType = "application/pdf".equalsIgnoreCase(Optional.ofNullable(file.getContentType()).orElse(""));
        if (!isPdfExtension && !isPdfContentType) {
            throw new IllegalArgumentException("Sadece PDF dosyası yüklenebilir.");
        }

        String fullName = (fullNameOverride != null && !fullNameOverride.isBlank())
                ? fullNameOverride.trim()
                : extractNameFromFilename(originalFilename);
        if (fullName.isBlank()) {
            throw new IllegalArgumentException("Ad soyad belirlenemedi, lütfen elle girin.");
        }

        String storedFileName = UUID.randomUUID() + ".pdf";
        try {
            Path target = storageLocation.resolve(storedFileName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new RuntimeException("Dosya kaydedilemedi: " + ex.getMessage(), ex);
        }

        SeminarCertificate saved = repository.save(
                new SeminarCertificate(fullName, normalizeForSearch(fullName), storedFileName)
        );
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public CertificateFile getFileForDownload(Long id) {
        SeminarCertificate certificate = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sertifika bulunamadı: " + id));
        try {
            byte[] content = Files.readAllBytes(storageLocation.resolve(certificate.getFilePath()));
            return new CertificateFile(content, certificate.getFullName());
        } catch (IOException ex) {
            throw new RuntimeException("Dosya okunamadı: " + ex.getMessage(), ex);
        }
    }

    @Transactional
    public void delete(Long id) {
        SeminarCertificate certificate = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sertifika bulunamadı: " + id));
        try {
            Files.deleteIfExists(storageLocation.resolve(certificate.getFilePath()));
        } catch (IOException ex) {
            // Diskteki dosya silinemese bile DB kaydını kaldırmaya devam ediyoruz.
        }
        repository.delete(certificate);
    }

    private String extractNameFromFilename(String originalFilename) {
        String base = originalFilename.replaceFirst("(?i)\\.pdf$", "");
        String[] tokens = base.split("[_\\-\\s]+");
        StringBuilder sb = new StringBuilder();
        for (String token : tokens) {
            if (token.isBlank() || token.matches("\\d+")) {
                continue;
            }
            if (sb.length() > 0) {
                sb.append(' ');
            }
            sb.append(token);
        }
        return sb.toString().trim();
    }

    // Locale-bagimli toLowerCase kullanmiyoruz cunku Turkce locale'de 'I' -> 'ı'
    // donusur (beklenmedik sonuc); bunun yerine Turkce karakterleri elle ASCII'ye eslestirip
    // kalanini Locale.ENGLISH ile kucuk harfe ceviriyoruz.
    private static String normalizeForSearch(String input) {
        if (input == null) {
            return "";
        }
        StringBuilder sb = new StringBuilder(input.length());
        for (char c : input.toCharArray()) {
            switch (c) {
                case 'ç': case 'Ç': sb.append('c'); break;
                case 'ş': case 'Ş': sb.append('s'); break;
                case 'ı': case 'I': case 'İ': sb.append('i'); break;
                case 'ğ': case 'Ğ': sb.append('g'); break;
                case 'ö': case 'Ö': sb.append('o'); break;
                case 'ü': case 'Ü': sb.append('u'); break;
                default: sb.append(c);
            }
        }
        return sb.toString().toLowerCase(Locale.ENGLISH);
    }

    private SeminarCertificateDto toDto(SeminarCertificate certificate) {
        return new SeminarCertificateDto(certificate.getId(), certificate.getFullName());
    }

    public record CertificateFile(byte[] content, String fullName) {}
}
