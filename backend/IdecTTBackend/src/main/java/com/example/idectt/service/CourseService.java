package com.example.idectt.service;

import com.example.idectt.entity.Course;
import com.example.idectt.entity.Lesson;
import com.example.idectt.payload.dto.CourseDetailDto;
import com.example.idectt.payload.dto.CourseSummaryDto;
import com.example.idectt.payload.dto.InstructorDto;
import com.example.idectt.payload.dto.LessonDto;
import com.example.idectt.repository.CourseRepository;
import com.example.idectt.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private LessonRepository lessonRepository;


    @Transactional
    public Course createCourse(Course course) {
        // Note: This assumes instructor is passed correctly or handled separately
        return courseRepository.save(course);
    }

    @Transactional(readOnly = true)
    public List<CourseSummaryDto> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapToCourseSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseDetailDto getCourseById(Long id) {
        return courseRepository.findById(id)
                .map(this::mapToCourseDetailDto)
                .orElse(null);
    }

    @Transactional
    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setRating(courseDetails.getRating());
        course.setStudents(courseDetails.getStudents());
        // Note: Instructor/lesson updates would be handled in more complex logic
        
        return courseRepository.save(course);
    }

    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        courseRepository.delete(course);
    }

    // === Lesson Management Logic ===

    @Transactional
    public LessonDto addLessonToCourse(Long courseId, Lesson lesson) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        course.addLesson(lesson);
        courseRepository.save(course);
        // The lesson gets its ID after the save, so we return the DTO of the saved lesson
        return mapToLessonDto(lesson);
    }

    @Transactional
    public LessonDto updateLessonInCourse(Long courseId, Long lessonId, Lesson lessonDetails) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        Lesson lessonToUpdate = course.getLessons().stream()
                .filter(lesson -> lesson.getId().equals(lessonId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        lessonToUpdate.setTitle(lessonDetails.getTitle());
        lessonToUpdate.setDuration(lessonDetails.getDuration());
        lessonToUpdate.setVideoUrl(lessonDetails.getVideoUrl());

        lessonRepository.save(lessonToUpdate); // Explicitly save the lesson
        return mapToLessonDto(lessonToUpdate);
    }

    @Transactional
    public void deleteLessonFromCourse(Long courseId, Long lessonId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        Lesson lessonToRemove = course.getLessons().stream()
                .filter(lesson -> lesson.getId().equals(lessonId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        course.getLessons().remove(lessonToRemove);
        // Because of orphanRemoval=true, this will also delete the lesson from the database
        courseRepository.save(course);
    }


    private CourseSummaryDto mapToCourseSummaryDto(Course course) {
        return new CourseSummaryDto(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getInstructor() != null ? course.getInstructor().getName() : "N/A",
                course.getRating(),
                course.getStudents()
        );
    }

    private CourseDetailDto mapToCourseDetailDto(Course course) {
        InstructorDto instructorDto = course.getInstructor() != null ?
                new InstructorDto(course.getInstructor().getName(), course.getInstructor().getTitle()) :
                new InstructorDto("N/A", "N/A");

        List<LessonDto> lessonDtos = course.getLessons().stream()
                .map(this::mapToLessonDto)
                .collect(Collectors.toList());

        return new CourseDetailDto(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getRating(),
                course.getStudents(),
                instructorDto,
                lessonDtos
        );
    }

    private LessonDto mapToLessonDto(Lesson lesson) {
        return new LessonDto(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getDuration(),
                lesson.getVideoUrl()
        );
    }
}
