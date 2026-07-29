# IDEC-TT Website

IDEC-TT Website, endustriyel dekarbonizasyon ve ikiz donusum odakli bir egitim, proje ve duyuru platformudur. Proje; React tabanli bir web arayuzu, Spring Boot tabanli REST API, PostgreSQL veritabani, dosya yukleme altyapisi ve Docker ile calistirilabilir operasyon paketi icerir.

## Icerik

- Herkese acik ana sayfa, hakkimizda/iletisim, projeler, kurslar ve kurs detaylari
- Kullanici kaydi, e-posta dogrulama, giris, profil ve favoriler
- Bireysel ve kurumsal kullanici kayit akislari
- Admin paneli ile proje, kurs, ders, egitmen, duyuru ve kullanici yonetimi
- Kurslara kaydolma ve favoriye ekleme
- Gorsel/video yukleme ve `/uploads` uzerinden servis etme
- Turkce/Ingilizce i18n altyapisi
- Nginx reverse proxy, Docker Compose, PostgreSQL volume, migration ve yedekleme scriptleri

## Teknoloji Stack'i

### Frontend

- React 18
- TypeScript
- Vite 5
- React Router 7
- Tailwind CSS
- i18next / react-i18next
- lucide-react
- Headless UI

### Backend

- Java 17
- Spring Boot 3.5.7
- Spring Web
- Spring Security
- Spring Data JPA
- Spring Validation
- Spring Mail
- PostgreSQL
- JWT, JJWT 0.13.0
- Lombok

### Operasyon

- Docker Compose
- Nginx Alpine
- PostgreSQL 16 Alpine
- Systemd timer/service ornekleri
- Google Drive yedekleme script ornegi

## Proje Yapisi

```text
.
+-- src/                         # React frontend
|   +-- components/              # Layout, header, footer, admin layout, KarbonBot
|   +-- context/                 # AuthContext
|   +-- hooks/                   # Ortak React hook'lari
|   +-- locales/                 # tr/en ceviri dosyalari
|   +-- pages/                   # Public, auth, profile ve admin sayfalari
|   +-- routes/                  # React Router rota tanimlari
|   +-- services/                # API istemcisi
+-- backend/IdecTTBackend/       # Spring Boot backend
|   +-- src/main/java/           # Controller, service, repository, entity, security
|   +-- src/main/resources/      # application.properties
+-- ops/                         # nginx, migration, systemd operasyon dosyalari
+-- scripts/                     # yedekleme scriptleri
+-- public/                      # statik public varliklar
+-- docker-compose.yml           # db + backend + frontend
+-- Dockerfile.frontend          # frontend build + nginx image
+-- .env.docker.example          # Docker ortam degiskenleri ornegi
```

## Hizli Baslangic: Docker

1. Ornek ortam dosyasini kopyalayin.

```powershell
Copy-Item .env.docker.example .env
```

2. `.env` icindeki degerleri duzenleyin. En azindan asagidakiler degistirilmelidir:

```env
POSTGRES_PASSWORD=guclu_bir_sifre
JWT_SECRET=minimum_32_karakter_uzun_rastgele_secret
```

3. Servisleri baslatin.

```powershell
docker compose up --build
```

4. Uygulama varsayilan olarak su adreslerde calisir:

- Frontend: `http://localhost`
- Backend API: `http://localhost/api`
- PostgreSQL: `localhost:5432`

Docker kurulumunda frontend Nginx icinden servis edilir. `/api/` ve `/uploads/` istekleri backend container'ina proxy edilir.

## Lokal Gelistirme

### Gereksinimler

- Node.js 20 veya uyumlu guncel LTS
- npm
- Java 17
- PostgreSQL
- Maven wrapper proje icinde mevcut

### Frontend

```powershell
npm install
npm run dev
```

Varsayilan Vite adresi:

```text
http://localhost:5173
```

Backend farkli bir origin'de calisiyorsa frontend icin ortam degiskeni verilebilir:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Bu deger verilmezse frontend API base URL olarak mevcut `window.location.origin` degerini kullanir ve `/api` ekler.

### Backend

```powershell
cd backend\IdecTTBackend
.\mvnw.cmd spring-boot:run
```

Backend varsayilan olarak `http://localhost:8080` uzerinde calisir.

Backend'in calismasi icin PostgreSQL ve asagidaki kritik ortam degiskenleri gerekir:

```env
DB_URL=jdbc:postgresql://localhost:5432/idecttDb
DB_USERNAME=postgres
DB_PASSWORD=postgres_sifresi
JWT_SECRET=minimum_32_karakter_uzun_rastgele_secret
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
FRONTEND_BASE_URL=http://localhost:5173
BACKEND_BASE_URL=http://localhost:8080
```

