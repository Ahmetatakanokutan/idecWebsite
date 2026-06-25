# TASK 04 — Şifremi Unuttum Tam Akışı (Backend + Frontend)

**Bağımlılık:** Task 01 tamamlanmış olmalı  
**Risk Seviyesi:** Orta — Backend'e yeni endpoint ekleniyor, mevcut User entity'ye yeni alanlar ekleniyor  
**Kritik Not:** DDL_AUTO=update kullanıldığından Hibernate yeni sütunları otomatik ekler, veri kaybı olmaz  
**Mail Altyapısı:** Mevcut `EmailVerificationService` pattern'ini takip et, aynı mail konfigürasyonu kullanılacak

---

## Amaç

Şu anda `ForgotPasswordPage.tsx` tamamen işlevsiz — form submit yapıyor ama hiçbir şey yapmıyor (`e.preventDefault()` ile durduruluyor). Tam akış şu olmalı:

1. Kullanıcı `/forgot-password` sayfasına gider, e-postasını girer
2. Backend e-posta adresine şifre sıfırlama linki gönderir
3. Kullanıcı e-postadaki linke tıklar → `/reset-password?token=xxxxx` sayfasına yönlendirilir
4. Kullanıcı yeni şifresini girer, onaylar, backend şifreyi günceller
5. Başarı mesajı gösterilir, `/login`'e yönlendirilir

---

## BACKEND DEĞİŞİKLİKLERİ

### Adım B1 — User Entity'ye Reset Token Alanları Ekle

`backend/IdecTTBackend/src/main/java/com/example/idectt/entity/User.java` dosyasını aç.

Mevcut alanların sonuna, `getEmail()` metodundan önce şu alanları ekle:

```java
@Column(name = "password_reset_token")
private String passwordResetToken;

@Column(name = "password_reset_token_expiry")
private java.time.LocalDateTime passwordResetTokenExpiry;
```

Bu alanlar Hibernate tarafından otomatik olarak `users` tablosuna sütun olarak eklenecektir.

---

### Adım B2 — PasswordResetService Oluştur

Yeni dosya oluştur:
`backend/IdecTTBackend/src/main/java/com/example/idectt/service/PasswordResetService.java`

```java
package com.example.idectt.service;

import com.example.idectt.entity.User;
import com.example.idectt.repository.UserRepository;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final PasswordEncoder passwordEncoder;
    private final boolean mailEnabled;
    private final String fromAddress;
    private final String frontendBaseUrl;

    public PasswordResetService(
            UserRepository userRepository,
            ObjectProvider<JavaMailSender> mailSenderProvider,
            PasswordEncoder passwordEncoder,
            @Value("${idectt.mail.enabled:false}") boolean mailEnabled,
            @Value("${idectt.mail.from:}") String fromAddress,
            @Value("${idectt.app.frontendBaseUrl:http://localhost:5173}") String frontendBaseUrl) {
        this.userRepository = userRepository;
        this.mailSenderProvider = mailSenderProvider;
        this.passwordEncoder = passwordEncoder;
        this.mailEnabled = mailEnabled;
        this.fromAddress = fromAddress;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @Transactional
    public void initiatePasswordReset(String email) {
        // Her durumda aynı mesajı döndür (email enumeration saldırısını önler)
        User user = userRepository.findByUsername(email).orElse(null);
        if (user == null || !Boolean.TRUE.equals(user.getIsEmailVerified())) {
            return; // Sessizce çık, hata fırlatma
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (!mailEnabled || mailSender == null || isBlank(fromAddress)) {
            return;
        }

        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        String resetUrl = buildResetUrl(token);

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(fromAddress);
        mail.setTo(email);
        mail.setSubject("IDEC-TT — Şifre Sıfırlama / Password Reset");
        mail.setText(
            "Merhaba,\n\n" +
            "IDEC-TT platformu için şifre sıfırlama talebinde bulundunuz.\n" +
            "Aşağıdaki bağlantıya tıklayarak yeni şifrenizi belirleyebilirsiniz:\n\n" +
            resetUrl + "\n\n" +
            "Bu bağlantı 1 saat geçerlidir.\n" +
            "Eğer bu talebi siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.\n\n" +
            "---\n" +
            "Hello,\n\n" +
            "You requested a password reset for your IDEC-TT account.\n" +
            "Click the link below to set a new password:\n\n" +
            resetUrl + "\n\n" +
            "This link is valid for 1 hour.\n" +
            "If you did not request this, please ignore this email.\n"
        );

        mailSender.send(mail);
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token).orElse(null);
        if (user == null) {
            return false;
        }
        if (user.getPasswordResetTokenExpiry() == null ||
                user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return false;
        }
        if (newPassword == null || newPassword.length() < 8) {
            return false;
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);
        return true;
    }

    private String buildResetUrl(String token) {
        String base = frontendBaseUrl == null ? "" : frontendBaseUrl.trim();
        if (base.endsWith("/")) base = base.substring(0, base.length() - 1);
        return base + "/reset-password?token=" + token;
    }

    private boolean isBlank(String v) {
        return v == null || v.trim().isEmpty();
    }
}
```

