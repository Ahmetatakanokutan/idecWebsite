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
public class ProjectDto {
    private Long id;
    private String title;
    private String description;
    private String image;
    private String leader;
    private List<String> sectors;
    private List<String> partners;
    private List<String> objectives;
    private List<String> outcomes;
}
