# TASK 02 — Kayıt Sayfası KVKK / Gizlilik Politikası Onay Popup'ı

**Bağımlılık:** Task 01 tamamlanmış olmalı  
**Risk Seviyesi:** Düşük — Sadece frontend değişikliği, backend'e dokunma  
**Etkilenen Dosyalar:** `src/pages/RegisterPage.tsx`, `src/locales/tr/translation.json`, `src/locales/en/translation.json`

---

## Amaç

Kullanıcı kayıt olmadan önce:
1. "Kişisel verilerim güvende, aydınlatma metnini okudum ve onaylıyorum" metnini içeren bir **onay checkbox'ı** işaretlemek zorunda olacak.
2. Metindeki link tıklandığında bir **modal popup** açılacak ve tam aydınlatma/gizlilik metni gösterilecek.
3. Checkbox işaretlenmeden form **gönderilemez**.

---

## Adım 1 — Türkçe Çeviri Anahtarlarını Ekle

`src/locales/tr/translation.json` dosyasını aç ve `"register_page"` objesinin içine şu anahtarları ekle (sonuna, `"login_now"` satırından sonra):

```json
"consent_checkbox_text": "Kişisel verilerimin IDEC-TT tarafından işlenmesini ve saklanmasını onaylıyorum. ",
"consent_link_text": "Aydınlatma Metnini okudum ve kabul ediyorum.",
"consent_required_error": "Kayıt olmak için aydınlatma metnini onaylamanız zorunludur.",
"consent_modal_title": "Kişisel Verilerin Korunması ve Gizlilik Aydınlatma Metni",
"consent_modal_close": "Kapat ve Devam Et",
"consent_modal_body": "IDEC-TT Platformu Kişisel Verilerin İşlenmesine İlişkin Aydınlatma Metni\n\n1. VERİ SORUMLUSU\nYeditepe Üniversitesi Teknoloji Üssü bünyesinde yürütülen IDEC-TT projesi kapsamında kişisel verilerinizi işleyen veri sorumlusu Yeditepe Üniversitesi'dir. Adres: Sanayi Mah. Teknopark Bulvarı 7C Blok, Kurtköy - Pendik / İstanbul.\n\n2. İŞLENEN KİŞİSEL VERİLER\nKayıt sürecinde toplanan veriler: ad-soyad, e-posta adresi, telefon numarası, meslek/unvan (bireysel üyelik), şirket adı, vergi numarası ve sektör (kurumsal üyelik). Platform kullanımı sırasında oluşturulan log verileri: izlenen dersler, izlenme süreleri, ilerleme durumu.\n\n3. VERİLERİN SAKLANDIĞI ORTAM VE GÜVENLİK\nKişisel verileriniz ve eğitim ilerleme kayıtlarınız, yalnızca IDEC-TT altyapısına ait sunucularda şifreli olarak saklanmaktadır. Verileriniz üçüncü taraflarla paylaşılmaz ve satılmaz. Platformda kullanılan KarbonBot yapay zeka asistanı, IDEC-TT veri altyapısından fiziksel olarak ayrı, bağımsız bir sunucuda çalışmakta olup sizinle yaptığınız sohbet içerikleri sadece o sunucuda işlenmektedir. Eğitim ilerlemeniz ve kişisel verileriniz KarbonBot sunucusuna aktarılmamaktadır.\n\n4. VERİLERİN İŞLENME AMACI\na) Eğitim hizmetlerinin sunulması ve kişiselleştirilmesi,\nb) İlerleme takibi ve başarı belgesi oluşturulması,\nc) Platform güvenliğinin sağlanması,\nd) Yasal yükümlülüklerin yerine getirilmesi.\n\n5. VERİLERİN SAKLANMA SÜRESİ\nKişisel verileriniz, üyeliğiniz aktif olduğu süre boyunca ve üyelik silinmesinden itibaren 3 yıl süreyle saklanır. Yasal zorunluluk gerektiren veriler ilgili mevzuatta belirtilen süreler kadar tutulur.\n\n6. HAKLARINIZ\n6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında; verilerinize erişme, düzeltme, silme, işlemeyi kısıtlama ve itiraz etme haklarına sahipsiniz. Bu haklarınızı kullanmak için idectt@yeditepe.edu.tr adresine e-posta gönderebilirsiniz.\n\n7. ÇEREZ POLİTİKASI\nPlatform yalnızca oturum yönetimi için zorunlu çerezler kullanmaktadır. Analitik veya reklam amaçlı çerez kullanılmamaktadır.\n\nBu metni onaylayarak yukarıda belirtilen koşullarda kişisel verilerinizin işlenmesine açık rıza vermiş olursunuz."
```

---

## Adım 2 — İngilizce Çeviri Anahtarlarını Ekle

`src/locales/en/translation.json` dosyasını aç ve `"register_page"` objesine şunları ekle:

