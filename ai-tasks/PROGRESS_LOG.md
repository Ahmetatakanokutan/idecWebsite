# IDEC-TT Geliştirme İlerleme Günlüğü

Bu dosya, her tamamlanan görevin kaydını tutar.
Her görev bittikten sonra aşağıya şu formatta ekle:

```
## TASK_XX - [Görev Adı]
**Tamamlanma Tarihi:** YYYY-MM-DD HH:MM
**Durum:** Tamamlandı / Kısmi / Başarısız

### Yapılanlar
- ...

### Değiştirilen/Eklenen Dosyalar
- `dosya/yolu.java` — Ne yapıldı
- ...

### Notlar / Dikkat Edilmesi Gerekenler
- ...
```

---

<!-- Buradan aşağısı AI tarafından doldurulur -->

## TASK_01 — Paket Tutarsızlığı Düzeltme & Kod Temizliği
**Tamamlanma Tarihi:** 2026-06-25 17:35
**Durum:** Tamamlandı

### Yapılanlar
- Announcement sınıfları `com.example.IdecTTBackend` paketinden `com.example.idectt` altına taşındı.
- `IdecTtBackendApplication` ana pakete taşındı.
- Gereksiz `TestController` silindi.
- Spring Boot test sınıfı `com.example.idectt` paketine taşındı.
- `CourseDetailPage` içindeki kullanılmayan favori yorumları temizlendi.
- Backend `./mvnw clean compile -q` ile başarıyla derlendi.
- Backend container restart edildi ve loglarda uygulamanın başladığı doğrulandı.

### Değiştirilen/Eklenen Dosyalar
- `backend/IdecTTBackend/src/main/java/com/example/idectt/IdecTtBackendApplication.java` — Ana uygulama sınıfı taşındı.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/entity/Announcement.java` — Announcement entity yeni pakete taşındı.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/repository/AnnouncementRepository.java` — Repository yeni pakete taşındı.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/service/AnnouncementService.java` — Service yeni pakete taşındı.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/controller/AnnouncementController.java` — Controller yeni pakete taşındı.
- `backend/IdecTTBackend/src/test/java/com/example/idectt/IdecTtBackendApplicationTests.java` — Test paketi güncellendi.
- `src/pages/CourseDetailPage.tsx` — Gereksiz yorum satırları temizlendi.
- `ai-tasks/TASKS_INDEX.md` — Task 01 durumu güncellendi.

### Notlar
- Kaynak derleme Java 17 ile başarılıdır.
- Docker restart mevcut container imajı üzerinden yapıldı; kaynak değişikliklerinin çalışan imaja girmesi için sonraki deploy/rebuild sürecinde imajın yeniden build edilmesi gerekir.

## TASK_02 — KVKK / Gizlilik Politikası Onay Popup'ı
**Tamamlanma Tarihi:** 2026-06-25 17:45
**Durum:** Tamamlandı

### Yapılanlar
- `RegisterPage.tsx` içine `consentChecked` ve `showConsentModal` state'leri eklendi.
- Kayıt submit akışına aydınlatma metni onay validasyonu eklendi.
- Kayıt formuna KVKK/Gizlilik checkbox'ı ve modal açma linki eklendi.
- Scroll'lanabilir KVKK/Gizlilik modalı eklendi; modal onay butonu checkbox'ı otomatik işaretliyor.
- TR ve EN çeviri anahtarları eklendi.
- Çeviri JSON dosyaları parse edildi ve frontend production build başarıyla çalıştırıldı.

### Değiştirilen/Eklenen Dosyalar
- `src/pages/RegisterPage.tsx` — Consent checkbox, validasyon ve modal eklendi.
- `src/locales/tr/translation.json` — KVKK metni ve UI çevirileri eklendi.
- `src/locales/en/translation.json` — Privacy notice metni ve UI çevirileri eklendi.
- `ai-tasks/TASKS_INDEX.md` — Task 02 durumu güncellendi.

### Notlar
- `npm ci` sırasında mevcut dependency ağacında audit uyarıları raporlandı; görev kapsamı dışında olduğu için otomatik audit fix uygulanmadı.

## TASK_03 — Karbon Ayak İzi Hesaplama Butonu
**Tamamlanma Tarihi:** 2026-06-25 17:47
**Durum:** Tamamlandı

### Yapılanlar
- Header sağ kontrol alanına, çalıştay dropdown'undan önce `https://greentim.com/` adresine yeni sekmede giden karbon ayak izi butonu eklendi.
- Buton login durumundan bağımsız görünecek şekilde konumlandırıldı.
- TR ve EN çeviri anahtarları eklendi.
- Çeviri JSON dosyaları parse edildi ve frontend production build başarıyla çalıştırıldı.

