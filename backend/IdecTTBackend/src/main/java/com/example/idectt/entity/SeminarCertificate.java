package com.example.idectt.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "seminar_certificates")
@Getter
@Setter
@NoArgsConstructor
public class SeminarCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    // fullName'in kucuk harfe cevrilmis, Turkce karakterleri ASCII'ye
    // donusturulmus hali. Arama bu alan uzerinden yapilir.
    @Column(nullable = false)
    private String searchName;

    // Depolama dizinindeki dosya adi (uploads klasorunden ayri, herkese acik degil).
    @Column(nullable = false)
    private String filePath;

    public SeminarCertificate(String fullName, String searchName, String filePath) {
        this.fullName = fullName;
        this.searchName = searchName;
        this.filePath = filePath;
    }
}
