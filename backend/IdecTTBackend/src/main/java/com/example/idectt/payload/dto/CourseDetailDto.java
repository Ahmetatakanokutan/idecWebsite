package com.example.idectt.payload.dto;

import com.example.idectt.entity.CourseType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseDetailDto {
    private Long id;
    private String title;
    private String description;
    private String image;
    private double rating;
    private int students;
    private InstructorDto instructor;
    private List<SectionDto> sections;
    private CourseType courseType;
}