### Değiştirilen/Eklenen Dosyalar
- `src/components/Header.tsx` — Karbon ayak izi hesaplama butonu eklendi.
- `src/locales/tr/translation.json` — Header buton çevirisi eklendi.
- `src/locales/en/translation.json` — Header buton çevirisi eklendi.
- `ai-tasks/TASKS_INDEX.md` — Task 03 durumu güncellendi.

## TASK_04 — Şifremi Unuttum Tam Akışı
**Tamamlanma Tarihi:** 2026-06-25 17:52
**Durum:** Tamamlandı

### Yapılanlar
- `User` entity'sine `passwordResetToken` ve `passwordResetTokenExpiry` alanları eklendi.
- `PasswordResetService` oluşturuldu; token üretimi, reset link maili ve şifre güncelleme akışı eklendi.
- `UserRepository` içine `findByPasswordResetToken` metodu eklendi.
- `AuthController` içine `/api/auth/forgot-password` ve `/api/auth/reset-password` endpoint'leri eklendi.
- `ForgotPasswordPage.tsx` gerçek API çağrısı, loading, hata ve başarı durumlarıyla güncellendi.
- `ResetPasswordPage.tsx` oluşturuldu ve `/reset-password` route'u eklendi.
- TR ve EN forgot/reset password çeviri anahtarları eklendi.
- Backend compile, frontend JSON parse ve frontend production build başarıyla çalıştırıldı.
- Backend container restart edildi ve loglarda uygulamanın başladığı doğrulandı.

