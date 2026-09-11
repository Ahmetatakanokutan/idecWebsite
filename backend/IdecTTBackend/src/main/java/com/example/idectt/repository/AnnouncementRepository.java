package com.example.idectt.repository;

import com.example.idectt.entity.Announcement;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByActiveTrueOrderByCreatedAtDesc();
    // limit verildiginde SQL'e kadar iner (Pageable -> LIMIT), gereksiz satir cekilmez.
    List<Announcement> findByActiveTrueOrderByCreatedAtDesc(Pageable pageable);
    List<Announcement> findByActiveFalseOrderByCreatedAtDesc();
}
