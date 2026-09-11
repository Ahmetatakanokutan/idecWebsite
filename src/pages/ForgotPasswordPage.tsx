import { useState } from 'react';
import { Link } from 'react-router-dom';
import {Mail} from 'lucide-react';
import { apiService } from '../services/apiService';
import { useTranslation } from 'react-i18next';
import AuthShell, {
  authButtonClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
} from '../components/AuthShell';

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
    <AuthShell title={t('forgot_password.title')} subtitle={t('forgot_password.subtitle')}>
      {submitted ? (
        <div className="bg-accent-bright/[0.07] border border-accent-bright/25 rounded-xl p-6 text-center">
          <Mail className="w-12 h-12 text-accent-deep mx-auto mb-4" />
          <p className="text-gray-700 leading-relaxed">{t('forgot_password.success_message')}</p>
          <Link to="/login" className={`mt-5 inline-block ${authLinkClass}`}>
            {t('forgot_password.login_now')} &rarr;
          </Link>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label htmlFor="email" className={authLabelClass}>
              {t('forgot_password.email_label')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInputClass}
              placeholder={t('forgot_password.email_placeholder')}
            />
          </div>

          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? t('forgot_password.sending') : t('forgot_password.submit')}
          </button>

          <p className="text-center text-sm text-gray-600">
            {t('forgot_password.remembered_password')}{' '}
            <Link to="/login" className={authLinkClass}>
              {t('forgot_password.login_now')}
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
};

export default ForgotPasswordPage;
