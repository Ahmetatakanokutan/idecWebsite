package com.example.idectt.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SectionDto {
    private Long id;
    private String title;
    private int orderIndex;
    private List<LessonDto> lessons;
}
