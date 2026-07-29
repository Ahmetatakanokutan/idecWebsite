# IDEC-TT Architecture

Bu belge IDEC-TT Website kod tabaninin mimarisini, sorumluluk ayrimlarini, veri modelini, guvenlik akisini ve operasyon kararlarini aciklar. Amac; yeni gelistirme, bakim, deploy ve refactor kararlarinda ortak teknik referans saglamaktir.

## 1. Sistem Ozeti

IDEC-TT Website uc ana parcadan olusur:

```text
Browser
  |
  | HTTP/HTTPS
  v
Nginx Frontend Container
  |-- statik React SPA dosyalari
  |-- /api/*     -> Spring Boot backend
  |-- /uploads/* -> Spring Boot backend
  v
Spring Boot Backend
  |
  | JDBC
  v
PostgreSQL
```

Frontend SPA kullanicinin gorecegi tum sayfalari ve admin panelini sunar. Backend REST API, kimlik dogrulama, rol bazli yetkilendirme, icerik yonetimi, dosya yukleme ve veritabani islemlerini yurutur. PostgreSQL kalici veriyi tutar. Upload dosyalari Docker volume icinde saklanir.

## 2. Bilesenler

### 2.1 Frontend

Konum: `src/`

Ana sorumluluklar:

- Sayfa rotalarini tanimlamak
- Public, authenticated ve admin gorunumlerini ayirmak
- JWT tabanli oturum durumunu tutmak
- API isteklerini merkezi servis uzerinden yapmak
- i18n kaynaklarini yuklemek
- Admin CRUD formlarini saglamak

Temel dosyalar:

| Dosya | Sorumluluk |
| --- | --- |
| `src/main.tsx` | React uygulamasini mount eder; `BrowserRouter` ve `AuthProvider` ekler |
| `src/App.tsx` | Rotalari ve global `KarbonBot` bilesenini render eder |
| `src/routes/index.tsx` | Public, authenticated ve admin route agacini tanimlar |
| `src/context/AuthContext.tsx` | JWT decode, login/logout, role state ve oturum kontrolu |
| `src/services/apiService.ts` | Fetch wrapper, auth header, hata parse, upload yardimcisi |
| `src/i18n.ts` | TR/EN kaynaklar ve dil algilama |
| `src/components/ProtectedRoute.tsx` | Route seviyesinde auth/role guard |
| `src/components/AdminLayout.tsx` | Admin panel layout'u |

Frontend API base URL secimi:

```text
VITE_API_BASE_URL varsa:
  {VITE_API_BASE_URL}/api

Yoksa:
  {window.location.origin}/api
```

Bu tasarim Docker/Nginx deploy'da ayni origin uzerinden API proxy kullanmayi kolaylastirir.

### 2.2 Backend

Konum: `backend/IdecTTBackend/`

Ana sorumluluklar:

- REST endpoint'leri
- Kimlik dogrulama ve JWT uretimi
- Role dayali yetkilendirme
- JPA entity/repository/service katmanlari
- E-posta dogrulama
- Dosya yukleme ve statik upload servis etme
- Baslangic rollerini ve opsiyonel seed verisini olusturma

Katmanlar:

```text
Controller -> Service -> Repository -> Entity -> PostgreSQL
Security Filter Chain -> JWT Filter -> UserDetailsService -> UserRepository
```

Controller'lar HTTP kontratini yonetir. Service katmani is kurallarini uygular. Repository katmani Spring Data JPA uzerinden veriye erisir. Entity siniflari veritabani semasini temsil eder.

### 2.3 Veritabani

Veritabani: PostgreSQL

Kalici veriler:

- Kullanicilar
- Roller
- Kurumsal profiller
- Projeler
- Kurslar
- Egitmenler
- Kurs bolumleri
- Dersler
- Favoriler
- Kurs kayitlari
- Duyurular

Hibernate DDL modu `DDL_AUTO` degiskeniyle kontrol edilir. Su an varsayilan `update` akisi gelistirme ve kucuk deploy'lar icin uygundur; production'da versiyonlu migration araci eklemek daha sagliklidir.