### Değiştirilen/Eklenen Dosyalar
- `backend/IdecTTBackend/src/main/java/com/example/idectt/entity/User.java` — Şifre sıfırlama token alanları eklendi.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/service/PasswordResetService.java` — Yeni şifre sıfırlama servisi eklendi.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/repository/UserRepository.java` — Token lookup metodu eklendi.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/controller/AuthController.java` — Forgot/reset password endpoint'leri eklendi.
- `src/pages/ForgotPasswordPage.tsx` — API bağlantılı forgot password formuna dönüştürüldü.
- `src/pages/ResetPasswordPage.tsx` — Yeni reset password sayfası eklendi.
- `src/routes/index.tsx` — `/reset-password` route'u eklendi.
- `src/locales/tr/translation.json` — Forgot/reset password çevirileri eklendi.
- `src/locales/en/translation.json` — Forgot/reset password çevirileri eklendi.
- `ai-tasks/TASKS_INDEX.md` — Task 04 durumu güncellendi.

### Notlar
- `/api/auth/**` zaten `permitAll()` olduğu için SecurityConfig'te ek değişiklik gerekmedi.
- Docker restart mevcut container imajı üzerinden yapıldı; kaynak değişikliklerinin çalışan imaja girmesi için sonraki deploy/rebuild sürecinde imajın yeniden build edilmesi gerekir.

## TASK_05 — Kişi Bazlı Ders İzleme İlerleme Takibi
**Tamamlanma Tarihi:** 2026-06-25 17:57
**Durum:** Tamamlandı

### Yapılanlar
- `LessonProgress` entity'si oluşturuldu.
- `LessonProgressRepository` oluşturuldu.
- `LessonProgressDto` ve `UserProgressSummaryDto` oluşturuldu.
- `LessonProgressService` oluşturuldu; izleme kaydı, tamamlama ve özet hesaplama eklendi.
- `LessonProgressController` oluşturuldu; watch, complete, course progress ve summary endpoint'leri eklendi.
- `/api/progress/**` endpoint'leri SecurityConfig'te authenticated olarak eklendi.
- `apiService.ts` içine `progressService` eklendi.
- `CourseDetailPage.tsx` içine ders izleme kaydı, tamamlandı butonu ve tamamlandı göstergesi eklendi.
- `ProfilePage.tsx` içine eğitim ilerleme özeti eklendi.
- TR ve EN ilerleme UI çevirileri eklendi.
- Backend compile, frontend JSON parse ve frontend production build başarıyla çalıştırıldı.
- Backend container restart edildi ve loglarda uygulamanın başladığı doğrulandı.

### Değiştirilen/Eklenen Dosyalar
- `backend/IdecTTBackend/src/main/java/com/example/idectt/entity/LessonProgress.java` — Yeni progress entity'si eklendi.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/repository/LessonProgressRepository.java` — Yeni progress repository'si eklendi.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/payload/dto/LessonProgressDto.java` — Progress DTO eklendi.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/payload/dto/UserProgressSummaryDto.java` — Progress özet DTO eklendi.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/service/LessonProgressService.java` — Progress servis katmanı eklendi.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/controller/LessonProgressController.java` — Progress REST endpoint'leri eklendi.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/security/SecurityConfig.java` — Progress endpoint güvenliği eklendi.
- `src/services/apiService.ts` — `progressService` eklendi.
- `src/pages/CourseDetailPage.tsx` — Ders izleme ve tamamlama UI/API akışı eklendi.
- `src/pages/ProfilePage.tsx` — Kullanıcı ilerleme özeti eklendi.
- `src/locales/tr/translation.json` — Progress UI çevirileri eklendi.
- `src/locales/en/translation.json` — Progress UI çevirileri eklendi.
- `ai-tasks/TASKS_INDEX.md` — Task 05 durumu güncellendi.

### Notlar
- Docker restart mevcut container imajı üzerinden yapıldı; `lesson_progress` tablosu yeni kaynak kod rebuild/deploy edildiğinde Hibernate `DDL_AUTO=update` ile oluşacaktır.

## TASK_06 — %80 Tamamlama Başarı ve Bitirme Sertifikası
**Tamamlanma Tarihi:** 2026-06-25 18:04
**Durum:** Tamamlandı

### Yapılanlar
- OpenPDF bağımlılığı `pom.xml` dosyasına eklendi.
- `Certificate` entity'si oluşturuldu.
- `CertificateRepository` oluşturuldu.
- `CertificateService` oluşturuldu; eligibility kontrolü, idempotent sertifika kaydı ve PDF üretimi eklendi.
- `CertificateController` oluşturuldu; `/api/certificate/eligibility` ve `/api/certificate/download` endpoint'leri eklendi.
- `/api/certificate/**` endpoint'leri SecurityConfig'te authenticated olarak eklendi.
- `CertificatePage.tsx` oluşturuldu.
- `/certificate` route'u eklendi.
- Profile progress kartına sertifika alma linki eklendi.
- Kullanıcı dropdown menüsüne sertifika linki eklendi.
- TR ve EN sertifika link çevirileri eklendi.
- Backend compile, frontend JSON parse ve frontend production build başarıyla çalıştırıldı.
- Backend container restart edildi ve loglarda uygulamanın başladığı doğrulandı.
- Tüm mevcut compose container'ları restart edildi; `backend` ve `db` ayakta, `db` healthy durumda.

### Değiştirilen/Eklenen Dosyalar
- `backend/IdecTTBackend/pom.xml` — OpenPDF bağımlılığı eklendi.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/entity/Certificate.java` — Yeni sertifika entity'si eklendi.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/repository/CertificateRepository.java` — Sertifika repository'si eklendi.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/service/CertificateService.java` — PDF üretimi ve eligibility servisi eklendi.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/controller/CertificateController.java` — Sertifika endpoint'leri eklendi.
- `backend/IdecTTBackend/src/main/java/com/example/idectt/security/SecurityConfig.java` — Sertifika endpoint güvenliği eklendi.
- `src/pages/CertificatePage.tsx` — Sertifika uygunluk ve indirme sayfası eklendi.
- `src/routes/index.tsx` — `/certificate` route'u eklendi.
- `src/pages/ProfilePage.tsx` — Sertifika alma linki eklendi.
- `src/components/Header.tsx` — Kullanıcı menüsüne sertifika linki eklendi.
- `src/locales/tr/translation.json` — Sertifika link çevirileri eklendi.
- `src/locales/en/translation.json` — Sertifika link çevirileri eklendi.
- `ai-tasks/TASKS_INDEX.md` — Task 06 durumu güncellendi.

### Test Notları
- PDF şablonu A4 yatay, yeşil çerçeveli ve IDEC-YYYY-XXXXXXXX sertifika numarası formatındadır.
- İlk sertifika oluşturulduktan sonra DB'ye kaydedilir; sonraki isteklerde aynı kayıt kullanılır.
- Docker restart mevcut container imajı üzerinden yapıldı; `certificates` tablosu yeni kaynak kod rebuild/deploy edildiğinde Hibernate `DDL_AUTO=update` ile oluşacaktır.
- Bu compose projesinde mevcut container olarak yalnızca `backend` ve `db` görünüyor; frontend container bulunmadığı için toplu restart çıktısında frontend yer almadı.
