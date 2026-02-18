package com.example.idectt.service;

import com.example.idectt.entity.*;
import com.example.idectt.payload.dto.*;
import com.example.idectt.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private SectionRepository sectionRepository;
    @Autowired
    private InstructorRepository instructorRepository;
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    @Autowired
    private FavoriteRepository favoriteRepository;
    @Autowired
    private UserRepository userRepository;


    @Transactional
    public Course createCourse(CourseCreateDto courseDto) {
        Course course = new Course(courseDto.getTitle(), courseDto.getDescription(), courseDto.getImage());
        
        if (courseDto.getInstructorId() != null) {
            Instructor instructor = instructorRepository.findById(courseDto.getInstructorId())
                    .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + courseDto.getInstructorId()));
            course.setInstructor(instructor);
        }
        
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
    public Course updateCourse(Long id, CourseCreateDto courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setImage(courseDetails.getImage());
        
        if (courseDetails.getInstructorId() != null) {
             Instructor instructor = instructorRepository.findById(courseDetails.getInstructorId())
                    .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + courseDetails.getInstructorId()));
            course.setInstructor(instructor);
        }
        
        return courseRepository.save(course);
    }

    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        courseRepository.delete(course);
    }

    // === Section Management Logic ===

    @Transactional
    public SectionDto addSectionToCourse(Long courseId, Section section) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        course.addSection(section);
        sectionRepository.save(section);
        return mapToSectionDto(section);
    }

    @Transactional
    public SectionDto updateSection(Long sectionId, String newTitle) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found with id: " + sectionId));
        section.setTitle(newTitle);
        sectionRepository.save(section);
        return mapToSectionDto(section);
    }

    @Transactional
    public void deleteSection(Long sectionId) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found with id: " + sectionId));
        sectionRepository.delete(section);
    }

    // === Lesson Management Logic ===

    @Transactional
    public LessonDto addLessonToSection(Long sectionId, Lesson lesson) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found with id: " + sectionId));
        
        section.addLesson(lesson);
        lessonRepository.save(lesson);
        return mapToLessonDto(lesson);
    }

    @Transactional
    public LessonDto updateLesson(Long lessonId, Lesson lessonDetails) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        lesson.setTitle(lessonDetails.getTitle());
        lesson.setDuration(lessonDetails.getDuration());
        lesson.setVideoUrl(lessonDetails.getVideoUrl());

        lessonRepository.save(lesson);
        return mapToLessonDto(lesson);
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));
        lessonRepository.delete(lesson);
    }

    // === Enrollment Logic ===

    @Transactional
    public void enrollUser(Long courseId, Long userId) {
        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            return; // Zaten kayıtlı
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Enrollment enrollment = new Enrollment(user, course);
        enrollmentRepository.save(enrollment);

        // Kursun öğrenci sayısını artır
        course.setStudents(course.getStudents() + 1);
        courseRepository.save(course);
    }

    // === Favorite Logic ===

    @Transactional
    public boolean toggleFavorite(Long courseId, Long userId) {
        Optional<Favorite> existingFavorite = favoriteRepository.findByUserIdAndCourseId(userId, courseId);
        
        if (existingFavorite.isPresent()) {
            favoriteRepository.delete(existingFavorite.get());
            return false; // Removed
        } else {
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Favorite favorite = new Favorite(user, course);
            favoriteRepository.save(favorite);
            return true; // Added
        }
    }

    @Transactional(readOnly = true)
    public List<CourseSummaryDto> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId).stream()
                .map(favorite -> mapToCourseSummaryDto(favorite.getCourse()))
                .collect(Collectors.toList());
    }

    // === Mappers ===

    private CourseSummaryDto mapToCourseSummaryDto(Course course) {
        return new CourseSummaryDto(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getImage(),
                course.getInstructor() != null ? course.getInstructor().getName() : "N/A",
                course.getRating(),
                course.getStudents()
        );
    }

    private CourseDetailDto mapToCourseDetailDto(Course course) {
        InstructorDto instructorDto = course.getInstructor() != null ?
                new InstructorDto(course.getInstructor().getName(), course.getInstructor().getTitle()) :
                new InstructorDto("N/A", "N/A");

        List<SectionDto> sectionDtos = course.getSections().stream()
                .map(this::mapToSectionDto)
                .collect(Collectors.toList());

        return new CourseDetailDto(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getImage(),
                course.getRating(),
                course.getStudents(),
                instructorDto,
                sectionDtos
        );
    }

    private SectionDto mapToSectionDto(Section section) {
        List<LessonDto> lessonDtos = section.getLessons().stream()
                .map(this::mapToLessonDto)
                .collect(Collectors.toList());
        
        return new SectionDto(
                section.getId(),
                section.getTitle(),
                section.getOrderIndex(),
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