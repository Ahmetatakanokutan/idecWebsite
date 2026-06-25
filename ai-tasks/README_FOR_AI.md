# AI Ajanı İçin Başlangıç Kılavuzu

Merhaba! Sen bir AI ajanısın ve bu proje üzerinde çalışacaksın.
Bu klasördeki görev dosyalarını sırayla oku ve uygula.

## Hemen Yap

1. `TASKS_INDEX.md` dosyasını oku — tüm görevleri ve sırasını anlarsın
2. İlk bekleyen görevi (`⏳ Bekliyor`) bul
3. O görevin `.md` dosyasını aç, adım adım uygula
4. Bitince `PROGRESS_LOG.md`'ye ne yaptığını yaz
5. `TASKS_INDEX.md`'deki durumu `✅ Tamamlandı` yap
6. Bir sonraki göreve geç

## Kritik Kurallar

- **Sistemi bozma**: Bu proje AWS'de CANLI olarak çalışıyor
- **Mevcut endpoint'lere dokunma**: Sadece yeni şeyler ekle
- **Sırayı koru**: Task 05 olmadan Task 06'ya geçme
- **Her değişiklikten sonra backend'i derle**: `./mvnw clean compile -q`
- **Docker restart**: Backend değişince `docker compose restart backend`
- **Log yaz**: Her görev sonrası `PROGRESS_LOG.md` güncelle

## Proje Dizin Yapısı

```
/home/ubuntu/idecWebsite/
├── ai-tasks/                    ← SEN BURADASIN
│   ├── README_FOR_AI.md         ← Bu dosya
│   ├── TASKS_INDEX.md           ← Görev listesi ve durumları
│   ├── PROGRESS_LOG.md          ← Ne yapıldığının günlüğü
│   ├── TASK_01_code_cleanup.md
│   ├── TASK_02_kvkk_consent.md
│   ├── TASK_03_carbon_button.md
│   ├── TASK_04_forgot_password.md
│   ├── TASK_05_lesson_progress.md
│   └── TASK_06_certificate.md
├── src/                         ← React frontend
├── backend/IdecTTBackend/       ← Spring Boot backend
├── docker-compose.yml           ← Servis tanımları
└── .env                         ← Environment değişkenleri (dokunma)
```

## Başlamaya Hazır mısın?

`TASKS_INDEX.md`'yi aç ve ilk göreve başla!