```json
"consent_checkbox_text": "I consent to the processing and storage of my personal data by IDEC-TT. ",
"consent_link_text": "I have read and accept the Privacy Notice.",
"consent_required_error": "You must accept the privacy notice to register.",
"consent_modal_title": "Personal Data Protection and Privacy Notice",
"consent_modal_close": "Close and Continue",
"consent_modal_body": "IDEC-TT Platform — Personal Data Processing Notice\n\n1. DATA CONTROLLER\nThe data controller processing your personal data within the IDEC-TT project is Yeditepe University. Address: Sanayi Mah. Teknopark Bulvarı 7C Blok, Kurtköy - Pendik / İstanbul, Turkey.\n\n2. PERSONAL DATA COLLECTED\nDuring registration: full name, e-mail address, phone number, profession/title (individual membership), company name, tax ID and sector (corporate membership). Data generated during platform use: courses watched, watch durations, progress status.\n\n3. DATA STORAGE AND SECURITY\nYour personal data and learning progress records are stored in encrypted form exclusively on IDEC-TT infrastructure servers. Data is not shared with or sold to third parties. The KarbonBot AI assistant featured on the platform runs on a physically separate, independent server from the IDEC-TT data infrastructure. Conversation content is processed only on that server and your personal data or learning progress is never transferred to the KarbonBot server.\n\n4. PURPOSE OF PROCESSING\na) Delivery and personalisation of training services,\nb) Progress tracking and certificate generation,\nc) Platform security,\nd) Compliance with legal obligations.\n\n5. RETENTION PERIOD\nYour personal data is retained for the duration of your active membership and for 3 years after account deletion. Data subject to legal requirements is retained for the period specified in applicable legislation.\n\n6. YOUR RIGHTS\nUnder the Turkish Personal Data Protection Law No. 6698, you have the right to access, correct, delete, restrict processing of, and object to the processing of your data. To exercise these rights, contact us at idectt@yeditepe.edu.tr.\n\n7. COOKIE POLICY\nThe platform uses only essential session cookies. No analytics or advertising cookies are used.\n\nBy accepting this notice, you give explicit consent to the processing of your personal data under the terms described above."
```

---

## Adım 3 — RegisterPage.tsx'i Güncelle

`src/pages/RegisterPage.tsx` dosyasını aç. Aşağıdaki değişiklikleri yap:

### 3a. State'leri Ekle

`useState` importları olan bölümün altına, mevcut state'lerin yanına ekle:

```typescript
const [consentChecked, setConsentChecked] = useState(false);
const [showConsentModal, setShowConsentModal] = useState(false);
```

### 3b. Validasyon Ekle

`handleRegister` fonksiyonunda, `if (password !== confirmPassword)` bloğundan **önce** şunu ekle:

```typescript
if (!consentChecked) {
  setError(t('register_page.consent_required_error'));
  return;
}
```

### 3c. Checkbox'ı Ekle

Formun içinde, `<div className="pt-4">` (submit butonu div'i) kısmından **hemen önce** şu bloğu ekle:

```tsx
{/* KVKK Consent */}
<div className="flex items-start space-x-3">
  <input
    id="consent"
    name="consent"
    type="checkbox"
    checked={consentChecked}
    onChange={(e) => setConsentChecked(e.target.checked)}
    className="mt-1 h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer flex-shrink-0"
  />
  <label htmlFor="consent" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
    {t('register_page.consent_checkbox_text')}
    <button
      type="button"
      onClick={() => setShowConsentModal(true)}
      className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2 focus:outline-none"
    >
      {t('register_page.consent_link_text')}
    </button>
  </label>
</div>
```

### 3d. Modal Popup'ı Ekle

`return` ifadesinin içinde, en dışta bulunan `<div>` kapanmadan hemen önce şu modal'ı ekle:

```tsx
{/* KVKK/Privacy Modal */}
{showConsentModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    onClick={() => setShowConsentModal(false)}
  >
    <div
      className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">{t('register_page.consent_modal_title')}</h3>
        <button
          type="button"
          onClick={() => setShowConsentModal(false)}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Kapat"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-6 overflow-y-auto flex-1">
        <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
          {t('register_page.consent_modal_body')}
        </div>
      </div>
      <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => {
            setConsentChecked(true);
            setShowConsentModal(false);
          }}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors text-sm"
        >
          {t('register_page.consent_modal_close')}
        </button>
      </div>
    </div>
  </div>
)}
```

**Dikkat**: Modal içindeki "Kapat ve Devam Et" butonu hem `consentChecked = true` yapar hem de modal'ı kapatır. Bu UX tercihidir: kullanıcı metni okuyup butona bastığında otomatik onaylanmış olur.

---

## Adım 4 — Doğrulama

1. Frontend'i local'de çalıştır: `cd /home/ubuntu/idecWebsite && npm run dev`
2. `http://localhost:5173/register` adresine git
3. Checkbox işaretlemeden kayıt olmaya çalış → Hata mesajı çıkmalı
4. "Aydınlatma Metnini okudum" linkine tıkla → Modal açılmalı
5. Modal içindeki "Kapat ve Devam Et" butonuna bas → Checkbox işaretlenmeli, modal kapanmalı
6. Dil TR/EN olarak değiştir → Metinler değişmeli

---

## Tamamlandı mı? Log Yaz

`PROGRESS_LOG.md` dosyasına şu formatta ekle:

```markdown
## TASK_02 — KVKK / Gizlilik Politikası Onay Popup'ı
**Tamamlanma Tarihi:** [tarih]
**Durum:** Tamamlandı

### Yapılanlar
- RegisterPage.tsx'e consentChecked state ve showConsentModal state eklendi
- handleRegister'a consent validasyonu eklendi
- Checkbox + modal açma linki eklendi
- KVKK modalı eklendi (scroll'lanabilir, tam metin)
- TR ve EN çeviri anahtarları eklendi

### Değiştirilen/Eklenen Dosyalar
- `src/pages/RegisterPage.tsx`
- `src/locales/tr/translation.json`
- `src/locales/en/translation.json`
```

`TASKS_INDEX.md`'deki Task 02 satırını `✅ Tamamlandı` yap.