---

### Adım B3 — UserRepository'ye Metot Ekle

`backend/IdecTTBackend/src/main/java/com/example/idectt/repository/UserRepository.java` dosyasını aç.

Mevcut metodların sonuna şu satırı ekle:

```java
java.util.Optional<User> findByPasswordResetToken(String passwordResetToken);
```

---

### Adım B4 — AuthController'a Endpoint'ler Ekle

`backend/IdecTTBackend/src/main/java/com/example/idectt/controller/AuthController.java` dosyasını aç.

`@Autowired` alanlarının altına şu field'ı ekle:

```java
@Autowired
com.example.idectt.service.PasswordResetService passwordResetService;
```

Sınıfın sonunda (son `}` kapamadan önce) şu iki endpoint'i ekle:

```java
@PostMapping("/forgot-password")
public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> body) {
    String email = body.get("email");
    if (email == null || email.isBlank()) {
        return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is required."));
    }
    // Her zaman aynı mesaj döner (email enumeration'ı önler)
    passwordResetService.initiatePasswordReset(email.trim());
    return ResponseEntity.ok(new MessageResponse(
        "Eğer bu e-posta adresi sistemimizde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi. / " +
        "If this email is registered in our system, a password reset link has been sent."));
}

@PostMapping("/reset-password")
public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> body) {
    String token = body.get("token");
    String newPassword = body.get("newPassword");
    String confirmPassword = body.get("confirmPassword");

    if (token == null || token.isBlank()) {
        return ResponseEntity.badRequest().body(new MessageResponse("Error: Reset token is required."));
    }
    if (newPassword == null || newPassword.length() < 8) {
        return ResponseEntity.badRequest().body(new MessageResponse("Error: Password must be at least 8 characters."));
    }
    if (!newPassword.equals(confirmPassword)) {
        return ResponseEntity.badRequest().body(new MessageResponse("Error: Passwords do not match."));
    }

    boolean success = passwordResetService.resetPassword(token, newPassword);
    if (!success) {
        return ResponseEntity.badRequest().body(
            new MessageResponse("Error: Invalid or expired reset token. Please request a new password reset."));
    }
    return ResponseEntity.ok(new MessageResponse("Şifreniz başarıyla güncellendi. / Your password has been updated successfully."));
}
```

---

### Adım B5 — SecurityConfig'e Endpoint'leri Açık Ekle

`backend/IdecTTBackend/src/main/java/com/example/idectt/security/SecurityConfig.java` dosyasını aç.

`/api/auth/**` zaten açık olmalı. Eğer değilse, `permitAll()` listesine `/api/auth/forgot-password` ve `/api/auth/reset-password` ekle.

Genellikle şu satır yeterlidir (zaten mevcutsa dokunma):
```java
.requestMatchers("/api/auth/**").permitAll()
```

---

### Adım B6 — Backend'i Derle ve Yeniden Başlat

```bash
cd /home/ubuntu/idecWebsite/backend/IdecTTBackend
./mvnw clean compile -q
```

Başarıyla derlendikten sonra:

```bash
cd /home/ubuntu/idecWebsite
docker compose restart backend
```

Log'ları kontrol et:
```bash
docker compose logs backend --tail=40
```

---

## FRONTEND DEĞİŞİKLİKLERİ

### Adım F1 — Çeviri Anahtarları Ekle

