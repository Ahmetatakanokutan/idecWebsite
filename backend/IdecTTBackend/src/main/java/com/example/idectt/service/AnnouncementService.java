package com.example.idectt.service;

import com.example.idectt.entity.Announcement;
import com.example.idectt.repository.AnnouncementRepository;
import com.example.idectt.util.HtmlSanitizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    // limit verilmezse mevcut davranis (hepsi) korunur.
    public List<Announcement> getActiveAnnouncements(Integer limit) {
        if (limit != null && limit > 0) {
            return announcementRepository.findByActiveTrueOrderByCreatedAtDesc(PageRequest.of(0, limit));
        }
        return announcementRepository.findByActiveTrueOrderByCreatedAtDesc();
    }

    public List<Announcement> getArchivedAnnouncements() {
        return announcementRepository.findByActiveFalseOrderByCreatedAtDesc();
    }

    public Optional<Announcement> getAnnouncementById(Long id) {
        return announcementRepository.findById(id);
    }

    public Announcement createAnnouncement(Announcement announcement) {
        announcement.setContent(HtmlSanitizer.sanitize(announcement.getContent()));
        return announcementRepository.save(announcement);
    }

    public Announcement updateAnnouncement(Long id, Announcement announcementDetails) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        announcement.setTitle(announcementDetails.getTitle());
        announcement.setContent(HtmlSanitizer.sanitize(announcementDetails.getContent()));
        announcement.setImageUrl(announcementDetails.getImageUrl());
        announcement.setActive(announcementDetails.isActive());

        return announcementRepository.save(announcement);
    }

    public void deleteAnnouncement(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
        announcementRepository.delete(announcement);
    }
}
