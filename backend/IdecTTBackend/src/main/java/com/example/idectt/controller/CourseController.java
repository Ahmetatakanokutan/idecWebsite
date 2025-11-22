package com.example.idectt.controller;

import com.example.idectt.entity.Course;
import com.example.idectt.entity.Lesson;
import com.example.idectt.entity.Section;
import com.example.idectt.payload.dto.*;
import com.example.idectt.service.CourseService;
import com.example.idectt.security.services.UserDetailsImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // === Course Endpoints ===

    @GetMapping
    public ResponseEntity<List<CourseSummaryDto>> getAllCourses() {
        List<CourseSummaryDto> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDetailDto> getCourseById(@PathVariable Long id) {
        CourseDetailDto course = courseService.getCourseById(id);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(course);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody CourseCreateDto courseDto) {
        Course createdCourse = courseService.createCourse(courseDto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(createdCourse.getId()).toUri();
        return ResponseEntity.created(location).body(createdCourse);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseCreateDto courseDto) {
        Course updatedCourse = courseService.updateCourse(id, courseDto);
        return ResponseEntity.ok(updatedCourse);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    // === Section Endpoints ===

    @PostMapping("/{courseId}/sections")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SectionDto> addSectionToCourse(@PathVariable Long courseId, @Valid @RequestBody Section section) {
        SectionDto newSection = courseService.addSectionToCourse(courseId, section);
        return ResponseEntity.ok(newSection);
    }

    @PutMapping("/sections/{sectionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SectionDto> updateSection(@PathVariable Long sectionId, @RequestBody Section sectionDetails) {
        SectionDto updatedSection = courseService.updateSection(sectionId, sectionDetails.getTitle());
        return ResponseEntity.ok(updatedSection);
    }

    @DeleteMapping("/sections/{sectionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSection(@PathVariable Long sectionId) {
        courseService.deleteSection(sectionId);
        return ResponseEntity.noContent().build();
    }

    // === Lesson Endpoints ===

    @PostMapping("/sections/{sectionId}/lessons")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LessonDto> addLessonToSection(@PathVariable Long sectionId, @Valid @RequestBody Lesson lesson) {
        LessonDto newLesson = courseService.addLessonToSection(sectionId, lesson);
        return ResponseEntity.ok(newLesson);
    }

    @PutMapping("/lessons/{lessonId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LessonDto> updateLesson(@PathVariable Long lessonId, @Valid @RequestBody Lesson lessonDetails) {
        LessonDto updatedLesson = courseService.updateLesson(lessonId, lessonDetails);
        return ResponseEntity.ok(updatedLesson);
    }

    @DeleteMapping("/lessons/{lessonId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long lessonId) {
        courseService.deleteLesson(lessonId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/enroll")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> enrollUser(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        courseService.enrollUser(id, userDetails.getId());
        return ResponseEntity.ok().build();
    }

    // === Favorite Endpoints ===

    @PostMapping("/{id}/favorite")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> toggleFavorite(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isFavorited = courseService.toggleFavorite(id, userDetails.getId());
        return ResponseEntity.ok(isFavorited);
    }

    @GetMapping("/favorites")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CourseSummaryDto>> getUserFavorites() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<CourseSummaryDto> favorites = courseService.getUserFavorites(userDetails.getId());
        return ResponseEntity.ok(favorites);
    }
}
