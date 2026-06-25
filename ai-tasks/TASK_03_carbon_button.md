# TASK 03 — Header'a Karbon Ayak İzi Hesaplama Butonu

**Bağımlılık:** Task 01 tamamlanmış olmalı (Task 02 paralel çalışabilir)  
**Risk Seviyesi:** Çok Düşük — Sadece Header.tsx'e bir buton ekleniyor  
**Etkilenen Dosyalar:** `src/components/Header.tsx`, `src/locales/tr/translation.json`, `src/locales/en/translation.json`

---

## Amaç

Header'ın üst navigasyon alanına, kullanıcıları https://greentim.com/ adresine yönlendiren bir "Karbon Ayak İzinizi Hesaplayın" butonu ekle. Bu buton header'da her zaman görünür olmalı, hem giriş yapmış hem yapmamış kullanıcılara gösterilmeli.

---

## Adım 1 — Çeviri Anahtarlarını Ekle

`src/locales/tr/translation.json` dosyasını aç ve `"header"` objesinin içine ekle:

```json
"carbon_calc_button": "Karbon Ayak İzinizi Hesaplayın"
```

`src/locales/en/translation.json` dosyasını aç ve `"header"` objesinin içine ekle:

```json
"carbon_calc_button": "Calculate Your Carbon Footprint"
```

---

## Adım 2 — Header.tsx'i Güncelle

`src/components/Header.tsx` dosyasını aç.

### Nereye Eklenecek

`<nav className="hidden md:flex space-x-8">` bloğunu bul. Bu nav'ın **hemen dışında** (nav'dan önce ya da sonra değil), header'ın `<div className="flex justify-between items-center py-4">` içinde, `<nav>` bloğunun hemen **öncesine** şu butonu ekle:

**YANLIŞ YER**: Nav'ın içine ekleme.  
**DOĞRU YER**: Header'ın üst kısmında, logo ve nav arasında ya da nav'ın hemen sağında, diğer butonlardan ayrı.

Aşağıdaki yapıyı kullan. `<nav className="hidden md:flex space-x-8">` bloğunu bul ve hemen **önüne** şu satırı ekle:

```tsx
{/* Carbon Footprint Calculator Button */}
<a
  href="https://greentim.com/"
  target="_blank"
  rel="noopener noreferrer"
  className="hidden md:flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
>
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{t('header.carbon_calc_button')}</span>
</a>
```

### Mobil Görünüm için

Mobil menü varsa (ya da ileride eklenecekse) mobil nav için `<nav>` içine de şu item'ı ekle. Eğer mevcut kodda mobil menü yoksa sadece `hidden md:flex` ile masaüstüne sınırla, bu yeterli.

---

## Adım 3 — Görsel Kontrol

Butonu ekledikten sonra header'ın şu şekilde görünmesini kontrol et:

```
[IDEC-TT Logo]  [Hakkımızda] [Ortaklarımız] [IDEC Akademi] [İletişim]  [🌍 Karbon Ayak İzinizi Hesaplayın]  [Çalıştaylarımız ▼]  [TR/EN]  [Giriş Yap]
```

Yani karbon butonu nav linklerinin sağında, "Çalıştaylarımız" dropdown'unun solunda yer almalı.

**Eğer yerleştirme çok dağınık görünüyorsa**: `<div className="flex items-center space-x-4">` olan sağ taraf kontrol bölümüne (giriş butonu, dil switcher vs. bulunan alan) ilk eleman olarak ekle.

---

## Adım 4 — Doğrulama

1. `npm run dev` ile frontend'i başlat
2. Header'da yeşil karbon butonu görünmeli
3. Butona tıklayınca yeni sekmede `https://greentim.com/` açılmalı
4. Hem giriş yapmış hem yapmamış kullanıcılarda görünmeli

---

## Tamamlandı mı? Log Yaz

`PROGRESS_LOG.md` dosyasına şu formatta ekle:

```markdown
## TASK_03 — Karbon Ayak İzi Hesaplama Butonu
**Tamamlanma Tarihi:** [tarih]
**Durum:** Tamamlandı

### Yapılanlar
- Header.tsx'e greentim.com'a yönlendiren yeşil karbon butonu eklendi
- TR ve EN çeviri anahtarları eklendi

### Değiştirilen/Eklenen Dosyalar
- `src/components/Header.tsx`
- `src/locales/tr/translation.json`
- `src/locales/en/translation.json`
```

`TASKS_INDEX.md`'deki Task 03 satırını `✅ Tamamlandı` yap.