### 2.4 Nginx

Konum: `ops/nginx/frontend.conf`

Sorumluluklar:

- React build ciktisini servis etmek
- SPA route fallback uygulamak
- `/api/` isteklerini backend'e proxy etmek
- `/uploads/` isteklerini backend'e proxy etmek
- `client_max_body_size 500M` ile buyuk upload'a izin vermek

## 3. Runtime Akislari

### 3.1 Public Sayfa Akisi

```text
Kullanici -> React route -> apiService GET -> /api/projects veya /api/courses
Backend controller -> service -> repository -> PostgreSQL
Response -> React state -> UI render
```

Public GET endpoint'leri security konfigurasyonunda izinlidir.

### 3.2 Login Akisi

```text
LoginPage
  -> POST /api/auth/login
  -> AuthenticationManager
  -> UserDetailsServiceImpl
  -> BCrypt password kontrolu
  -> JwtUtils token uretir
  -> Frontend token'i localStorage'a yazar
  -> AuthContext token'i decode eder
```

Token icinden roller ve kullanici bilgisi okunur. Route guard'lar bu role listesini kullanir.

### 3.3 Kayit ve E-posta Dogrulama Akisi

```text
RegisterPage
  -> POST /api/auth/register
  -> MX domain kontrolu
  -> userType kontrolu
  -> Role atamasi
  -> Verification code uretimi
  -> EmailVerificationService
  -> Kullanici dogrulanmamis olarak kaydedilir

Kullanici e-posta linki
  -> GET /api/auth/verify?code=...
  -> Kullanici bulunur
  -> isEmailVerified=true
  -> verificationCode=null
  -> frontend login sayfasina redirect veya API response
```

Giris yapmadan once kullanicinin e-postasi dogrulanmis olmalidir.

### 3.4 Admin CRUD Akisi

```text
Admin sayfasi
  -> ProtectedRoute requiredRoles=['ROLE_ADMIN']
  -> apiService Authorization: Bearer {token}
  -> Backend JWT filter
  -> @PreAuthorize("hasRole('ADMIN')")
  -> Controller/Service/Repository
```

Admin paneli asagidaki alanlari yonetir:

- Projeler
- Kurslar
- Kurs bolumleri
- Dersler
- Egitmenler
- Duyurular
- Kullanicilar ve roller

### 3.5 Upload Akisi

```text
Admin formu
  -> apiService.uploadFile(file)
  -> POST /api/upload multipart/form-data
  -> FileUploadController
  -> boyut, uzanti, MIME type kontrolu
  -> uploads/{uuid}.{ext}
  -> response: /uploads/{fileName}
  -> ilgili entity image/videoUrl alaninda saklanir
```

Docker deploy'da upload dizini `backend_uploads` volume'unda kalici olur.

## 4. Veri Modeli

### 4.1 Ana Entity'ler

```text
User
  id
  username/email
  password
  fullName
  phone
  isEmailVerified
  verificationCode
  roles many-to-many Role
  companyProfile one-to-one CompanyProfile

Role
  id
  roleName: ROLE_USER | ROLE_COMPANY | ROLE_ADMIN

CompanyProfile
  id
  companyName
  taxId
  sector
  user one-to-one User

Project
  id
  title
  description
  image
  leader
  sectors element collection
  partners element collection
  objectives element collection
  outcomes element collection

Instructor
  id
  name
  title
  courses one-to-many Course

Course
  id
  title
  description
  image
  rating
  students
  instructor many-to-one Instructor
  sections one-to-many Section

Section
  id
  title
  orderIndex
  course many-to-one Course
  lessons one-to-many Lesson

Lesson
  id
  title
  duration
  videoUrl
  section many-to-one Section

Enrollment
  id
  user many-to-one User
  course many-to-one Course
  enrolledAt
  unique(user_id, course_id)

Favorite
  id
  user many-to-one User
  course many-to-one Course
  unique(user_id, course_id)

Announcement
  id
  title
  content
  imageUrl
  active
  createdAt
```

### 4.2 Iliski Ozeti