`src/locales/tr/translation.json` dosyasında `"forgot_password"` objesini şu şekilde güncelle (mevcut anahtarları koru, yenileri ekle):

```json
"forgot_password": {
  "title": "Şifrenizi mi Unuttunuz?",
  "subtitle": "Hesabınıza kayıtlı e-posta adresini girin. Sistemde kayıtlıysa sıfırlama bağlantısı gönderilecektir.",
  "email_label": "E-posta Adresi",
  "email_placeholder": "E-posta adresinizi girin",
  "submit": "Sıfırlama Bağlantısı Gönder",
  "sending": "Gönderiliyor...",
  "remembered_password": "Şifrenizi hatırladınız mı?",
  "login_now": "Giriş yapın",
  "success_message": "Eğer bu e-posta adresi sistemimizde kayıtlıysa, birkaç dakika içinde bir sıfırlama bağlantısı alacaksınız. Spam klasörünüzü de kontrol edin.",
  "error_generic": "Bir hata oluştu. Lütfen daha sonra tekrar deneyin."
}
```

`src/locales/en/translation.json` dosyasında `"forgot_password"` objesini şu şekilde güncelle:

```json
"forgot_password": {
  "title": "Forgot Your Password?",
  "subtitle": "Enter the email address for your account. If it's registered, we'll send you a reset link.",
  "email_label": "Email Address",
  "email_placeholder": "Enter your email address",
  "submit": "Send Reset Link",
  "sending": "Sending...",
  "remembered_password": "Remember your password?",
  "login_now": "Sign in",
  "success_message": "If this email is registered in our system, you'll receive a reset link shortly. Check your spam folder too.",
  "error_generic": "An error occurred. Please try again later."
}
```

---

### Adım F2 — ForgotPasswordPage.tsx'i Yeniden Yaz

`src/pages/ForgotPasswordPage.tsx` dosyasını tamamen şu içerikle değiştir:

```tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useTranslation } from 'react-i18next';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiService.post('/auth/forgot-password', { email: email.trim() });
      setSubmitted(true);
    } catch {
      setError(t('forgot_password.error_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {t('forgot_password.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('forgot_password.subtitle')}
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-green-800 text-sm leading-relaxed">
              {t('forgot_password.success_message')}
            </p>
            <Link to="/login" className="mt-4 inline-block text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              {t('forgot_password.login_now')} →
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('forgot_password.email_label')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder={t('forgot_password.email_placeholder')}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? t('forgot_password.sending') : t('forgot_password.submit')}
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('forgot_password.remembered_password')}{' '}
                <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                  {t('forgot_password.login_now')}
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
```

---

### Adım F3 — ResetPasswordPage.tsx Oluştur

Yeni dosya oluştur: `src/pages/ResetPasswordPage.tsx`

```tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Leaf, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useTranslation } from 'react-i18next';

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError(t('reset_password.invalid_token'));
    }
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError(t('reset_password.password_too_short'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('reset_password.password_mismatch'));
      return;
    }

    setLoading(true);
    try {
      await apiService.post('/auth/reset-password', {
        token,
        newPassword,
        confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || t('reset_password.error_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {t('reset_password.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('reset_password.subtitle')}
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-green-800 font-semibold mb-2">{t('reset_password.success_title')}</p>
            <p className="text-green-700 text-sm mb-4">{t('reset_password.success_message')}</p>
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              {t('reset_password.go_to_login')} →
            </Link>
          </div>
        ) : !token ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-800 text-sm">{t('reset_password.invalid_token')}</p>
            <Link to="/forgot-password" className="mt-4 inline-block text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              {t('reset_password.request_new_link')}
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  {t('reset_password.new_password_label')}
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  {t('reset_password.confirm_password_label')}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-60"
            >
              {loading ? t('reset_password.saving') : t('reset_password.submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
```

---

### Adım F4 — Çeviri Anahtarlarını Ekle (Reset Password)

`src/locales/tr/translation.json` dosyasına root level'da yeni bir obje ekle:

