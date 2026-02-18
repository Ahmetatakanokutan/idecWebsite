# IDEC-TT Projesi: Kapsamlı Teknik Rehber ve Dokümantasyon

Bu doküman, IDEC-TT (Endüstriyel Dekarbonizasyon Projesi) web uygulamasının mimarisi, kod yapısı, yapılan geliştirmeler ve sunucu kurulum süreçlerini detaylı bir şekilde anlatmak için hazırlanmıştır.

---

## 1. Proje Özeti ve Amacı

**IDEC-TT**, endüstriyel dekarbonizasyon süreçlerini desteklemek, eğitimler vermek ve projeleri tanıtmak amacıyla geliştirilmiş tam yığın (Full-Stack) bir web uygulamasıdır.

*   **Kullanıcılar:** Bireysel ve Kurumsal üyeler kayıt olup eğitim alabilir.
*   **Admin:** Sistemdeki tüm içerikleri (Kurslar, Projeler, Kullanıcılar, Eğitmenler) yönetebilir.
*   **Temel İşlevler:** Dinamik kurs yönetimi (Udemy benzeri müfredat yapısı), video eğitimi, favori listesi, proje vitrini.

---

## 2. Teknoloji Yığını (Tech Stack)

### Frontend (Kullanıcı Arayüzü)
*   **Framework:** React 18 (TypeScript ile)
*   **Build Tool:** Vite (Hızlı derleme ve geliştirme için)
*   **Styling:** Tailwind CSS (Modern ve hızlı stil oluşturma)
*   **Routing:** React Router DOM (Sayfa geçişleri)
*   **İkonlar:** Lucide React
*   **UI Bileşenleri:** Headless UI (Erişilebilir modal ve menüler için)

### Backend (Sunucu ve API)
*   **Framework:** Spring Boot 3.x (Java 17)
*   **Veritabanı:** PostgreSQL
*   **ORM:** Spring Data JPA (Hibernate)
*   **Güvenlik:** Spring Security + JWT (JSON Web Token)
*   **API Tipi:** RESTful API

---

## 3. Proje Mimarisi ve Klasör Yapısı

### 3.1 Backend Yapısı (`backend/IdecTTBackend/src/main/java/...`)

Backend, klasik **Katmanlı Mimari (Layered Architecture)** prensibine göre tasarlanmıştır.

1.  **`controller/` (Garson):** Dış dünyadan gelen istekleri (HTTP Request) karşılar.
    *   `AuthController`: Giriş ve Kayıt işlemleri.
    *   `CourseController`: Kurs, Bölüm, Ders ve Favori işlemleri.
    *   `UserController`: Profil güncelleme ve kullanıcı yönetimi.
    *   `FileUploadController`: Resim ve video yükleme işlemleri.
2.  **`service/` (Aşçı):** İş mantığının (Business Logic) döndüğü yerdir.
    *   `CourseService`: Kurs oluşturma, öğrenci kaydı (enrollment), favori ekleme gibi karmaşık işleri yapar.
    *   `UserDetailsServiceImpl`: Kullanıcı kimlik doğrulama mantığı.
3.  **`repository/` (Kiler):** Veritabanı ile konuşan katmandır (SQL yazmadan veri çeker).
    *   `UserRepository`, `CourseRepository`, `EnrollmentRepository` vb.
4.  **`entity/` (Malzemeler):** Veritabanı tablolarının Java karşılıklarıdır.
    *   `User`, `Role`, `Course`, `Section`, `Lesson`, `Enrollment`, `Favorite`.
5.  **`payload/dto/` (Servis Tepsisi):** Veri transfer objeleri. Entity'lerin tamamını dışarı açmak yerine sadece gerekli veriyi taşır.
    *   `CourseDetailDto`: Kursun detaylarını, bölümlerini ve derslerini içeren yapı.
6.  **`security/` (Güvenlik Görevlisi):**
    *   `SecurityConfig`: Hangi sayfaya kimin girebileceğini belirler (CORS, CSRF ayarları burada).
    *   `JwtUtils`: Token oluşturma ve doğrulama.

### 3.2 Frontend Yapısı (`src/`)

1.  **`pages/`:** Her bir rota (URL) için ana sayfa bileşenleri.
    *   `HomePage`: Slider ve istatistiklerin olduğu açılış sayfası.
    *   `CourseDetailPage`: Udemy benzeri video oynatıcı ve müfredat listesi.
    *   `admin/`: Sadece adminlerin görebileceği yönetim sayfaları (`ManageUsers`, `ManageCourses` vb.).
