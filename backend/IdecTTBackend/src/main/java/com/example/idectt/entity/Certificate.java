package com.example.idectt.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "certificates")
@Getter
@Setter
@NoArgsConstructor
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "certificate_number", unique = true, nullable = false)
    private String certificateNumber;

    @Column(name = "issued_at", nullable = false)
    private LocalDate issuedAt;

    @Column(name = "completion_percentage")
    private double completionPercentage;

    public Certificate(User user, String certificateNumber, LocalDate issuedAt, double completionPercentage) {
        this.user = user;
        this.certificateNumber = certificateNumber;
        this.issuedAt = issuedAt;
        this.completionPercentage = completionPercentage;
    }
}
