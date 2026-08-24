package com.example.idectt.repository;

import com.example.idectt.entity.SeminarCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeminarCertificateRepository extends JpaRepository<SeminarCertificate, Long> {
    List<SeminarCertificate> findAllByOrderByFullNameAsc();
    List<SeminarCertificate> findBySearchNameContainingOrderByFullNameAsc(String searchName);
}
