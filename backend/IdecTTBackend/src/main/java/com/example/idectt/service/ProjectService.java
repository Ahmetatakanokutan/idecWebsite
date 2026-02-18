package com.example.idectt.service;

import com.example.idectt.entity.Project;
import com.example.idectt.payload.dto.ProjectDto;
import com.example.idectt.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Transactional
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapToProjectDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectDto getProjectById(Long id) {
        return projectRepository.findById(id)
                .map(this::mapToProjectDto)
                .orElse(null);
    }

    @Transactional
    public Project updateProject(Long id, Project projectDetails) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        project.setTitle(projectDetails.getTitle());
        project.setDescription(projectDetails.getDescription());
        project.setImage(projectDetails.getImage());
        project.setLeader(projectDetails.getLeader());
        project.setSectors(projectDetails.getSectors());
        project.setPartners(projectDetails.getPartners());
        project.setObjectives(projectDetails.getObjectives());
        project.setOutcomes(projectDetails.getOutcomes());

        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        projectRepository.delete(project);
    }

    private ProjectDto mapToProjectDto(Project project) {
        return new ProjectDto(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getImage(),
                project.getLeader(),
                project.getSectors(),
                project.getPartners(),
                project.getObjectives(),
                project.getOutcomes()
        );
    }
}
