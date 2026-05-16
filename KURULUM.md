# KURULUM

Bu dokuman, uygulamayi baska bir Ubuntu sunucuda mevcut yapıya en yakin sekilde, tamamen Docker uzerinde calistirmak icindir.

Eger sadece kodu degil, canli verileri ve upload dosyalarini da tasiyarak birebir klon kurmak istiyorsaniz [MIGRASYON_VE_KLON.md](./MIGRASYON_VE_KLON.md) dosyasini da birlikte uygulayin.

## Hedef Mimari

Kurulum sonunda su 3 container ayni `docker compose` stack icinde calisir:

- `db`: PostgreSQL
- `backend`: Spring Boot API
- `frontend`: Nginx uzerinden yayinlanan Vite build'i

Trafik akisi:

- Kullanici `frontend` container'ina gelir
- `frontend`, `/api/*` ve `/uploads/*` isteklerini `backend` container'ina proxy eder
- `backend`, PostgreSQL icin `db` container'ina baglanir

## 1. Sunucu Hazirligi

Ubuntu sunucuda su paketler kurulu olmali:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin git
```

Docker'i etkinlestir:

```bash
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

Not:
- `usermod` sonrasi yeni shell acmak gerekir.
- Domain kullanacaksaniz DNS kaydini sunucu IP'sine yonlendirin.

## 2. Projeyi Sunucuya Alma

```bash
cd /opt
sudo git clone https://github.com/Ahmetatakanokutan/idecWebsite.git
sudo chown -R $USER:$USER idecWebsite
cd /opt/idecWebsite
```

## 3. Ortam Dosyasini Hazirlama

Ornek dosyayi kopyalayin:

```bash
cp .env.docker.example .env.docker
```

Sonra `.env.docker` dosyasini doldurun:

```bash
nano .env.docker
```

Minimum ayarlanmasi gereken alanlar:

- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`
- `FRONTEND_BASE_URL`
- `BACKEND_BASE_URL`

### Ornek HTTP kurulum

Tek domain veya IP ile basic kurulum icin:

```env
POSTGRES_DB=idecttDb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=STRONG_DB_PASSWORD
POSTGRES_PORT=5432

FRONTEND_PORT=80
BACKEND_PORT=8080
JWT_SECRET=LONG_RANDOM_SECRET_AT_LEAST_32_CHARS

CORS_ALLOWED_ORIGINS=http://SUNUCU_IPSI,http://DOMAIN_ADINIZ
FRONTEND_BASE_URL=http://DOMAIN_ADINIZ
BACKEND_BASE_URL=http://DOMAIN_ADINIZ

DDL_AUTO=update

MAIL_ENABLED=false

BOOTSTRAP_ADMIN_ENABLED=false
BOOTSTRAP_ADMIN_EMAIL=
BOOTSTRAP_ADMIN_PASSWORD=
BOOTSTRAP_ADMIN_FULLNAME=IDEC-TT Admin
BOOTSTRAP_ADMIN_PHONE=
```

### Ornek HTTPS/domain kurulum

SSL'i host uzerindeki Nginx veya Cloudflare Tunnel gibi baska bir katmanla sonlandiracaksaniz:

```env
CORS_ALLOWED_ORIGINS=https://example.com,https://www.example.com
FRONTEND_BASE_URL=https://example.com
BACKEND_BASE_URL=https://example.com
FRONTEND_PORT=80
```

Bu yapida kullanici sadece frontend domainini gorur. API ayri porttan acilmak zorunda degildir.

## 4. Sistemi Ayaga Kaldirma

```bash
docker compose --env-file .env.docker up -d --build
```

Kontrol:

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
```

## 5. Erisim ve Dogrulama

Kurulumdan sonra:

- site: `http://SUNUCU_IPSI` veya `http://DOMAIN`
- API: `http://SUNUCU_IPSI/api/...`

Hizli test:

```bash
curl http://127.0.0.1/api/announcements/active
curl http://127.0.0.1
```

Not:
- `frontend` container port `80` dinler
- `backend` container disariya ayrica `BACKEND_PORT` ile acilir
- Isterseniz guvenlik icin backend port mapping'i sonradan kaldirabilirsiniz

## 6. Kalici Veriler

Compose iki volume kullanir:

- `postgres_data`: veritabani verileri
- `backend_uploads`: backend'e yuklenen dosyalar

Silmediginiz surece `docker compose down` verileri korur.

Tum veriyi de silmek isterseniz:

```bash
docker compose down -v
```

## 7. Guncelleme

Kod guncellemesi sonrasi:

```bash
git pull
docker compose --env-file .env.docker up -d --build
```

## 8. SSL Notu

Bu repo artik frontend'i de Docker icinde servis edecek sekilde hazirlandi. Ancak SSL sertifikasi bu compose dosyasinda yonetilmiyor.

Iki makul secenek:

1. Host makinede Nginx kurup `80/443` u hostta terminate ederek `frontend` container'ina proxy etmek
2. Cloudflare Tunnel veya benzeri bir reverse proxy kullanmak

Eger sifresiz/basic test ortami istiyorsaniz sadece `FRONTEND_PORT=80` ile devam edebilirsiniz.

## 9. Canliya Cok Yakin Kurulum Onerisi

Su anki calisan mantiga en yakin kurulum:

- frontend kullaniciya tek entry point olsun
- frontend `/api` ve `/uploads` isteklerini backend'e proxy etsin
- backend dogrudan PostgreSQL'e baglansin
- dosya yuklemeleri `backend_uploads` volume'unde kalsin

Bu repo artik bu akisi dogrudan destekliyor.