2.  **`components/`:** Tekrar kullanılabilir parçalar.
    *   `Header`, `Footer`, `Layout`, `ProtectedRoute` (Giriş kontrolü yapan bekçi).
3.  **`context/`:** Uygulama genelinde veri taşıma.
    *   `AuthContext`: Kullanıcının giriş yapıp yapmadığını, rolünü ve adını tüm uygulamaya dağıtır.
4.  **`services/`:** API ile konuşan birim.
    *   `apiService.ts`: Backend'e istek atan (Fetch wrapper) merkezi dosya. Token'ı otomatik ekler.

---

## 4. Kritik Geliştirmeler ve Çözümler

Bu proje geliştirilirken karşılaşılan zorluklar ve uygulanan özel çözümler:

### A. CORS ve Güvenlik (Nükleer Çözüm)
Tarayıcıların güvenlik engeline (CORS) takılmamak için `SecurityConfig.java` içinde özel bir `CorsFilter` Bean'i tanımladık. Bu, Spring Security devreye girmeden önce tarayıcıya "İzin ver" diyerek sorunsuz bir iletişim sağladı.

### B. Udemy Tarzı Müfredat Yapısı
Başlangıçta `Course -> Lesson` şeklindeki düz yapı, `Course -> Section -> Lesson` hiyerarşisine dönüştürüldü.
*   **Backend:** Sonsuz JSON döngüsüne girmemesi için `@JsonManagedReference` ve `@JsonBackReference` anotasyonları kullanıldı.
*   **Frontend:** `CourseDetailPage` içinde Accordion (Açılır/Kapanır) menü yapısı kuruldu.

### C. Video ve Dosya Yükleme
*   Büyük video dosyalarının yüklenebilmesi için Spring Boot limitleri (500MB) artırıldı.
*   Yüklenen dosyalar sunucuda `uploads` klasöründe saklanıyor ve `/uploads/**` yolu üzerinden dışarıya sunuluyor.
*   YouTube videoları için otomatik `Embed URL` dönüştürücü yazıldı.

### D. Sunucu Kurulumu (AWS & Nginx)
Uygulama AWS Ubuntu sunucusuna "Production Ready" (Canlıya Hazır) şekilde kuruldu:
*   **Nginx (Reverse Proxy):** Gelen istekleri (`/api`) Backend'e (8080), diğer istekleri Frontend'e yönlendiriyor.
*   **Systemd Service:** Backend uygulamasının sunucu yeniden başlasa bile otomatik çalışması sağlandı.
*   **Swap Alanı:** Sunucunun RAM'i yetmediği için diskin bir kısmı RAM gibi kullanılarak (`Swap`) derleme (build) işlemleri hızlandırıldı.

---

## 5. Veritabanı Şeması (Özet)

*   **users:** Kullanıcı bilgileri (username, password, full_name).
*   **roles:** Roller (ROLE_USER, ROLE_ADMIN).
*   **courses:** Kurs başlığı, açıklaması, resmi.
*   **sections:** Kursun bölümleri (Giriş, Modül 1 vb.).
*   **lessons:** Ders videoları ve süreleri.
*   **enrollments:** Hangi kullanıcı hangi kursa kayıtlı? (Çoka-çok ilişki).
*   **favorites:** Kullanıcıların favori kursları.

---

## 6. Nasıl Çalıştırılır?

### Lokal Ortamda (Kendi Bilgisayarın)
1.  **Backend:** IntelliJ IDEA ile `IdecTTBackend` projesini aç ve çalıştır (Port 8080).
2.  **Frontend:** VS Code terminalinde `npm run dev` komutunu çalıştır (Port 5173).

### Sunucuda Güncelleme Yapmak İçin
Eğer kodda değişiklik yaparsan sunucuda şu adımları izle:

1.  **Kodu Çek:** `git pull`
2.  **Backend Derle:** `cd backend/IdecTTBackend && ./mvnw clean package -DskipTests`
3.  **Backend Yeniden Başlat:** `sudo systemctl restart idectt`
4.  **Frontend Derle:** `cd ~/idecWebsite && npm install && npm run build`
5.  **Frontend Yayınla:** `sudo cp -r dist/* /var/www/idectt/`

---

*Bu proje, modern web teknolojileri ve en iyi uygulama pratikleri (Best Practices) kullanılarak, ölçeklenebilir ve güvenli bir mimari üzerine inşa edilmiştir.*
