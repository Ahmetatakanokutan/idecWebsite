package com.example.idectt.controller;

import com.example.idectt.entity.Course;
import com.example.idectt.entity.Lesson;
import com.example.idectt.payload.dto.CourseDetailDto;
import com.example.idectt.payload.dto.CourseSummaryDto;
import com.example.idectt.payload.dto.LessonDto;
import com.example.idectt.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // ... existing course methods ...
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
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) {
        Course createdCourse = courseService.createCourse(course);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(createdCourse.getId()).toUri();
        return ResponseEntity.created(location).body(createdCourse);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @Valid @RequestBody Course courseDetails) {
        Course updatedCourse = courseService.updateCourse(id, courseDetails);
        return ResponseEntity.ok(updatedCourse);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    // === Lesson Management Endpoints ===

    @PostMapping("/{courseId}/lessons")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LessonDto> addLessonToCourse(@PathVariable Long courseId, @Valid @RequestBody Lesson lesson) {
        LessonDto newLesson = courseService.addLessonToCourse(courseId, lesson);
        return ResponseEntity.ok(newLesson);
    }

    @PutMapping("/{courseId}/lessons/{lessonId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LessonDto> updateLessonInCourse(@PathVariable Long courseId, @PathVariable Long lessonId, @Valid @RequestBody Lesson lessonDetails) {
        LessonDto updatedLesson = courseService.updateLessonInCourse(courseId, lessonId, lessonDetails);
        return ResponseEntity.ok(updatedLesson);
    }

    @DeleteMapping("/{courseId}/lessons/{lessonId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLessonFromCourse(@PathVariable Long courseId, @PathVariable Long lessonId) {
        courseService.deleteLessonFromCourse(courseId, lessonId);
        return ResponseEntity.noContent().build();
    }
}
