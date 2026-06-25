package com.example.idectt.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LessonProgressDto {
    private Long lessonId;
    private String lessonTitle;
    private Long courseId;
    private String courseTitle;
    private boolean completed;
    private LocalDateTime firstWatchedAt;
    private LocalDateTime lastWatchedAt;
    private int watchCount;
}