```text
User *--* Role
User 1--0..1 CompanyProfile
User 1--* Enrollment *--1 Course
User 1--* Favorite *--1 Course
Instructor 1--* Course
Course 1--* Section
Section 1--* Lesson
Project -> element collections: sectors, partners, objectives, outcomes
Announcement bagimsiz icerik entity'si
```

### 4.3 DTO Kullanimi

Backend dogrudan entity donmenin riskli oldugu alanlarda DTO kullanir:

- `CourseSummaryDto`
- `CourseDetailDto`
- `CourseCreateDto`
- `CourseUpdateDto`
- `SectionDto`
- `LessonDto`
- `ProjectDto`
- `InstructorDto`
- `InstructorForListDto`
- `UserDto`
- `UserUpdateDto`

DTO'lar lazy relation sorunlarini azaltir, frontend kontratini sade tutar ve hassas alanlarin response'a sizmasini engeller.

## 5. API Yuzeyi

Ana endpoint gruplari:

```text
/api/auth
/api/projects
/api/courses
/api/instructors
/api/announcements
/api/users
/api/upload
/api/test
```

Yetki modeli:

- Public: auth endpoint'leri, proje/kurs/duyuru public GET endpoint'leri
- Authenticated: profil, favori, kurs kaydi
- Admin: icerik yonetimi ve kullanici yonetimi

Frontend tum istekleri `apiService` ile yapar. Bu servis:

- `Authorization: Bearer ...` header'ini otomatik ekler
- JSON request/response isler
- Backend hata mesajlarini normalize eder
- Upload icin `Content-Type` header'ini tarayicinin multipart olarak ayarlamasina izin verir

## 6. Guvenlik Mimarisi

### 6.1 Authentication

Backend stateless JWT kullanir.

```text
AuthTokenFilter
  -> Authorization header okur
  -> JWT validate eder
  -> UserDetailsServiceImpl ile kullaniciyi yukler
  -> SecurityContext'e Authentication yazar
```

Sifreleme:

- Kullanici sifreleri BCrypt ile hashlenir.
- Login sirasinda `AuthenticationManager` ve DAO provider kullanilir.

### 6.2 Authorization

Authorization iki seviyede uygulanir:

1. `SecurityConfig` icinde URL/method bazli kurallar
2. Controller metotlarinda `@PreAuthorize`

Rol formatlari:

- Entity enum: `ROLE_ADMIN`
- Spring expression: `hasRole('ADMIN')`
- Frontend route guard: `ROLE_ADMIN`

Bu fark bilincli olarak korunmalidir; Spring `hasRole('ADMIN')` ifadesi otomatik `ROLE_` prefix'i varsayar.

### 6.3 CORS

CORS izinleri `idectt.app.cors.allowedOrigins` property degerinden gelir. Deger `CORS_ALLOWED_ORIGINS` ortam degiskenine baglidir ve virgulle ayrilmis origin listesi bekler.

### 6.4 Upload Guvenligi

Upload guvenlik kontrolleri:

- Maksimum boyut: 500 MB
- Izinli uzanti listesi
- Izinli MIME type listesi
- UUID tabanli dosya adi
- `StringUtils.cleanPath` ile orijinal ad temizleme

Ek oneriler:

- Production'da virus/malware taramasi
- Video transcoding veya metadata temizleme
- Object storage kullanimi
- Auth/role kontrolunun controller annotation ile acik hale getirilmesi

## 7. Frontend Mimari Detaylari

### 7.1 Route Guard

`ProtectedRoute` authenticated sayfalar ve admin sayfalari icin kullanilir.

```text
/profile, /favorites
  -> giris yapmis kullanici

/admin/*
  -> ROLE_ADMIN
```

### 7.2 State Yonetimi

Global state sadece auth icin React Context ile tutulur. Diger sayfa verileri sayfa/component state'i olarak API'den yuklenir.

Bu yaklasim kucuk/orta olcekli admin panel icin sadedir. Daha buyuk veri tekrar kullaniminda React Query gibi cache katmani eklenebilir.

### 7.3 i18n

i18next:

