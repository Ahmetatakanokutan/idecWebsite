package com.example.idectt.payload.dto;

import lombok.Data;

@Data
public class CourseCreateDto {
    private String title;
    private String description;
    private String image;
    private Long instructorId;
}
