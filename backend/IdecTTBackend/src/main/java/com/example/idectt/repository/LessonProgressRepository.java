package com.example.idectt.repository;

import com.example.idectt.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {

    Optional<LessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);

    List<LessonProgress> findByUserId(Long userId);

    List<LessonProgress> findByUserIdAndCourseId(Long userId, Long courseId);

    @Query("SELECT COUNT(lp) FROM LessonProgress lp WHERE lp.user.id = :userId AND lp.completed = true")
    long countCompletedLessonsByUser(@Param("userId") Long userId);

    @Query("SELECT lp FROM LessonProgress lp WHERE lp.user.id = :userId ORDER BY lp.lastWatchedAt DESC")
    List<LessonProgress> findByUserIdOrderByLastWatchedAtDesc(@Param("userId") Long userId);
}
