# TASK 06 — %80 Tamamlama Başarı ve Bitirme Sertifikası

**Bağımlılık:** Task 05 MUTLAKA tamamlanmış olmalı (progress verisi olmadan sertifika üretilemez)  
**Risk Seviyesi:** Orta — Yeni bağımlılık (PDF kütüphanesi) ekleniyor, mevcut sisteme dokunulmuyor  
**Kritik Kural:** Tüm sertifikalar aynı şablondan üretilir, sadece kişi adı, tarih ve sertifika numarası değişir

---

## Amaç

Bir kullanıcı platformdaki tüm derslerin **%80'ini veya daha fazlasını** tamamladığında:
1. Sertifika almaya hak kazandığına dair bildirim gösterilecek
2. Kullanıcı "Sertifikamı Al" butonuna bastığında backend PDF üretecek
3. PDF tarayıcıda indirilecek
4. Her sertifikada şunlar olacak: kullanıcı adı, sertifika no, tarih, program adı
5. Sertifika metni Türkçe olacak, profesyonel görünümlü olacak

---

## BACKEND DEĞİŞİKLİKLERİ

### Adım B1 — PDF Kütüphanesini pom.xml'e Ekle

`backend/IdecTTBackend/pom.xml` dosyasını aç.

`<dependencies>` bloğuna şu bağımlılığı ekle (OpenPDF — LGPL lisanslı, ücretsiz):

```xml
<!-- PDF Generation -->
<dependency>
    <groupId>com.github.librepdf</groupId>
    <artifactId>openpdf</artifactId>
    <version>1.3.35</version>
</dependency>
```

---

### Adım B2 — Certificate Entity Oluştur

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/entity/Certificate.java`

```java
package com.example.idectt.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "certificates")
@Getter
@Setter
@NoArgsConstructor
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "certificate_number", unique = true, nullable = false)
    private String certificateNumber;

    @Column(name = "issued_at", nullable = false)
    private LocalDate issuedAt;

    @Column(name = "completion_percentage")
    private double completionPercentage;

    public Certificate(User user, String certificateNumber, LocalDate issuedAt, double completionPercentage) {
        this.user = user;
        this.certificateNumber = certificateNumber;
        this.issuedAt = issuedAt;
        this.completionPercentage = completionPercentage;
    }
}
```

---

### Adım B3 — CertificateRepository Oluştur

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/repository/CertificateRepository.java`

```java
package com.example.idectt.repository;

import com.example.idectt.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
```

---

### Adım B4 — CertificateService Oluştur

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/service/CertificateService.java`

```java
package com.example.idectt.service;

