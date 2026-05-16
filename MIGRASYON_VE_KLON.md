# MIGRASYON VE KLON

Bu dosya, mevcut calisan sistemi baska bir sunucuda olabildigince birebir kurmak icin yazildi.

Hedef:

- ayni kod
- ayni Docker mimarisi
- ayni veritabani verisi
- ayni upload dosyalari
- ayni `.env.docker` ayarlari

Bu islem iki asamadan olusur:

1. Kaynak sunucudan bir **live migration bundle** cikarmak
2. Hedef sunucuda bu bundle'i geri yuklemek

## Git ile ilgili kritik not

Canli veritabani dump'i, upload arsivi ve gercek `.env.docker` dosyasi **git'e commit edilmemelidir**.

Bu repo:

- export scriptini icerir
- restore scriptini icerir
- kurulumu anlatir

Ama canli verinin kendisi `migration_bundle/` altinda uretilir ve `.gitignore` ile disarida tutulur.

Bu, dogru yaklasimdir. Aksi halde:

- secret'lar repoya girer
- veritabani verileri aciga cikabilir
- git repo gereksiz buyur

## Bundle Icerigi

`ops/migration/export-live-bundle.sh` calistiginda su dosyalar uretilir:

- `.env.docker`
- `postgres.sql.gz`
- `backend_uploads.tar.gz`
- `live_frontend.tar.gz`
- `MANIFEST.md`
- `SHA256SUMS`

Aciklama:

- `.env.docker`: canli sistemin environment ayarlari
- `postgres.sql.gz`: PostgreSQL mantiksal dump
- `backend_uploads.tar.gz`: `/app/uploads` volume arsivi
- `live_frontend.tar.gz`: su anda yayinda duran `/var/www/idectt` arsivi

Not:
- `live_frontend.tar.gz` esasen referans icindir
- yeni sunucuda frontend normalde repo kodundan Docker build ile uretilir
- yine de birebir inceleme ve karsilastirma icin pakete eklenir

## Kaynak Sunucuda Export

Repo kokunde calistirin:

```bash
chmod +x ops/migration/export-live-bundle.sh
./ops/migration/export-live-bundle.sh
```

Bundle varsayilan olarak burada olusur:

```bash
migration_bundle/YYYY-MM-DD_HHMMSS
```

Ozel hedef klasor vermek isterseniz:

```bash
./ops/migration/export-live-bundle.sh /root/idectt-transfer/bundle-1
```

Script su kaynaklari toplar:

- `.env.docker`
- Docker icindeki PostgreSQL verisi
- backend upload volume'u
- `/var/www/idectt` altindaki canli frontend

## Bundle'i Hedef Sunucuya Tasima

Olusan klasoru rsync veya scp ile yeni sunucuya kopyalayin:

```bash
scp -r migration_bundle/2026-05-16_000000 user@YENI_SUNUCU:/opt/
```

veya:

```bash
rsync -av migration_bundle/2026-05-16_000000 user@YENI_SUNUCU:/opt/
```

## Hedef Sunucuda Kodun Kurulumu

Kod repodan alinir:

```bash
cd /opt
git clone https://github.com/Ahmetatakanokutan/idecWebsite.git
cd idecWebsite
```

Docker kurulumunun temel adimlari icin [KURULUM.md](./KURULUM.md) dosyasini da okuyun.

## Hedef Sunucuda Restore

Repo kokunde:

```bash
chmod +x ops/migration/restore-live-bundle.sh
USE_BUNDLE_ENV=replace ./ops/migration/restore-live-bundle.sh /opt/2026-05-16_000000
```

Bu komut sirasiyla:

- bundle checksum'larini dogrular
- bundle icindeki `.env.docker` dosyasini hedef repoya kopyalar
- `db` container'ini baslatir
- eski veritabanini siler ve dump'tan geri yukler
- upload volume'unu temizler ve arsivden geri acar
- tum stack'i `docker compose up -d --build` ile yeniden ayaga kaldirir

## Birebirlik Seviyesi

Bu akis asagidakileri aynilar:

- backend kodu
- frontend kodu
- db verisi
- upload dosyalari
- env ayarlari

Ama yine de su unsurlar ayrica kontrol edilmelidir:

- DNS
- SSL
- firewall
- SMTP provider erisimi
- dis servis whitelist'leri

Yani uygulama seviyesi birebirlik bu scriptlerle saglanir; ag ve alan adi katmani ise ayrica tasinmalidir.

## Codex Icin Uygulama Sirasi

Bir Codex ajaninin bu repoyu okuyup yeni sunucuda ayni sistemi kurmasi gerekiyorsa su sirayi izlemelidir:

1. `KURULUM.md` okuyup Docker, git ve temel host hazirligini yap
2. repo'yu hedef sunucuya clone et
3. kaynak sunucudan uretilmis bundle klasorunun hedefte mevcut oldugunu dogrula
4. `USE_BUNDLE_ENV=replace ./ops/migration/restore-live-bundle.sh <bundle_dir>` komutunu calistir
5. `docker compose ps` ile `db`, `backend`, `frontend` servislerinin ayakta oldugunu kontrol et
6. `curl http://127.0.0.1` ve `curl http://127.0.0.1/api/announcements/active` ile temel cevaplari test et
7. gerekiyorsa domain, SSL ve DNS ayarlarini bagla

## Guvenlik Notu

Bundle icinde secret'lar vardir:

- DB sifresi
- JWT secret
- mail kullanici bilgileri

Bu nedenle:

- bundle klasoru sifresiz herkese acik dizinde tutulmamalidir
- aktarim bittikten sonra sadece gerekli sunucularda saklanmalidir
- tercihen tasima sonrasi arsiv sifrelenmeli veya silinmelidir

## Onerilen Son Kontrol

Restore tamamlandiktan sonra su kontrolleri yapin:

```bash
docker compose ps
docker compose logs --tail=100 backend
docker compose logs --tail=100 frontend
curl http://127.0.0.1
curl http://127.0.0.1/api/announcements/active
```

Eger login, kurslar, duyurular ve yuklu dosyalar hedefte gorunuyorsa klon basarili olmustur.