## Komutlar

### Frontend

```powershell
npm run dev       # Vite gelistirme sunucusu
npm run build     # production build
npm run preview   # build ciktisini lokal onizleme
npm run lint      # ESLint
```

### Backend

```powershell
cd backend\IdecTTBackend
.\mvnw.cmd test
.\mvnw.cmd package
.\mvnw.cmd spring-boot:run
```

### Docker

```powershell
docker compose config
docker compose up --build
docker compose ps
docker compose logs backend --tail=200
docker compose down
```

## Ortam Degiskenleri

### Docker / Backend

| Degisken | Aciklama | Varsayilan |
| --- | --- | --- |
| `POSTGRES_DB` | PostgreSQL veritabani adi | `idecttDb` |
| `POSTGRES_USER` | PostgreSQL kullanicisi | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL sifresi | `postgres` |
| `POSTGRES_PORT` | Host PostgreSQL portu | `5432` |
| `BACKEND_PORT` | Host backend portu | `8080` |
| `FRONTEND_PORT` | Host frontend portu | `80` |
| `DB_URL` | Backend JDBC URL | Docker'da `db:5432` |
| `DB_USERNAME` | Backend DB kullanicisi | `POSTGRES_USER` |
| `DB_PASSWORD` | Backend DB sifresi | `POSTGRES_PASSWORD` |
| `JWT_SECRET` | JWT imzalama anahtari | Guvenli deger verilmeli |
| `DDL_AUTO` | Hibernate DDL modu | `update` |
| `CORS_ALLOWED_ORIGINS` | Virgulle ayrilmis izinli origin listesi | localhost |
| `FRONTEND_BASE_URL` | E-posta dogrulama redirect hedefi | localhost |
| `BACKEND_BASE_URL` | E-posta dogrulama linki icin backend base URL | localhost |
| `MAIL_ENABLED` | E-posta gonderimi aktif mi | `false` |
| `MAIL_HOST` | SMTP host | bos |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_USERNAME` | SMTP kullanicisi | bos |
| `MAIL_PASSWORD` | SMTP sifresi | bos |
| `MAIL_FROM` | Gonderen adres | `MAIL_USERNAME` |
| `BOOTSTRAP_ADMIN_ENABLED` | Ilk admin hesabi otomatik olusturulsun mu | `false` |
| `BOOTSTRAP_ADMIN_EMAIL` | Bootstrap admin e-postasi | bos |
| `BOOTSTRAP_ADMIN_PASSWORD` | Bootstrap admin sifresi | bos |
| `BOOTSTRAP_ADMIN_FULLNAME` | Bootstrap admin adi | `IDEC-TT Admin` |
| `BOOTSTRAP_ADMIN_PHONE` | Bootstrap admin telefonu | bos |

### Frontend

| Degisken | Aciklama |
| --- | --- |
| `VITE_API_BASE_URL` | API'nin base origin degeri. Ornek: `http://localhost:8080`. Verilmezse mevcut origin kullanilir. |

## Rotalar

### Public

| Rota | Sayfa |
| --- | --- |
| `/` | Ana sayfa |
| `/about` | Hakkimizda |
| `/contact` | Iletisim icin AboutPage kullanilir |
| `/projects` | Proje listesi |
| `/projects/:projectId` | Proje detayi |
| `/courses` | Kurs listesi |
| `/courses/:courseId` | Kurs detayi |
| `/login` | Giris |
| `/register` | Kayit |
| `/verify-email` | E-posta dogrulama |
| `/forgot-password` | Sifremi unuttum |

### Giris Gerektiren

| Rota | Yetki |
| --- | --- |
| `/profile` | Her giris yapmis kullanici |
| `/favorites` | Her giris yapmis kullanici |

### Admin

| Rota | Sayfa |
| --- | --- |
| `/admin` | Admin dashboard |
| `/admin/projects` | Proje yonetimi |
| `/admin/courses` | Kurs yonetimi |
| `/admin/courses/:courseId/lessons` | Kurs bolum/ders yonetimi |
| `/admin/instructors` | Egitmen yonetimi |
| `/admin/users` | Kullanici yonetimi |
| `/admin/announcements` | Duyuru yonetimi |

## API Ozeti

Tum endpoint'ler `/api` altindadir.

### Auth

| Metot | Endpoint | Yetki | Aciklama |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Bireysel veya kurumsal kullanici kaydi |
| `POST` | `/auth/login` | Public | JWT uretir |
| `GET` | `/auth/verify?code=...` | Public | E-posta dogrulama; default redirect modu |
| `GET` | `/auth/verify?code=...&mode=api` | Public | API response ile dogrulama |

