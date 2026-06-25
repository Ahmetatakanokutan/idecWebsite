package com.example.idectt.controller;

import com.example.idectt.payload.dto.LessonProgressDto;
import com.example.idectt.payload.dto.UserProgressSummaryDto;
import com.example.idectt.payload.response.MessageResponse;
import com.example.idectt.repository.LessonRepository;
import com.example.idectt.security.services.UserDetailsImpl;
import com.example.idectt.service.LessonProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class LessonProgressController {

    private final LessonProgressService progressService;
    private final LessonRepository lessonRepository;

    public LessonProgressController(LessonProgressService progressService,
                                    LessonRepository lessonRepository) {
        this.progressService = progressService;
        this.lessonRepository = lessonRepository;
    }

    @PostMapping("/lesson/{lessonId}/watch")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> recordWatch(
            @PathVariable Long lessonId,
            @RequestBody Map<String, Long> body,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long courseId = body.get("courseId");
        if (courseId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("courseId is required"));
        }

        progressService.recordLessonWatch(userDetails.getId(), lessonId, courseId);
        return ResponseEntity.ok(new MessageResponse("Progress recorded"));
    }

    @PostMapping("/lesson/{lessonId}/complete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markComplete(
            @PathVariable Long lessonId,
            @RequestBody Map<String, Long> body,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long courseId = body.get("courseId");
        if (courseId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("courseId is required"));
        }

        progressService.markLessonCompleted(userDetails.getId(), lessonId, courseId);
        return ResponseEntity.ok(new MessageResponse("Lesson marked as completed"));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LessonProgressDto>> getCourseProgress(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(progressService.getUserProgressForCourse(userDetails.getId(), courseId));
    }

    @GetMapping("/summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProgressSummaryDto> getProgressSummary(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        long totalLessons = lessonRepository.count();
        return ResponseEntity.ok(progressService.getUserProgressSummary(userDetails.getId(), totalLessons));
    }
}
