# IDEC-TT AI Görev Kuyruğu

Bu klasör, IDEC-TT projesine eklenecek tüm özelliklerin adım adım görev tanımlarını içerir.
Her görevi sırayla, bir öncekini tamamladıktan sonra çalıştır.
Her görev bittikten sonra `PROGRESS_LOG.md` dosyasına ne yaptığını yaz.

## Sistem Bağlamı (Önce Oku)

- **Stack**: React 18 + TypeScript + Vite + Tailwind CSS (frontend) | Spring Boot 3.5.7 + Java 17 + PostgreSQL + JWT (backend)
- **Deployment**: AWS'de Docker Compose ile çalışıyor, sistem şu anda CANLI
- **Frontend root**: `/home/ubuntu/idecWebsite/src/`
- **Backend root**: `/home/ubuntu/idecWebsite/backend/IdecTTBackend/src/main/java/com/example/idectt/`
- **Bozuk paket**: `com.example.IdecTTBackend` altında (Announcement sınıfları) — Task 01'de düzeltilecek
- **DDL_AUTO=update**: Yeni entity'ler Hibernate tarafından otomatik tablo olarak oluşturulur, veri kaybı yok
- **Mail**: `EmailVerificationService` üzerinden çalışıyor, aynı pattern'i kullan
- **i18n**: TR (`src/locales/tr/translation.json`) ve EN (`src/locales/en/translation.json`) dosyalarına anahtar eklemeyi unutma
- **API prefix**: Tüm backend endpoint'leri `/api/` ile başlıyor
- **Auth**: JWT, `localStorage` key'i `token`, Bearer token header ile gönderiliyor
- **Kritik**: Çalışan sistemi bozma. Mevcut endpoint'leri, veritabanı tablolarını ve deploy akışını değiştirme. Sadece ekle.

## Görev Listesi

| # | Dosya | Konu | Durum |
|---|-------|------|-------|
| 01 | [TASK_01_code_cleanup.md](TASK_01_code_cleanup.md) | Paket tutarsızlığı düzeltme & kod temizliği | ✅ Tamamlandı |
| 02 | [TASK_02_kvkk_consent.md](TASK_02_kvkk_consent.md) | Kayıt sayfasına KVKK/Gizlilik onay popup'ı | ✅ Tamamlandı |
| 03 | [TASK_03_carbon_button.md](TASK_03_carbon_button.md) | Header'a Karbon Ayak İzi hesaplama butonu | ✅ Tamamlandı |
| 04 | [TASK_04_forgot_password.md](TASK_04_forgot_password.md) | Şifremi Unuttum tam akışı (backend + frontend) | ✅ Tamamlandı |
| 05 | [TASK_05_lesson_progress.md](TASK_05_lesson_progress.md) | Kişi bazlı ders ilerleme takibi | ✅ Tamamlandı |
| 06 | [TASK_06_certificate.md](TASK_06_certificate.md) | %80 tamamlama sertifikası üretimi | ✅ Tamamlandı |

## Sıralama Kuralı

- Task 01 → 02 → 03 → 04 → 05 → 06 sırasıyla çalıştır
- Task 05 tamamlanmadan Task 06'ya geçme (sertifika progress verisine bağımlı)
- Her task'tan sonra `PROGRESS_LOG.md`'e log yaz
- `TASKS_INDEX.md`'deki Durum sütununu güncelle: ⏳ Bekliyor → 🔄 Devam Ediyor → ✅ Tamamlandı