- `tr` ve `en` kaynaklarini yukler
- Varsayilan dil `tr`
- Dil algilama sirasi: `localStorage`, sonra `navigator`
- Secilen dil `localStorage` icinde cache'lenir

### 7.4 API Hata Davranisi

`apiService` basarisiz response'larda:

- JSON body parse etmeye calisir
- `message` alanini oncelikli kullanir
- Validation errors varsa `defaultMessage` alanlarini birlestirir
- Aksi halde HTTP status mesajini kullanir

## 8. Backend Mimari Detaylari

### 8.1 Controller Katmani

Controller'lar HTTP method, path, request body validation ve response tiplerini tanimlar.

Ornekler:

- `AuthController`: register, login, verify
- `ProjectController`: proje CRUD
- `CourseController`: kurs, bolum, ders, favori, kayit
- `InstructorController`: egitmen CRUD
- `AnnouncementController`: duyuru CRUD
- `UserController`: profil ve admin kullanici yonetimi
- `FileUploadController`: multipart upload

### 8.2 Service Katmani

Service katmani is kurallarini ve entity/DTO donusumlerini tasir.

Ana servisler:

- `CourseService`
- `ProjectService`
- `InstructorService`
- `AnnouncementService`
- `EmailVerificationService`

### 8.3 Repository Katmani

Repository'ler Spring Data JPA arayuzleridir. Entity bazli CRUD ve ozel sorgu metotlari burada yer alir.

Onemli repository'ler:

- `UserRepository`
- `RoleRepository`
- `CourseRepository`
- `ProjectRepository`
- `InstructorRepository`
- `EnrollmentRepository`
- `FavoriteRepository`
- `AnnouncementRepository`
- `CompanyProfileRepository`

### 8.4 Exception Handling

`GlobalExceptionHandler` merkezi hata yakalama icin bulunur. Controller seviyesinde bazi islemler ayrica `ResponseEntity` ile spesifik hata doner.

## 9. Deployment Mimarisi

### 9.1 Docker Compose Servisleri

```text
db
  image: postgres:16-alpine
  volume: postgres_data
  healthcheck: pg_isready

backend
  build: backend/IdecTTBackend/Dockerfile
  depends_on: db healthy
  volume: backend_uploads:/app/uploads
  port: 8080

frontend
  build: Dockerfile.frontend
  depends_on: backend
  port: 80
```

### 9.2 Network

Compose servisleri ayni Docker network'unde calisir. Nginx `backend:8080` DNS adiyla backend'e ulasir. Backend `db:5432` DNS adiyla PostgreSQL'e ulasir.

### 9.3 Volume'lar

| Volume | Sorumluluk |
| --- | --- |
| `postgres_data` | PostgreSQL kalici veri |
| `backend_uploads` | Yuklenen medya dosyalari |

### 9.4 Production Ortam Degerleri

Production'da en az su degerler net verilmelidir:

```env
POSTGRES_PASSWORD=...
JWT_SECRET=...
CORS_ALLOWED_ORIGINS=https://alanadiniz
FRONTEND_BASE_URL=https://alanadiniz
BACKEND_BASE_URL=https://alanadiniz
MAIL_ENABLED=true
MAIL_HOST=...
MAIL_USERNAME=...
MAIL_PASSWORD=...
DDL_AUTO=validate
```

`DDL_AUTO=validate` kullanilacaksa sema migration'lari ayrica yonetilmelidir.

## 10. Operasyon ve Yedekleme

Mevcut operasyon dosyalari:

- `ops/migration/export-live-bundle.sh`
- `ops/migration/restore-live-bundle.sh`
- `ops/systemd/idectt-db-backup-gdrive.service`
- `ops/systemd/idectt-db-backup-gdrive.timer`
- `scripts/idectt-db-backup-gdrive.sh`
- `ops/backup.env.example`

Yedekleme stratejisi:

- PostgreSQL dump periyodik alinmali
- Upload volume'u ayrica yedeklenmeli
- Restore proseduru duzenli test edilmeli
- Secrets dosyalari yedek bundle icinde kontrolsuz tutulmamali

## 11. Kod Kalitesi ve Test Stratejisi