import com.example.idectt.entity.Certificate;
import com.example.idectt.entity.User;
import com.example.idectt.payload.dto.UserProgressSummaryDto;
import com.example.idectt.repository.CertificateRepository;
import com.example.idectt.repository.LessonRepository;
import com.example.idectt.repository.UserRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.UUID;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressService progressService;

    public CertificateService(CertificateRepository certificateRepository,
                               UserRepository userRepository,
                               LessonRepository lessonRepository,
                               LessonProgressService progressService) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.progressService = progressService;
    }

    @Transactional
    public byte[] generateCertificate(Long userId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long totalLessons = lessonRepository.count();
        UserProgressSummaryDto summary = progressService.getUserProgressSummary(userId, totalLessons);

        if (!summary.isCertificateEligible()) {
            throw new IllegalStateException("User has not completed 80% of the courses yet.");
        }

        // Mevcut sertifika varsa onu kullan, yoksa yeni oluştur
        Certificate cert = certificateRepository.findByUserId(userId).orElseGet(() -> {
            String certNo = "IDEC-" + LocalDate.now().getYear() + "-" +
                    UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
            Certificate newCert = new Certificate(user, certNo, LocalDate.now(),
                    summary.getCompletionPercentage());
            return certificateRepository.save(newCert);
        });

        return buildPdf(user.getFullName(), cert.getCertificateNumber(),
                cert.getIssuedAt(), cert.getCompletionPercentage());
    }

    public boolean isEligible(Long userId) {
        long totalLessons = lessonRepository.count();
        if (totalLessons == 0) return false;
        UserProgressSummaryDto summary = progressService.getUserProgressSummary(userId, totalLessons);
        return summary.isCertificateEligible();
    }

    private byte[] buildPdf(String fullName, String certNumber, LocalDate issuedAt,
                             double completionPct) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4.rotate(), 40, 40, 40, 40);
        PdfWriter writer = PdfWriter.getInstance(doc, baos);
        doc.open();

        PdfContentByte canvas = writer.getDirectContent();
        float width = doc.getPageSize().getWidth();
        float height = doc.getPageSize().getHeight();

        // Arkaplan: koyu yeşil bordür
        canvas.setColorStroke(new Color(5, 102, 60));
        canvas.setLineWidth(8f);
        canvas.rectangle(20, 20, width - 40, height - 40);
        canvas.stroke();

        canvas.setColorStroke(new Color(5, 102, 60));
        canvas.setLineWidth(2f);
        canvas.rectangle(28, 28, width - 56, height - 56);
        canvas.stroke();

        // Üst dekor çizgisi
        canvas.setColorFill(new Color(5, 102, 60));
        canvas.rectangle(28, height - 80, width - 56, 6);
        canvas.fill();

        // Alt dekor çizgisi
        canvas.rectangle(28, 56, width - 56, 6);
        canvas.fill();

        Font fontBig = new Font(Font.HELVETICA, 38f, Font.BOLD, new Color(5, 102, 60));
        Font fontMid = new Font(Font.HELVETICA, 20f, Font.BOLD, new Color(40, 40, 40));
        Font fontNormal = new Font(Font.HELVETICA, 14f, Font.NORMAL, new Color(60, 60, 60));
        Font fontName = new Font(Font.HELVETICA, 32f, Font.BOLD, new Color(5, 102, 60));
        Font fontSmall = new Font(Font.HELVETICA, 10f, Font.NORMAL, new Color(120, 120, 120));

        // Kurum adı
        Paragraph p1 = new Paragraph("YEDİTEPE ÜNİVERSİTESİ", fontBig);
        p1.setAlignment(Element.ALIGN_CENTER);
        p1.setSpacingBefore(30f);
        doc.add(p1);

        Paragraph p2 = new Paragraph("IDEC-TT — İkiz Dönüşüm Yoluyla Endüstriyel Dekarbonizasyon", fontNormal);
        p2.setAlignment(Element.ALIGN_CENTER);
        p2.setSpacingAfter(20f);
        doc.add(p2);

        // Sertifika başlığı
        Paragraph p3 = new Paragraph("BAŞARI VE TAMAMLAMA BELGESİ", fontMid);
        p3.setAlignment(Element.ALIGN_CENTER);
        p3.setSpacingBefore(10f);
        p3.setSpacingAfter(8f);
        doc.add(p3);

        // Ayraç
        LineSeparator line = new LineSeparator(1f, 60f, new Color(5, 102, 60), Element.ALIGN_CENTER, -5f);
        doc.add(line);

        // "Bu belge"
        Paragraph p4 = new Paragraph("Bu belge,", fontNormal);
        p4.setAlignment(Element.ALIGN_CENTER);
        p4.setSpacingBefore(24f);
        doc.add(p4);

        // Ad Soyad
        Paragraph pName = new Paragraph(fullName, fontName);
        pName.setAlignment(Element.ALIGN_CENTER);
        pName.setSpacingAfter(8f);
        doc.add(pName);

        // Açıklama
        String dateStr = issuedAt.format(DateTimeFormatter.ofPattern("dd MMMM yyyy", new Locale("tr", "TR")));
        Paragraph p5 = new Paragraph(
                "adlı katılımcının IDEC-TT Endüstriyel Dekarbonizasyon Eğitim Platformu bünyesindeki\n" +
                "eğitim programlarını %" + String.format("%.0f", completionPct) +
                " oranında başarıyla tamamladığını onaylar.",
                fontNormal);
        p5.setAlignment(Element.ALIGN_CENTER);
        p5.setSpacingAfter(30f);
        doc.add(p5);

        // Tarih ve sertifika no
        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(70f);
        infoTable.setHorizontalAlignment(Element.ALIGN_CENTER);

        PdfPCell dateCell = new PdfPCell(new Phrase("Veriliş Tarihi: " + dateStr, fontNormal));
        dateCell.setBorder(PdfPCell.NO_BORDER);
        dateCell.setHorizontalAlignment(Element.ALIGN_LEFT);

        PdfPCell certCell = new PdfPCell(new Phrase("Belge No: " + certNumber, fontNormal));
        certCell.setBorder(PdfPCell.NO_BORDER);
        certCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        infoTable.addCell(dateCell);
        infoTable.addCell(certCell);
        doc.add(infoTable);

        // Alt not
        Paragraph pNote = new Paragraph(
                "Bu belge IDEC-TT platformu tarafından otomatik olarak oluşturulmuştur. " +
                "Doğrulama için idectt@yeditepe.edu.tr adresine başvurunuz.",
                fontSmall);
        pNote.setAlignment(Element.ALIGN_CENTER);
        pNote.setSpacingBefore(20f);
        doc.add(pNote);

        doc.close();
        return baos.toByteArray();
    }
}
```

---

### Adım B5 — CertificateController Oluştur

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/controller/CertificateController.java`

