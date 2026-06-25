# Backend AWS Deploy

Bu not, frontend cPanel'de `https://yukarbon.yeditepe.edu.tr` uzerinden yayinlanirken backend'i ayri bir AWS sunucusunda calistirmak icindir.

## Gerekli Dosyalar

AWS sunucusuna su dosya ve klasorler yeterlidir:

```text
backend/IdecTTBackend/
docker-compose.backend.yml
.env
```

`.env` dosyasini repoya commit etmeyin. Sunucuda `.env.aws.example` dosyasindan kopyalayip gercek sifrelerle doldurun.

## Sunucuda Kurulum

```bash
cp .env.aws.example .env
nano .env
docker compose -f docker-compose.backend.yml --env-file .env up --build -d
```

Kontrol:

```bash
docker compose -f docker-compose.backend.yml --env-file .env ps
docker compose -f docker-compose.backend.yml --env-file .env logs backend --tail=100
```

Backend varsayilan olarak sunucuda `8080` portundan calisir. Production'da bunu dogrudan IP ile kullanmak yerine Nginx veya AWS Load Balancer arkasinda HTTPS ile yayinlayin.

## Domain ve SSL

Onerilen adres:

```text
https://api.yukarbon.yeditepe.edu.tr
```

Backend HTTPS olmali. Frontend HTTPS iken backend HTTP kalirsa tarayici API isteklerini mixed content nedeniyle engeller.

## Kritik Env Degerleri

```env
CORS_ALLOWED_ORIGINS=https://yukarbon.yeditepe.edu.tr
FRONTEND_BASE_URL=https://yukarbon.yeditepe.edu.tr
BACKEND_BASE_URL=https://api.yukarbon.yeditepe.edu.tr
```

Frontend build alirken de ayni backend origin'i kullanin:

```env
VITE_API_BASE_URL=https://api.yukarbon.yeditepe.edu.tr
```

## Upload Dosyalari

Yuklenen dosyalar Docker volume icindeki `/app/uploads` dizininde saklanir. Bu volume yedeklenmelidir:

```text
backend_uploads
```

PostgreSQL verisi de ayri volume'dadir:

```text
postgres_data
```

## Firewall

AWS Security Group icin minimum:

- `22/tcp`: sadece kendi IP adresinizden SSH
- `80/tcp`: HTTP, SSL sertifikasi veya redirect icin
- `443/tcp`: HTTPS API

`5432/tcp` PostgreSQL portunu internete acmayin. `8080/tcp` portunu da mumkunse sadece reverse proxy veya load balancer erisecek sekilde kapali tutun.

## 2026-06-07 AWS Kurulum Durumu

Bu sunucuda backend kurulumu tamamlandi ve test edildi.

Calisan servisler:

```text
PostgreSQL container: idectt-db
Spring Boot container: idectt-backend
Nginx reverse proxy: host uzerinde systemd servisi
HTTPS sertifikasi: Let's Encrypt / Certbot
```

Aktif API adresi:

```text
https://16-170-37-156.sslip.io
```

Test edilen endpoint:

```text
https://16-170-37-156.sslip.io/api/courses
```

Bu endpoint `200 OK` dondu ve kurs JSON verisi geldi.

## Yapilan Degisiklikler

### Docker Backend Compose

`docker-compose.backend.yml` eklendi. Bu compose dosyasi sadece backend ve PostgreSQL calistirir; frontend AWS tarafinda build edilmez.

Guvenlik icin container portlari hostta sadece localhost'a bind edildi:

```text
127.0.0.1:8080 -> Spring Boot backend
127.0.0.1:5432 -> PostgreSQL
```

Dis dunyaya backend dogrudan 8080 uzerinden acik degildir. Dis trafik Nginx uzerinden gelir.

### Nginx Reverse Proxy

Host uzerinde Nginx kuruldu. Nginx 80 ve 443 portlarini dinler, gelen istekleri backend'e proxy eder:

```text
https://16-170-37-156.sslip.io/* -> http://127.0.0.1:8080/*
```

HTTP istekleri HTTPS'e yonlendirilir.

### HTTPS / SSL

Kurum domaini olmadan HTTPS saglamak icin `sslip.io` kullanildi:

```text
16-170-37-156.sslip.io -> 16.170.37.156
```

Let's Encrypt sertifikasi Certbot ile alindi. Sertifika otomatik yenileme timer'i kuruldu. Yenilemenin calismasi icin AWS Security Group'ta `80/tcp` acik kalmalidir.

### Backend Env

Sunucudaki `.env` dosyasinda backend base URL su sekilde ayarlandi:

```env
BACKEND_BASE_URL=https://16-170-37-156.sslip.io
```

CORS listesine production frontend ve lokal frontend preview originleri eklendi:

```env
CORS_ALLOWED_ORIGINS=https://yukarbon.yeditepe.edu.tr,http://localhost:4173,http://127.0.0.1:4173,http://localhost:5173,http://127.0.0.1:5173
```

Bu ayar sonrasi su preflight test edildi ve basarili oldu:

```text
Origin: http://localhost:4173
Endpoint: https://16-170-37-156.sslip.io/api/courses
Result: Access-Control-Allow-Origin: http://localhost:4173
```

### DataInitializer Fix

`backend/IdecTTBackend/src/main/java/com/example/idectt/config/DataInitializer.java` icinde `run` metodu `@Transactional` yapildi.

Sebep: Bootstrap admin kullanicisi mevcutken `User.roles` lazy collection'i session disinda guncellenmeye calisiyor ve backend restart sonrasi `LazyInitializationException` ile kapanabiliyordu. Transaction eklenince roles collection acik persistence context icinde guncelleniyor.

