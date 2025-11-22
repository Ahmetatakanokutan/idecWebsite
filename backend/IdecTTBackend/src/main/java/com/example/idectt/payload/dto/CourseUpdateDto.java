package com.example.idectt.payload.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseUpdateDto {
    private String title;
    private String description;
    private double rating;
    private int students;
    private Long instructorId;
}