```java
package com.example.idectt.controller;

import com.example.idectt.payload.response.MessageResponse;
import com.example.idectt.security.services.UserDetailsImpl;
import com.example.idectt.service.CertificateService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/certificate")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    // Kullanıcının sertifika almaya hak kazanıp kazanmadığını kontrol et
    @GetMapping("/eligibility")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> checkEligibility(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        boolean eligible = certificateService.isEligible(userDetails.getId());
        return ResponseEntity.ok(Map.of("eligible", eligible));
    }

    // PDF sertifikayı indir
    @GetMapping("/download")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> downloadCertificate(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            byte[] pdf = certificateService.generateCertificate(userDetails.getId());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"IDECTT_Sertifika.pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(("Henüz sertifika hakkı kazanılmadı. " + e.getMessage()).getBytes());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Sertifika oluşturulurken hata: ".concat(e.getMessage()).getBytes());
        }
    }
}
```

---

### Adım B6 — Backend Derle ve Yeniden Başlat

```bash
cd /home/ubuntu/idecWebsite/backend/IdecTTBackend
./mvnw clean compile -q
```

OpenPDF bağımlılığı Maven tarafından indirilecek, bu işlem biraz zaman alabilir.

Derleme başarılı ise:

```bash
cd /home/ubuntu/idecWebsite
docker compose restart backend
```

Log'larda `certificates` tablosunun oluşturulduğunu gösteren DDL mesajı çıkmalı.

---

## FRONTEND DEĞİŞİKLİKLERİ

### Adım F1 — CertificatePage.tsx Oluştur

Yeni dosya oluştur: `src/pages/CertificatePage.tsx`

```tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Download, Loader2, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const CertificatePage = () => {
  const { isLoggedIn } = useAuth();
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    apiService.get('/certificate/eligibility')
      .then((data: any) => setEligible(data?.eligible === true))
      .catch(() => setEligible(false))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      // Token'ı header'a ekleyerek binary PDF indir
      const token = localStorage.getItem('token');
      const envBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
      const baseUrl = envBaseUrl || window.location.origin;
      const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/certificate/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Sertifika indirilemedi.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'IDECTT_Sertifika.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError('Sertifika indirilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setDownloading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center p-8">
          <p className="text-gray-600 mb-4">Sertifikanızı görüntülemek için giriş yapmalısınız.</p>
          <Link to="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {eligible ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-emerald-100">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-emerald-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tebrikler!
            </h2>
            <p className="text-gray-600 mb-2">
              IDEC-TT platformundaki eğitimlerin en az %80'ini başarıyla tamamladınız.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Başarı ve bitirme belgenizi aşağıdaki butona tıklayarak PDF olarak indirebilirsiniz.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {downloading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              <span>{downloading ? 'Oluşturuluyor...' : 'Sertifikamı İndir (PDF)'}</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sertifika Henüz Hazır Değil
            </h2>
            <p className="text-gray-600 mb-4">
              Başarı belgesi alabilmek için platformdaki tüm eğitimlerin en az <strong>%80'ini</strong> tamamlamanız gerekiyor.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Eğitimlerinizi tamamladıktan sonra bu sayfaya gelin.
            </p>
            <Link
              to="/courses"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Eğitimlere Devam Et
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatePage;
```

---

### Adım F2 — Route Ekle

Route dosyasını bul (`src/App.tsx` veya `src/routes.tsx`):
```bash
grep -r "ForgotPasswordPage\|RouteObject\|createBrowserRouter" /home/ubuntu/idecWebsite/src/ -l
```

