# TASK 05 — Kişi Bazlı Ders İzleme İlerleme Takibi

**Bağımlılık:** Task 01 ve Task 04 tamamlanmış olmalı  
**Risk Seviyesi:** Orta — Backend'e yeni tablo ve endpoint'ler ekleniyor, mevcut tablolara dokunulmyor  
**Kritik Not:** DDL_AUTO=update — Yeni `lesson_progress` tablosu otomatik oluşturulur  
**Task 06'ya Veri Sağlar:** Sertifika üretimi bu tablodaki verilere dayanır

---

## Amaç

Her kullanıcının hangi dersi ne kadar izlediğini, izlemeye başlama/bitirme zamanlarını ve dersi tamamlayıp tamamlamadığını kayıt altına alacak bir sistem kur. Bunun için:

- Backend'de yeni `LessonProgress` entity'si
- REST API endpoint'leri (ders seçildiğinde kayıt başlat, ders değiştirildiğinde güncelle)
- Frontend'de `CourseDetailPage.tsx`'e API çağrıları
- Admin panelinde kullanıcı bazlı ilerleme görüntüleme (opsiyonel ama güzel olur)

---

## BACKEND DEĞİŞİKLİKLERİ

### Adım B1 — LessonProgress Entity Oluştur

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/entity/LessonProgress.java`

```java
package com.example.idectt.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "lesson_id"})
})
@Getter
@Setter
@NoArgsConstructor
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "first_watched_at")
    private LocalDateTime firstWatchedAt;

    @Column(name = "last_watched_at")
    private LocalDateTime lastWatchedAt;

    @Column(name = "watch_count")
    private int watchCount = 0;

    @Column(name = "is_completed")
    private boolean completed = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public LessonProgress(User user, Lesson lesson, Long courseId) {
        this.user = user;
        this.lesson = lesson;
        this.courseId = courseId;
        this.firstWatchedAt = LocalDateTime.now();
        this.lastWatchedAt = LocalDateTime.now();
        this.watchCount = 1;
    }
}
```

---

### Adım B2 — LessonProgressRepository Oluştur

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/repository/LessonProgressRepository.java`

```java
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
```

---

### Adım B3 — DTO Sınıfları Oluştur

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/payload/dto/LessonProgressDto.java`

```java
package com.example.idectt.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LessonProgressDto {
    private Long lessonId;
    private String lessonTitle;
    private Long courseId;
    private String courseTitle;
    private boolean completed;
    private LocalDateTime firstWatchedAt;
    private LocalDateTime lastWatchedAt;
    private int watchCount;
}
```

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/payload/dto/UserProgressSummaryDto.java`

```java
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
public class UserProgressSummaryDto {
    private long totalLessons;
    private long completedLessons;
    private double completionPercentage;
    private boolean certificateEligible;
    private List<LessonProgressDto> recentActivity;
}
```

---

### Adım B4 — LessonProgressService Oluştur

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/service/LessonProgressService.java`

```java
package com.example.idectt.service;

