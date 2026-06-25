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
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "lesson_id"})
})
@Getter
@Setter
@NoArgsConstructor
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "first_watched_at")
    private LocalDateTime firstWatchedAt;

    @Column(name = "last_watched_at")
    private LocalDateTime lastWatchedAt;

    @Column(name = "watch_count")
    private int watchCount = 0;

    @Column(name = "is_completed")
    private boolean completed = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public LessonProgress(User user, Lesson lesson, Long courseId) {
        this.user = user;
        this.lesson = lesson;
        this.courseId = courseId;
        this.firstWatchedAt = LocalDateTime.now();
        this.lastWatchedAt = LocalDateTime.now();
    }
}
