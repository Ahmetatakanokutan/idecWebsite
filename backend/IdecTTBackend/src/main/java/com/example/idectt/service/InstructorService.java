package com.example.idectt.service;

import com.example.idectt.entity.Instructor;
import com.example.idectt.payload.dto.InstructorForListDto;
import com.example.idectt.repository.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InstructorService {

    @Autowired
    private InstructorRepository instructorRepository;

    @Transactional(readOnly = true)
    public List<InstructorForListDto> getAllInstructors() {
        return instructorRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Instructor createInstructor(Instructor instructor) {
        return instructorRepository.save(instructor);
    }

    @Transactional
    public Instructor updateInstructor(Long id, Instructor instructorDetails) {
        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + id));

        instructor.setName(instructorDetails.getName());
        instructor.setTitle(instructorDetails.getTitle());

        return instructorRepository.save(instructor);
    }

    @Transactional
    public void deleteInstructor(Long id) {
        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + id));
        // Note: consider what happens if an instructor is assigned to a course.
        // The current setup would throw a constraint violation error.
        // A more robust solution would be to check for associated courses and handle it gracefully.
        instructorRepository.delete(instructor);
    }

    private InstructorForListDto mapToDto(Instructor instructor) {
        return new InstructorForListDto(
                instructor.getId(),
                instructor.getName(),
                instructor.getTitle()
        );
    }
}