### Projeler

| Metot | Endpoint | Yetki | Aciklama |
| --- | --- | --- | --- |
| `GET` | `/projects` | Public | Tum projeler |
| `GET` | `/projects/{id}` | Public | Proje detayi |
| `POST` | `/projects` | Admin | Proje olustur |
| `PUT` | `/projects/{id}` | Admin | Proje guncelle |
| `DELETE` | `/projects/{id}` | Admin | Proje sil |

### Kurslar, Bolumler, Dersler

| Metot | Endpoint | Yetki | Aciklama |
| --- | --- | --- | --- |
| `GET` | `/courses` | Public | Kurs listesi |
| `GET` | `/courses/{id}` | Public | Kurs detayi |
| `POST` | `/courses` | Admin | Kurs olustur |
| `PUT` | `/courses/{id}` | Admin | Kurs guncelle |
| `DELETE` | `/courses/{id}` | Admin | Kurs sil |
| `POST` | `/courses/{courseId}/sections` | Admin | Kursa bolum ekle |
| `PUT` | `/courses/sections/{sectionId}` | Admin | Bolum basligi guncelle |
| `DELETE` | `/courses/sections/{sectionId}` | Admin | Bolum sil |
| `POST` | `/courses/sections/{sectionId}/lessons` | Admin | Bolume ders ekle |
| `PUT` | `/courses/lessons/{lessonId}` | Admin | Ders guncelle |
| `DELETE` | `/courses/lessons/{lessonId}` | Admin | Ders sil |
| `POST` | `/courses/{id}/enroll` | Auth | Kursa kaydol |
| `POST` | `/courses/{id}/favorite` | Auth | Favori durumunu degistir |
| `GET` | `/courses/favorites` | Auth | Kullanici favorileri |

### Egitmenler

| Metot | Endpoint | Yetki | Aciklama |
| --- | --- | --- | --- |
| `GET` | `/instructors` | Public | Egitmen listesi |
| `POST` | `/instructors` | Admin | Egitmen olustur |
| `PUT` | `/instructors/{id}` | Admin | Egitmen guncelle |
| `DELETE` | `/instructors/{id}` | Admin | Egitmen sil |

### Duyurular

| Metot | Endpoint | Yetki | Aciklama |
| --- | --- | --- | --- |
| `GET` | `/announcements/active` | Public | Aktif duyurular |
| `GET` | `/announcements` | Admin | Tum duyurular |
| `GET` | `/announcements/{id}` | Admin | Duyuru detayi |
| `POST` | `/announcements` | Admin | Duyuru olustur |
| `PUT` | `/announcements/{id}` | Admin | Duyuru guncelle |
| `DELETE` | `/announcements/{id}` | Admin | Duyuru sil |
| `POST` | `/announcements/{id}/delete` | Admin | DELETE desteklemeyen istemciler icin silme |

### Kullanicilar

| Metot | Endpoint | Yetki | Aciklama |
| --- | --- | --- | --- |
| `GET` | `/users/me` | Auth | Mevcut profil |
| `PUT` | `/users/me` | Auth | Kendi profilini guncelle |
| `GET` | `/users` | Admin | Kullanici listesi |
| `PUT` | `/users/{id}` | Admin | Kullanici, rol ve dogrulama durumu guncelle |
| `DELETE` | `/users/{id}` | Admin | Kullanici sil |

### Upload

| Metot | Endpoint | Yetki | Aciklama |
| --- | --- | --- | --- |
| `POST` | `/upload` | Auth varsayimi | `file` multipart alanini yukler, `/uploads/{uuid}.{ext}` doner |