## Frontend Icin Kullanilacak API Degeri

cPanel'e yuklenecek frontend build icin:

```env
VITE_API_BASE_URL=https://16-170-37-156.sslip.io
```

Lokal preview icin de ayni deger kullanilabilir.

## AWS Security Group

Acik kalmasi gereken inbound portlar:

```text
22/tcp  -> SSH, tercihen sadece kendi IP adresinden
80/tcp  -> HTTP redirect ve Let's Encrypt yenileme
443/tcp -> HTTPS API
```

Kapali olmasi gerekenler:

```text
8080/tcp -> dis dunyaya acilmayacak
5432/tcp -> dis dunyaya acilmayacak
```

## KarbonBot Notu

`karbonbot.knowhy.info` CORS hatalari bu Spring Boot backend'den kaynaklanmaz. KarbonBot script'i tarayicidan kendi servisine dogrudan istek atar. Bu nedenle `karbonbot.knowhy.info` icin CORS whitelist ayari Knowhy/KarbonBot servis tarafinda yapilmalidir. Bu dosyada ve backend kurulumunda KarbonBot servis ayari degistirilmedi.

## 2026-06-07 Google Drive DB Restore

Google Drive yedegi indirildi ve PostgreSQL plain SQL dump oldugu dogrulandi.

Kaynak Drive dosyasi:

```text
https://drive.google.com/file/d/1D7B4z-4SW9zgS4NlWDbTscB8ZcltlpBa/view?usp=drive_link
```

Restore oncesi mevcut veritabani yedegi alindi:

```text
/tmp/idectt-drive-restore/current-before-drive-restore.sql.gz
```

Restore islemi:

```text
public schema drop edildi
public schema yeniden olusturuldu
Drive SQL dump idecttDb veritabanina islendi
backend container restart edildi
```

Restore sonrasi temel tablo sayilari:

```text
users: 29
courses: 14
projects: 4
announcements: 1
```

Public API kontrolleri basarili oldu:

```text
GET https://16-170-37-156.sslip.io/api/courses -> 200 OK
GET https://16-170-37-156.sslip.io/api/projects -> 200 OK
GET https://16-170-37-156.sslip.io/api/announcements/active -> 200 OK
```

DB dump icindeki kurs gorselleri `/uploads/...` referansladigi icin repo icindeki upload dosyalari Docker volume'a kopyalandi:

```text
backend/IdecTTBackend/uploads/. -> idectt-backend:/app/uploads/
```

Upload kontrolu basarili oldu:

```text
GET https://16-170-37-156.sslip.io/uploads/e2e1b447-9ad1-4587-9211-cb9004345f5a.png -> 200 OK
```

## 2026-06-07 Frontend Upload URL Fix

Restore edilen DB'de kurs gorselleri ve bazi medya alanlari `/uploads/...` seklinde relative path donuyor. Frontend cPanel domaininde yayinlandigi icin bu pathler varsayilan olarak `https://yukarbon.yeditepe.edu.tr/uploads/...` adresine gider ve 404 verir.

Bunu duzeltmek icin frontend `apiService` icine `resolveAssetUrl` helper'i eklendi. Helper:

```text
https://... veya http://... URL -> aynen birakir
/uploads/... URL -> VITE_API_BASE_URL origin'ine cevirir
```

Ornek:

```text
/uploads/e2e1b447.png -> https://16-170-37-156.sslip.io/uploads/e2e1b447.png
```

Guncellenen ekranlar:

```text
CoursesPage
FavoritesPage
CourseDetailPage video kaynaklari
ProjectDetailPage
AnnouncementsSection
```

Bu degisiklik cPanel'e yansimasi icin frontend yeniden build edilip `dist/` icerigi tekrar `public_html` altina yuklenmelidir.

## 2026-06-08 Drive Course Images + WebP 64

Google Drive'dan ders gorsel arsivi indirildi.

Kaynak Drive dosyasi:

```text
https://drive.google.com/file/d/1Rh4le1Q4BajFUK-tdy-mOUPyX3xxmzSU/view?usp=sharing
```

Drive dosyasi ZIP arsivi olarak indirildi. Arsivde 10 PNG dosyasi vardi. Bu dosyalar `cwebp -q 64` ile WebP formatina cevrildi.

Sonuc:

```text
Drive PNG toplam boyutu: 29.5 MB
WebP q64 toplam boyutu: 0.85 MB
Yaklasik kazanc: %97.1
```

Arsivde bulunmayan ama DB'de kalan 3 PNG ders gorseli mevcut upload dosyalarindan WebP q64'e cevrildi.

DB guncellemesi oncesi yedek alindi:

```text
/tmp/idectt-images-restore/backups/before-webp-image-update.sql.gz
```

WebP dosyalari backend upload volume'a kopyalandi:

```text
/tmp/idectt-images-restore/webp64/. -> idectt-backend:/app/uploads/
/tmp/idectt-images-restore/remaining-webp64/. -> idectt-backend:/app/uploads/
```

`courses.image` alanlari guncellendi. Son durumda kurs gorselleri:

```text
/uploads/*.webp kullanan lokal ders gorseli: 13
/uploads/*.png kullanan lokal ders gorseli: 0
toplam kurs: 14
```

Bir kurs halen harici Pexels URL kullanir. Public kontroller basarili oldu:

```text
GET https://16-170-37-156.sslip.io/api/courses -> 200 OK
GET https://16-170-37-156.sslip.io/uploads/b866e60f-a54e-4330-8b27-31068320866e.webp -> 200 OK, image/webp
```