Bulunan dosyaya:
1. `import CertificatePage from './pages/CertificatePage';` ekle
2. Route listesine: `<Route path="/certificate" element={<CertificatePage />} />` ekle

---

### Adım F3 — ProfilePage ve Header'a Sertifika Linki Ekle

**ProfilePage.tsx'te**: Task 05'te eklenen ilerleme kartında `certificateEligible` true ise şu butonu göster:

```tsx
{progressSummary?.certificateEligible && (
  <div className="mt-4 flex justify-center">
    <Link
      to="/certificate"
      className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
      <span>Sertifikamı Al</span>
    </Link>
  </div>
)}
```

**Header.tsx'te** (opsiyonel): Kullanıcı dropdown menüsünde "Favorilerim" ve "Profil Ayarları" arasına şu item'ı ekle (sadece `isLoggedIn` olduğunda görünsün):

```tsx
<Menu.Item>
  {({ active }) => (
    <Link
      to="/certificate"
      className={`${
        active ? 'bg-emerald-500 text-white' : 'text-gray-700'
      } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors`}
    >
      <Award className="w-4 h-4 mr-2" aria-hidden="true" />
      Sertifikam
    </Link>
  )}
</Menu.Item>
```

`Award` import'u Header.tsx'in tepesine ekle: `import { ..., Award } from 'lucide-react';`

---

## Doğrulama

1. Backend'i derle ve başlat
2. Log'larda `certificates` tablosu için DDL mesajını gör
3. Bir kullanıcı %80 ders tamamladığında `/certificate` sayfasına git → "Tebrikler" ekranı görünmeli
4. "Sertifikamı İndir" butonuna bas → PDF indirilmeli
5. PDF içinde kullanıcı adı, tarih ve sertifika numarası doğru görünmeli
6. Aynı kullanıcı tekrar indirirse aynı sertifika numarasıyla PDF üretilmeli (idempotent)
7. Farklı kullanıcılar için sadece isim ve numara değişmeli, şablon aynı kalmalı

---

## Tamamlandı mı? Log Yaz

`PROGRESS_LOG.md` dosyasına şu formatta ekle:

```markdown
## TASK_06 — %80 Tamamlama Başarı ve Bitirme Sertifikası
**Tamamlanma Tarihi:** [tarih]
**Durum:** Tamamlandı

### Yapılanlar
- OpenPDF bağımlılığı pom.xml'e eklendi
- Certificate entity oluşturuldu (certificates tablosu)
- CertificateRepository oluşturuldu
- CertificateService oluşturuldu (PDF üretimi + eligibility kontrolü)
- CertificateController oluşturuldu (/eligibility ve /download endpoint'leri)
- CertificatePage.tsx oluşturuldu
- /certificate route'u eklendi
- ProfilePage ve Header'a sertifika linkleri eklendi

### Değiştirilen/Eklenen Dosyalar
- `pom.xml`
- `entity/Certificate.java` (yeni)
- `repository/CertificateRepository.java` (yeni)
- `service/CertificateService.java` (yeni)
- `controller/CertificateController.java` (yeni)
- `src/pages/CertificatePage.tsx` (yeni)
- `src/pages/ProfilePage.tsx`
- `src/components/Header.tsx`
- Route dosyası

### Test Notları
- PDF şablonu A4 yatay, yeşil çerçeve, Helvetica font
- Sertifika numarası: IDEC-YYYY-XXXXXXXX formatı
- İlk sertifika oluşturulduktan sonra DB'ye kaydedilir, tekrar isteklerde aynı kayıt döner
```

`TASKS_INDEX.md`'deki Task 06 satırını `✅ Tamamlandı` yap.

---

## TÜM GÖREVLER TAMAMLANDI

Tüm 6 görev bittikten sonra şu kontrolleri yap:

1. `docker compose restart` ile tüm servisleri yeniden başlat
2. Kayıt sayfasında KVKK popup'ı çalışıyor mu?
3. Şifremi Unuttum sayfası gerçek API çağrısı yapıyor mu?
4. Header'da Karbon Ayak İzi butonu görünüyor mu ve doğru yere yönlendiriyor mu?
5. Bir kursa gir, ders seç → Progress kaydediliyor mu?
6. Profil sayfasında ilerleme çubuğu görünüyor mu?
7. %80 tamamlanmışsa sertifika sayfasına git → PDF indirilebiliyor mu?
