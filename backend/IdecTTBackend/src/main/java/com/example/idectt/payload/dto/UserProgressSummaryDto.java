package com.example.idectt.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProgressSummaryDto {
    private long totalLessons;
    private long completedLessons;
    private double completionPercentage;
    private boolean certificateEligible;
    private List<LessonProgressDto> recentActivity;
}
