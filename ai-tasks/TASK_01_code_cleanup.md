# TASK 01 — Paket Tutarsızlığı Düzeltme & Kod Temizliği

**Bağımlılık:** Yok (İlk görev)  
**Risk Seviyesi:** Orta — Derleme hatası çıkabilir, adım adım ilerle  
**Sistem Durumu:** Canli sistem üzerinde çalışılıyor, build'i test et

---

## Amaç

Backend'de iki farklı paket adı kullanılıyor ve bu proje genelinde tutarsızlık yaratıyor:

1. **Ana paket** (doğru olan): `com.example.idectt.*`  
2. **Eski/hatalı paket** (sorunlu olan): `com.example.IdecTTBackend.*` — sadece Announcement sınıfları burada

Bu görevde Announcement sınıflarını ana pakete taşıyacaksın. Ayrıca gereksiz test controller'ı sileceksin.

---

## Adım 1 — Mevcut Durumu Anla

Şu dosyaları oku ve içeriğini kavra:

```
backend/IdecTTBackend/src/main/java/com/example/IdecTTBackend/
├── IdecTtBackendApplication.java          ← Ana uygulama sınıfı (taşınacak)
├── controller/AnnouncementController.java  ← Taşınacak
├── model/Announcement.java                ← Taşınacak (entity olarak)
├── repository/AnnouncementRepository.java ← Taşınacak
└── service/AnnouncementService.java       ← Taşınacak

backend/IdecTTBackend/src/main/java/com/example/idectt/
├── controller/test/TestController.java    ← SİLİNECEK (gereksiz)
└── ... (diğer ana paket sınıfları)
```

---

## Adım 2 — Announcement Sınıflarını Taşı

### 2a. Announcement Entity

Şu dosyayı oku:
`backend/IdecTTBackend/src/main/java/com/example/IdecTTBackend/model/Announcement.java`

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/entity/Announcement.java`

İçeriği şu olmalı (paket adını değiştir, geri kalanı aynı tut):
```java
package com.example.idectt.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
@Getter
@Setter
@NoArgsConstructor
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String content;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```
**Not**: Eski `model/Announcement.java` içinde farklı alanlar varsa onları koru, sadece paket adını ve annotation'ları düzenle.

### 2b. Announcement Repository

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/repository/AnnouncementRepository.java`

```java
package com.example.idectt.repository;

import com.example.idectt.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
}
```

### 2c. Announcement Service

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/service/AnnouncementService.java`

Eski `com.example.IdecTTBackend.service.AnnouncementService` dosyasını oku, içeriğini al.
Import'ları `com.example.idectt.*` olarak güncelle.

### 2d. Announcement Controller

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/controller/AnnouncementController.java`

Eski `com.example.IdecTTBackend.controller.AnnouncementController` dosyasını oku, içeriğini al.
Import'ları `com.example.idectt.*` olarak güncelle.
`@RequestMapping("/api/announcements")` annotation'ı korunmalı.

---

## Adım 3 — Ana Uygulama Sınıfını Taşı

Mevcut dosyayı oku:
`backend/IdecTTBackend/src/main/java/com/example/IdecTTBackend/IdecTtBackendApplication.java`

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/IdecTtBackendApplication.java`

```java
package com.example.idectt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IdecTtBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(IdecTtBackendApplication.class, args);
    }
}
```

---

## Adım 4 — Eski Dosyaları Sil

Aşağıdaki dosyaları sil (artık yenileri var):
```
backend/IdecTTBackend/src/main/java/com/example/IdecTTBackend/IdecTtBackendApplication.java
backend/IdecTTBackend/src/main/java/com/example/IdecTTBackend/controller/AnnouncementController.java
backend/IdecTTBackend/src/main/java/com/example/IdecTTBackend/model/Announcement.java
backend/IdecTTBackend/src/main/java/com/example/IdecTTBackend/repository/AnnouncementRepository.java
backend/IdecTTBackend/src/main/java/com/example/IdecTTBackend/service/AnnouncementService.java
```

Artık boş kalan `com/example/IdecTTBackend/` dizinini de sil.

---

## Adım 5 — Test Controller'ı Sil

```
backend/IdecTTBackend/src/main/java/com/example/idectt/controller/test/TestController.java
```

Bu dosyayı sil. `controller/test/` klasörü de boşalırsa onu da sil.

---

## Adım 6 — Test Dosyasını Güncelle

Şu dosyayı oku:
`backend/IdecTTBackend/src/test/java/com/example/IdecTTBackend/IdecTtBackendApplicationTests.java`

İçeriğini şu şekilde güncelle:
```java
package com.example.idectt;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class IdecTtBackendApplicationTests {
    @Test
    void contextLoads() {
    }
}
```

Test dosyasını şu konuma taşı (eski dosyayı sil):
`backend/IdecTTBackend/src/test/java/com/example/idectt/IdecTtBackendApplicationTests.java`

---

## Adım 7 — Derleme Testi

Backend klasörüne gir ve derle:
```bash
cd /home/ubuntu/idecWebsite/backend/IdecTTBackend
./mvnw clean compile -q
```

Hata varsa düzelt. Başarıyla derlendikten sonra servisi yeniden başlat:
```bash
cd /home/ubuntu/idecWebsite
docker compose restart backend
```

30 saniye bekle, backend'in ayağa kalktığını kontrol et:
```bash
docker compose logs backend --tail=30
```

`Started IdecTtBackendApplication` gibi bir log görmen gerekiyor.

---

## Adım 8 — Frontend Küçük Temizlikler

Şu dosyaları aç ve gereksiz `console.log` ve yorum satırlarını temizle (sadece açıkça gereksiz olanları, iş mantığını değiştirme):

- `src/pages/CourseDetailPage.tsx` — satır 116-117 yorum satırları temizlenebilir, satır 113 `console.error` beklenebilir hata olduğu için bırak
- `src/services/apiService.ts` — satır 133 yorum bırak, iş mantığı açıklıyor

---

## Tamamlandı mı? Log Yaz

`PROGRESS_LOG.md` dosyasına şu formatta ekle:

```markdown
## TASK_01 — Paket Tutarsızlığı Düzeltme & Kod Temizliği
**Tamamlanma Tarihi:** [tarih]
**Durum:** Tamamlandı

### Yapılanlar
- Announcement sınıfları com.example.IdecTTBackend → com.example.idectt.entity/service/repository/controller'a taşındı
- IdecTtBackendApplication ana pakete taşındı
- TestController silindi
- Test dosyası güncellendi
- Backend başarıyla derlendi ve yeniden başlatıldı

### Değiştirilen/Eklenen Dosyalar
- [değiştirilen dosyalar listesi]

### Notlar
- [varsa özel durumlar]
```

`TASKS_INDEX.md`'deki Task 01 satırını `✅ Tamamlandı` yap.