Mevcut test altyapisi:

- Frontend: lint ve build komutlari
- Backend: Spring Boot test dependency'leri ve context test

Onerilen test piramidi:

```text
Backend unit tests
  -> service methodlari, DTO mapping, validation

Backend integration tests
  -> auth, role checks, CRUD endpoint'leri, upload

Frontend component/route tests
  -> ProtectedRoute, AuthContext, admin forms

E2E smoke tests
  -> login, admin CRUD, course view, upload
```

Kritik test senaryolari:

- Dogrulanmamis kullanici login olamaz
- Son admin silinemez
- Admin olmayan kullanici admin endpoint'ine erisemez
- Duplicate favorite/enrollment olusmaz
- Upload izin verilmeyen MIME type'i reddeder
- Nginx SPA fallback route refresh'te calisir

## 12. Teknik Borclar ve Riskler

### 12.1 Package Tutarsizligi

Kodda iki package kokunun birlikte kullanildigi gorulur:

```text
com.example.IdecTTBackend
com.example.idectt
```

Ana uygulama sinifi `com.example.IdecTTBackend` altindadir. `com.example.idectt` altindaki component/entity/repository siniflarinin scan edildiginden emin olunmalidir. Uzun vadede tek package kokune gecmek bakimi kolaylastirir.

### 12.2 Karakter Kodlama

Bazi Java ve TypeScript dosyalarinda Turkce karakterler bozuk gorunuyor. Kaynak dosyalari UTF-8'e normalize edilmeli ve seed data yeniden yazilmalidir.

### 12.3 Migration Eksikligi

Hibernate `update` sema degisikliklerini otomatik uygular, fakat production icin yeterli izlenebilirlik saglamaz. Flyway veya Liquibase eklenmesi onerilir.

### 12.4 Password Reset Eksikligi

Frontend'de `ForgotPasswordPage` var, ancak backend parola sifirlama endpoint'i mevcut taramada gorunmuyor. Bu akisin tamamlanmasi gerekir.

### 12.5 Frontend Dependency Temizligi

`@supabase/supabase-js` bagimliligi mevcut, ancak aktif kullanim gorulmedi. Kullanilmiyorsa kaldirilabilir.

### 12.6 API Kontrat Dokumantasyonu

Swagger/OpenAPI bulunmuyor. Backend'e `springdoc-openapi` eklenmesi admin ve frontend gelistirme hizini artirir.

### 12.7 Upload Storage

Upload'lar lokal volume'da tutuluyor. Tek sunucu icin yeterlidir; yatay olcekleme veya CDN ihtiyacinda object storage tercih edilmelidir.

## 13. Gelistirme Ilkeleri

Yeni ozellik eklerken:

1. Entity veya DTO degisikligi gerekiyorsa backend kontratini once netlestir.
2. Controller endpoint'ini role kuraliyla beraber tanimla.
3. Service katmanina is kuralini koy.
4. Repository'ye sadece veri erisimi sorumlulugu ver.
5. Frontend'de API cagrisini `apiService` uzerinden yap.
6. Auth gerektiren route'lari `ProtectedRoute` ile koru.
7. Yeni user-facing metinleri i18n dosyalarina ekle.
8. Upload veya secret iceren islemlerde production guvenlik etkisini kontrol et.

## 14. Onerilen Gelecek Yol Haritasi

Kisa vade:

- UTF-8 karakter bozulmalarini duzelt
- `tsconfig.node.json` dosyasini tamamla veya kaldir
- Password reset backend akisini ekle
- Upload endpoint'ine acik `@PreAuthorize` ekle
- Basit OpenAPI dokumantasyonu ekle

Orta vade:

- Flyway/Liquibase migration ekle
- Backend integration testlerini artir
- Frontend smoke/E2E testleri ekle
- Kullanilmayan dependency'leri temizle
- Seed data'yi profile bazli hale getir

Uzun vade:

- Object storage ve CDN entegrasyonu
- Audit log
- Admin islemleri icin detayli yetki matrisi
- Course progress tracking
- Monitoring, metrics ve merkezi loglama
