package com.example.idectt.controller;

import com.example.idectt.payload.dto.SeminarCertificateDto;
import com.example.idectt.service.SeminarCertificateService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/seminar-certificates")
public class SeminarCertificateController {

    private final SeminarCertificateService service;

    public SeminarCertificateController(SeminarCertificateService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SeminarCertificateDto>> list(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(service.list(q));
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        SeminarCertificateService.CertificateFile file = service.getFileForDownload(id);

        String asciiFallback = file.fullName().replaceAll("[^a-zA-Z0-9 ._-]", "_");
        String encoded = URLEncoder.encode(file.fullName() + ".pdf", StandardCharsets.UTF_8).replace("+", "%20");
        String contentDisposition = "attachment; filename=\"" + asciiFallback + ".pdf\"; filename*=UTF-8''" + encoded;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .contentType(MediaType.APPLICATION_PDF)
                .body(file.content());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "fullName", required = false) String fullName) {
        try {
            SeminarCertificateDto dto = service.create(file, fullName);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