Desteklenen uzantilar: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.mp4`, `.webm`, `.ogg`, `.mov`.

Maksimum dosya boyutu: `500MB`.

## Kullanici Rolleri

- `ROLE_USER`: Bireysel kullanici
- `ROLE_COMPANY`: Kurumsal kullanici
- `ROLE_ADMIN`: Admin paneli ve icerik yonetimi yetkisi

JWT token frontend tarafinda `localStorage` icinde `token` anahtariyla saklanir. `AuthContext`, token'i decode ederek oturum, roller ve kullanici adini uygulamaya saglar.

## Veritabani ve Baslangic Verisi

Backend acilisinda `DataInitializer` sunlari yapar:

- `ROLE_ADMIN`, `ROLE_USER`, `ROLE_COMPANY` rollerini olusturur.
- `BOOTSTRAP_ADMIN_ENABLED=true` ise admin kullanicisini olusturur veya mevcut kullaniciyi admin yapar.
- Veritabani bos ise ornek kurslar, egitmenler ve projeler ekler.

Hibernate DDL modu `DDL_AUTO` ile kontrol edilir. Gelistirmede `update` pratik olabilir; production icin kontrollu migration stratejisi tercih edilmelidir.

## Dosya Yukleme

Backend dosyalari calisma dizinindeki `uploads` klasorune kaydeder. Docker ortaminda bu klasor `backend_uploads` volume'una baglidir. Nginx `/uploads/` isteklerini backend'e proxy eder.

Guvenlik kontrolleri:

- Dosya bos olamaz.
- Boyut `500MB` uzerinde olamaz.
- Uzanti ve MIME type izin listesinde olmalidir.
- Dosya adi UUID ile uretilir.

## E-posta Dogrulama

Kayit akisi e-posta alanini username olarak kullanir. Register sirasinda:

1. E-posta domain'i icin MX kaydi kontrol edilir.
2. Bireysel kullanici `ROLE_USER`, kurumsal kullanici `ROLE_COMPANY` alir.
3. Kullanici dogrulanmamis olarak kaydedilir.
4. Dogrulama kodu uretilir.
5. `EmailVerificationService` dogrulama e-postasi gonderir.
6. E-posta gonderilemezse kullanici kaydi geri alinir.

`MAIL_ENABLED=false` iken e-posta servis davranisi backend implementasyonuna baglidir; gercek kayit akisinda SMTP ayarlari yapilmalidir.

## Guvenlik Notlari

- Backend stateless JWT authentication kullanir.
- CSRF kapali, CORS izinleri ortam degiskeninden okunur.
- Public GET endpoint'leri ayridir; admin write islemleri `hasRole('ADMIN')` ile korunur.
- Kendi hesabini silme ve son admin kullaniciyi silme engellenir.
- Sifreler BCrypt ile hashlenir.
- Production'da `JWT_SECRET`, DB sifresi ve SMTP sifreleri varsayilan birakilmamalidir.

## Build ve Deploy

Docker tabanli deploy onerilen akistir:

```powershell
Copy-Item .env.docker.example .env
docker compose up --build -d
```

Frontend image iki asamalidir:

1. Node 20 Alpine ile `npm ci` ve `npm run build`
2. Nginx 1.27 Alpine ile `dist` klasorunun servis edilmesi

Backend image iki asamalidir:

1. Temurin 17 JDK ile Maven package
2. Temurin 17 JRE ile `app.jar` calistirma

Nginx konfiguru SPA fallback icin `try_files $uri $uri/ /index.html` kullanir.

## Test ve Kalite

Mevcut komutlar:

```powershell
npm run lint
npm run build
cd backend\IdecTTBackend
.\mvnw.cmd test
```

Mevcut backend test dosyasi temel Spring context testidir. Kritik is akislari icin ek test onerileri:

- Auth register/login/verify entegrasyon testleri
- Admin CRUD endpoint testleri
- Kurs favori/kayit akisi testleri
- Upload izinli/izinsiz MIME ve boyut testleri
- Frontend route guard ve admin panel smoke testleri

## Operasyon Dosyalari

- `ops/nginx/frontend.conf`: SPA, `/api` ve `/uploads` reverse proxy
- `ops/migration/export-live-bundle.sh`: canli ortam export yardimcisi
- `ops/migration/restore-live-bundle.sh`: canli ortam restore yardimcisi
- `ops/systemd/idectt-db-backup-gdrive.service`: yedekleme service ornegi
- `ops/systemd/idectt-db-backup-gdrive.timer`: zamanlayici ornegi
- `scripts/idectt-db-backup-gdrive.sh`: PostgreSQL yedekleme scripti

## Bilinen Dikkat Noktalari

- `backend` icinde iki farkli package kokunun kullanildigi gorulur: `com.example.idectt` ve `com.example.IdecTTBackend`. Spring Boot ana uygulama sinifi `com.example.IdecTTBackend` paketindedir ve entity/repository scan ayarlari kontrol edilmelidir.
- Bazi kaynak dosyalarda karakter kodlama bozulmalari gorunuyor. Kullaniciya gorunen metinler ve seed data UTF-8 olarak duzeltilmelidir.
- `tsconfig.node.json` dosyasi bos. Vite/TypeScript konfigurasyonu icin doldurulmasi veya gerekiyorsa kaldirilmasi degerlendirilmelidir.
- `@supabase/supabase-js` bagimliligi package icinde var, fakat mevcut taramada aktif kullanim gorunmedi.
- `ForgotPasswordPage` frontend'de mevcut, ancak backend tarafinda parola sifirlama endpoint'i gorunmuyor.
- Upload endpoint'i controller seviyesinde ayrica role annotation tasimiyor; genel security zincirinde public olarak isaretlenmedigi icin authenticated kabul edilir.