```json
"reset_password": {
  "title": "Yeni Şifre Belirle",
  "subtitle": "Güçlü bir şifre seçin (en az 8 karakter).",
  "new_password_label": "Yeni Şifre",
  "confirm_password_label": "Şifre Tekrarı",
  "submit": "Şifremi Güncelle",
  "saving": "Güncelleniyor...",
  "success_title": "Şifreniz Güncellendi!",
  "success_message": "Yeni şifrenizle giriş yapabilirsiniz. Birkaç saniye içinde giriş sayfasına yönlendiriliyorsunuz.",
  "go_to_login": "Giriş sayfasına git",
  "invalid_token": "Geçersiz veya eksik sıfırlama bağlantısı. Lütfen yeni bir sıfırlama bağlantısı talep edin.",
  "request_new_link": "Yeni bağlantı talep et",
  "password_too_short": "Şifre en az 8 karakter olmalıdır.",
  "password_mismatch": "Şifreler eşleşmiyor.",
  "error_generic": "Bir hata oluştu. Bağlantı geçersiz veya süresi dolmuş olabilir."
}
```

`src/locales/en/translation.json` dosyasına ekle:

```json
"reset_password": {
  "title": "Set New Password",
  "subtitle": "Choose a strong password (at least 8 characters).",
  "new_password_label": "New Password",
  "confirm_password_label": "Confirm Password",
  "submit": "Update Password",
  "saving": "Updating...",
  "success_title": "Password Updated!",
  "success_message": "You can now sign in with your new password. Redirecting to login...",
  "go_to_login": "Go to login",
  "invalid_token": "Invalid or missing reset link. Please request a new one.",
  "request_new_link": "Request new link",
  "password_too_short": "Password must be at least 8 characters.",
  "password_mismatch": "Passwords do not match.",
  "error_generic": "An error occurred. The link may be invalid or expired."
}
```

---

### Adım F5 — Route'u Kaydet

`src/App.tsx` ya da route dosyasını aç. Projedeki route tanımı nerede yapılıyorsa (`src/routes.tsx` veya `src/App.tsx`) şu import ve route'u ekle:

Önce dosyayı bul:
```bash
grep -r "ForgotPasswordPage" /home/ubuntu/idecWebsite/src/ -l
```

Bulunan dosyada:
1. `import ResetPasswordPage from './pages/ResetPasswordPage';` satırını import listesine ekle
2. Route listesine: `<Route path="/reset-password" element={<ResetPasswordPage />} />` ekle

---

## Doğrulama

1. Backend'i derle ve yeniden başlat
2. Frontend'i çalıştır: `npm run dev`
3. `/forgot-password` sayfasına git → E-posta girilmeli ve submit edilebilmeli
4. Mail konfigürasyonu varsa e-posta gelecektir; yoksa hata loglanacak ama kullanıcıya hep aynı mesaj gösterilecek
5. `/reset-password?token=test-token` adresine gir → Form görünmeli
6. Geçersiz token ile submit et → Hata mesajı görünmeli

---

## Tamamlandı mı? Log Yaz

`PROGRESS_LOG.md` dosyasına şu formatta ekle:

```markdown
## TASK_04 — Şifremi Unuttum Tam Akışı
**Tamamlanma Tarihi:** [tarih]
**Durum:** Tamamlandı

### Yapılanlar
- User entity'ye passwordResetToken ve passwordResetTokenExpiry alanları eklendi
- PasswordResetService oluşturuldu (token üretimi, mail gönderimi, şifre güncelleme)
- UserRepository'ye findByPasswordResetToken metodu eklendi
- AuthController'a /forgot-password ve /reset-password endpoint'leri eklendi
- ForgotPasswordPage.tsx gerçek API çağrısı yapacak şekilde yeniden yazıldı
- ResetPasswordPage.tsx oluşturuldu
- /reset-password route'u eklendi
- TR ve EN çeviri anahtarları eklendi

### Değiştirilen/Eklenen Dosyalar
- `entity/User.java`
- `service/PasswordResetService.java` (yeni)
- `repository/UserRepository.java`
- `controller/AuthController.java`
- `src/pages/ForgotPasswordPage.tsx`
- `src/pages/ResetPasswordPage.tsx` (yeni)
- `src/routes.tsx` veya `src/App.tsx`
- `src/locales/tr/translation.json`
- `src/locales/en/translation.json`
```

`TASKS_INDEX.md`'deki Task 04 satırını `✅ Tamamlandı` yap.