import com.example.idectt.entity.Lesson;
import com.example.idectt.entity.LessonProgress;
import com.example.idectt.entity.User;
import com.example.idectt.payload.dto.LessonProgressDto;
import com.example.idectt.payload.dto.UserProgressSummaryDto;
import com.example.idectt.repository.LessonProgressRepository;
import com.example.idectt.repository.LessonRepository;
import com.example.idectt.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LessonProgressService {

    private final LessonProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;

    public LessonProgressService(LessonProgressRepository progressRepository,
                                  LessonRepository lessonRepository,
                                  UserRepository userRepository) {
        this.progressRepository = progressRepository;
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public LessonProgress recordLessonWatch(Long userId, Long lessonId, Long courseId) {
        LessonProgress progress = progressRepository.findByUserIdAndLessonId(userId, lessonId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Lesson lesson = lessonRepository.findById(lessonId)
                            .orElseThrow(() -> new RuntimeException("Lesson not found"));
                    return new LessonProgress(user, lesson, courseId);
                });

        progress.setLastWatchedAt(LocalDateTime.now());
        if (progress.getWatchCount() == 0) {
            progress.setFirstWatchedAt(LocalDateTime.now());
        }
        progress.setWatchCount(progress.getWatchCount() + 1);

        return progressRepository.save(progress);
    }

    @Transactional
    public LessonProgress markLessonCompleted(Long userId, Long lessonId, Long courseId) {
        LessonProgress progress = recordLessonWatch(userId, lessonId, courseId);
        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);
        }
        return progress;
    }

    public List<LessonProgressDto> getUserProgressForCourse(Long userId, Long courseId) {
        return progressRepository.findByUserIdAndCourseId(userId, courseId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserProgressSummaryDto getUserProgressSummary(Long userId, long totalLessonsInPlatform) {
        long completed = progressRepository.countCompletedLessonsByUser(userId);
        double pct = totalLessonsInPlatform > 0
                ? (completed * 100.0 / totalLessonsInPlatform)
                : 0.0;
        boolean eligible = pct >= 80.0;

        List<LessonProgressDto> recent = progressRepository
                .findByUserIdOrderByLastWatchedAtDesc(userId)
                .stream()
                .limit(10)
                .map(this::toDto)
                .collect(Collectors.toList());

        return new UserProgressSummaryDto(totalLessonsInPlatform, completed, pct, eligible, recent);
    }

    private LessonProgressDto toDto(LessonProgress lp) {
        String lessonTitle = lp.getLesson() != null ? lp.getLesson().getTitle() : "";
        String courseTitle = "";
        if (lp.getLesson() != null && lp.getLesson().getSection() != null
                && lp.getLesson().getSection().getCourse() != null) {
            courseTitle = lp.getLesson().getSection().getCourse().getTitle();
        }
        return new LessonProgressDto(
                lp.getLesson() != null ? lp.getLesson().getId() : null,
                lessonTitle,
                lp.getCourseId(),
                courseTitle,
                lp.isCompleted(),
                lp.getFirstWatchedAt(),
                lp.getLastWatchedAt(),
                lp.getWatchCount()
        );
    }
}
```

---

### Adım B5 — Lesson Entity'ye Section Referansını Kontrol Et

`backend/IdecTTBackend/src/main/java/com/example/idectt/entity/Lesson.java` dosyasını aç.

`section` alanında `@JsonBackReference` var, bu LAZY load demek. `LessonProgressService.toDto()` metodunda `getSection()` çağrısı session dışında patlayabilir. Bu yüzden `@Transactional` anotasyonu service metodlarında olmalı (zaten var). Bunu kontrol et.

Eğer `Section` entity'sinde `getCourse()` metodu yoksa ekle; mevcut `Section.java` dosyasını kontrol et:
`backend/IdecTTBackend/src/main/java/com/example/idectt/entity/Section.java`

`Course course` alanı olmalı, `getCourse()` getter Lombok tarafından üretiliyor.

---

### Adım B6 — LessonProgressController Oluştur

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/controller/LessonProgressController.java`

```java
package com.example.idectt.controller;

import com.example.idectt.payload.dto.LessonProgressDto;
import com.example.idectt.payload.dto.UserProgressSummaryDto;
import com.example.idectt.payload.response.MessageResponse;
import com.example.idectt.repository.LessonRepository;
import com.example.idectt.security.services.UserDetailsImpl;
import com.example.idectt.service.LessonProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class LessonProgressController {

    private final LessonProgressService progressService;
    private final LessonRepository lessonRepository;

    public LessonProgressController(LessonProgressService progressService,
                                     LessonRepository lessonRepository) {
        this.progressService = progressService;
        this.lessonRepository = lessonRepository;
    }

    // Ders izleme kaydı (kullanıcı bir derse tıkladığında çağrılır)
    @PostMapping("/lesson/{lessonId}/watch")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> recordWatch(
            @PathVariable Long lessonId,
            @RequestBody Map<String, Long> body,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long courseId = body.get("courseId");
        if (courseId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("courseId is required"));
        }
        progressService.recordLessonWatch(userDetails.getId(), lessonId, courseId);
        return ResponseEntity.ok(new MessageResponse("Progress recorded"));
    }

    // Dersi tamamlandı olarak işaretle
    @PostMapping("/lesson/{lessonId}/complete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markComplete(
            @PathVariable Long lessonId,
            @RequestBody Map<String, Long> body,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long courseId = body.get("courseId");
        if (courseId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("courseId is required"));
        }
        progressService.markLessonCompleted(userDetails.getId(), lessonId, courseId);
        return ResponseEntity.ok(new MessageResponse("Lesson marked as completed"));
    }

    // Belirli bir kurs için kullanıcının ilerlemesini getir
    @GetMapping("/course/{courseId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LessonProgressDto>> getCourseProgress(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(
                progressService.getUserProgressForCourse(userDetails.getId(), courseId));
    }

    // Kullanıcının tüm platform genelindeki özet ilerlemesi
    @GetMapping("/summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProgressSummaryDto> getProgressSummary(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        long totalLessons = lessonRepository.count();
        return ResponseEntity.ok(
                progressService.getUserProgressSummary(userDetails.getId(), totalLessons));
    }
}
```

---

### Adım B7 — SecurityConfig'i Kontrol Et

`/api/progress/**` endpoint'lerinin `@PreAuthorize("isAuthenticated()")` ile korunduğundan emin ol. SecurityConfig'de method security aktifse (`@EnableMethodSecurity`) bu yeterli. Değilse SecurityConfig'e ekle:

```java
.requestMatchers("/api/progress/**").authenticated()
```

---

### Adım B8 — Backend Derle ve Yeniden Başlat

```bash
cd /home/ubuntu/idecWebsite/backend/IdecTTBackend
./mvnw clean compile -q
```

Başarıyla derlendikten sonra:

```bash
cd /home/ubuntu/idecWebsite
docker compose restart backend
```

Log'larda `lesson_progress` tablosunun oluşturulduğunu gösteren Hibernate DDL mesajı çıkmalı.

---

## FRONTEND DEĞİŞİKLİKLERİ

### Adım F1 — apiService.ts'e Progress Çağrıları Ekle

`src/services/apiService.ts` dosyasını aç. `apiService` nesnesinin dışında yeni fonksiyonlar ekle (export listesini güncelle):

Dosyanın sonuna (son `export` satırından önce) şu fonksiyonları ekle:

```typescript
const progressService = {
    recordWatch: (lessonId: number, courseId: number) =>
        apiService.post(`/progress/lesson/${lessonId}/watch`, { courseId }),
    
    markComplete: (lessonId: number, courseId: number) =>
        apiService.post(`/progress/lesson/${lessonId}/complete`, { courseId }),
    
    getCourseProgress: (courseId: number) =>
        apiService.get(`/progress/course/${courseId}`),
    
    getSummary: () =>
        apiService.get('/progress/summary'),
};
```

`export` satırını güncelle:

```typescript
export { apiService, resolveAssetUrl, progressService };
```

---

### Adım F2 — CourseDetailPage.tsx'i Güncelle

`src/pages/CourseDetailPage.tsx` dosyasını aç.

#### 2a. Import'u Güncelle

```typescript
import { apiService, resolveAssetUrl } from '../services/apiService';
```
→ şu hale getir:
```typescript
import { apiService, resolveAssetUrl, progressService } from '../services/apiService';
```

#### 2b. Progress State Ekle

`useState` satırlarının olduğu bloğun sonuna ekle:

```typescript
const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
```

#### 2c. Kurs Yüklendiğinde Mevcut Progress'i Getir

`fetchCourseDetail` fonksiyonunun içinde, `const data: CourseDetail = await apiService.get(...)` satırından sonra ekle:

```typescript
// Kullanıcının bu kursdaki mevcut progress'ini yükle
try {
  const progressData = await progressService.getCourseProgress(Number(courseId));
  if (Array.isArray(progressData)) {
    const completedIds = new Set<number>(
      progressData
        .filter((p: any) => p.completed)
        .map((p: any) => p.lessonId)
    );
    setCompletedLessons(completedIds);
  }
} catch { /* progress yüklenemezse sessizce devam et */ }
```

#### 2d. Ders Seçildiğinde İzleme Kaydı Yap

`setSelectedLesson(lesson)` çağrısının olduğu kısımları bul. Şu an kod:
```typescript
onClick={() => setSelectedLesson(lesson)}
```

Bunu şu şekilde değiştir:

```typescript
onClick={() => {
  setSelectedLesson(lesson);
  if (isLoggedIn && course) {
    progressService.recordWatch(lesson.id, course.id).catch(() => {});
  }
}}
```

#### 2e. Tamamlandı İşareti Göster

Sidebar'daki ders listesinde, her dersin ikonunu gösteren kısımda (şu an `isActive` kontrolü yapan bölüm) şu değişikliği yap:

Şu kodu bul:
```tsx
{isActive ? (
    <Play className="w-4 h-4 text-emerald-600 fill-current" />
) : (
    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
    </div>
)}
```

Şu hale getir:
```tsx
{isActive ? (
    <Play className="w-4 h-4 text-emerald-600 fill-current" />
) : completedLessons.has(lesson.id) ? (
    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
) : (
    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
    </div>
)}
```

#### 2f. "Dersi Tamamladım" Butonu Ekle

Video player bölümünde, alt bilgi alanında (`bg-gray-800` div'i içinde, ders başlığının altında) şu butonu ekle:

```tsx
{selectedLesson && isLoggedIn && course && !completedLessons.has(selectedLesson.id) && (
  <button
    onClick={() => {
      progressService.markComplete(selectedLesson.id, course.id).catch(() => {});
      setCompletedLessons(prev => new Set([...prev, selectedLesson.id]));
    }}
    className="mt-3 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-full transition-colors"
  >
    ✓ Dersi Tamamladım
  </button>
)}
{selectedLesson && completedLessons.has(selectedLesson.id) && (
  <span className="mt-3 inline-flex items-center text-emerald-400 text-xs font-medium">
    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    Tamamlandı
  </span>
)}
```

---

### Adım F3 — ProfilePage'e İlerleme Özeti Ekle

`src/pages/ProfilePage.tsx` dosyasını aç.

İlerleme özetini göstermek için `progressService` import et:

```typescript
import { progressService } from '../services/apiService';
```

Mevcut `useEffect` içinde, profil verisi yüklendikten sonra ekle:

```typescript
const [progressSummary, setProgressSummary] = useState<any>(null);

// useEffect içinde:
progressService.getSummary()
  .then(setProgressSummary)
  .catch(() => {});
```

Profil sayfasında uygun bir yerde, hesap bilgilerinin altında şu kartı göster:

```tsx
{progressSummary && (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mt-6">
    <h3 className="text-lg font-bold text-gray-900 mb-4">Eğitim İlerlemem</h3>
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-gray-600">
        {progressSummary.completedLessons} / {progressSummary.totalLessons} ders tamamlandı
      </span>
      <span className="text-sm font-semibold text-emerald-600">
        %{progressSummary.completionPercentage.toFixed(1)}
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(progressSummary.completionPercentage, 100)}%` }}
      />
    </div>
    {progressSummary.certificateEligible && (
      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-medium text-center">
        🎓 Tebrikler! Eğitimlerin %80'ini tamamladınız. Sertifikanızı alabileceğinizi unutmayın.
      </div>
    )}
  </div>
)}
```

---

## Doğrulama

1. Backend'i derle ve başlat
2. Log'larda `lesson_progress` tablosu için CREATE TABLE mesajını gör
3. Frontend'de bir kursa gir ve ders seç
4. `/api/progress/course/{courseId}` endpoint'ini kontrol et — ders kaydı var mı?
5. "Dersi Tamamladım" butonuna bas → Sidebar'da yeşil tik çıkmalı
6. Profil sayfasında ilerleme özeti görünmeli

---

## Tamamlandı mı? Log Yaz

`PROGRESS_LOG.md` dosyasına şu formatta ekle:

```markdown
## TASK_05 — Kişi Bazlı Ders İzleme İlerleme Takibi
**Tamamlanma Tarihi:** [tarih]
**Durum:** Tamamlandı

### Yapılanlar
- LessonProgress entity oluşturuldu (lesson_progress tablosu)
- LessonProgressRepository oluşturuldu
- LessonProgressDto ve UserProgressSummaryDto oluşturuldu
- LessonProgressService oluşturuldu
- LessonProgressController oluşturuldu (3 endpoint)
- CourseDetailPage.tsx'e progress takibi eklendi
- ProfilePage.tsx'e ilerleme özeti eklendi
- progressService apiService.ts'e eklendi

### Değiştirilen/Eklenen Dosyalar
- `entity/LessonProgress.java` (yeni)
- `repository/LessonProgressRepository.java` (yeni)
- `payload/dto/LessonProgressDto.java` (yeni)
- `payload/dto/UserProgressSummaryDto.java` (yeni)
- `service/LessonProgressService.java` (yeni)
- `controller/LessonProgressController.java` (yeni)
- `src/services/apiService.ts`
- `src/pages/CourseDetailPage.tsx`
- `src/pages/ProfilePage.tsx`
```

`TASKS_INDEX.md`'deki Task 05 satırını `✅ Tamamlandı` yap.
