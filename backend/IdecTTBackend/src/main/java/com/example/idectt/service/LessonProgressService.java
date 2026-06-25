package com.example.idectt.service;

import com.example.idectt.entity.Lesson;
import com.example.idectt.entity.LessonProgress;
import com.example.idectt.entity.User;
import com.example.idectt.payload.dto.LessonProgressDto;
import com.example.idectt.payload.dto.UserProgressSummaryDto;
import com.example.idectt.repository.LessonProgressRepository;
import com.example.idectt.repository.LessonRepository;
import com.example.idectt.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LessonProgressService {

    private final LessonProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;

    public LessonProgressService(LessonProgressRepository progressRepository,
                                 LessonRepository lessonRepository,
                                 UserRepository userRepository) {
        this.progressRepository = progressRepository;
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public LessonProgress recordLessonWatch(Long userId, Long lessonId, Long courseId) {
        LessonProgress progress = progressRepository.findByUserIdAndLessonId(userId, lessonId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Lesson lesson = lessonRepository.findById(lessonId)
                            .orElseThrow(() -> new RuntimeException("Lesson not found"));
                    return new LessonProgress(user, lesson, courseId);
                });

        LocalDateTime now = LocalDateTime.now();
        if (progress.getFirstWatchedAt() == null) {
            progress.setFirstWatchedAt(now);
        }
        progress.setLastWatchedAt(now);
        progress.setWatchCount(progress.getWatchCount() + 1);

        return progressRepository.save(progress);
    }

    @Transactional
    public LessonProgress markLessonCompleted(Long userId, Long lessonId, Long courseId) {
        LessonProgress progress = recordLessonWatch(userId, lessonId, courseId);
        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
        }
        return progressRepository.save(progress);
    }

    @Transactional(readOnly = true)
    public List<LessonProgressDto> getUserProgressForCourse(Long userId, Long courseId) {
        return progressRepository.findByUserIdAndCourseId(userId, courseId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserProgressSummaryDto getUserProgressSummary(Long userId, long totalLessonsInPlatform) {
        long completed = progressRepository.countCompletedLessonsByUser(userId);
        double pct = totalLessonsInPlatform > 0
                ? (completed * 100.0 / totalLessonsInPlatform)
                : 0.0;
        boolean eligible = pct >= 80.0;

        List<LessonProgressDto> recent = progressRepository
                .findByUserIdOrderByLastWatchedAtDesc(userId)
                .stream()
                .limit(10)
                .map(this::toDto)
                .collect(Collectors.toList());

        return new UserProgressSummaryDto(totalLessonsInPlatform, completed, pct, eligible, recent);
    }

    private LessonProgressDto toDto(LessonProgress progress) {
        Lesson lesson = progress.getLesson();
        String lessonTitle = lesson != null ? lesson.getTitle() : "";
        String courseTitle = "";
        if (lesson != null && lesson.getSection() != null && lesson.getSection().getCourse() != null) {
            courseTitle = lesson.getSection().getCourse().getTitle();
        }

        return new LessonProgressDto(
                lesson != null ? lesson.getId() : null,
                lessonTitle,
                progress.getCourseId(),
                courseTitle,
                progress.isCompleted(),
                progress.getFirstWatchedAt(),
                progress.getLastWatchedAt(),
                progress.getWatchCount()
        );
    }
}
