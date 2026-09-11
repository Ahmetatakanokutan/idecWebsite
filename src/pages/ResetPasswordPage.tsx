import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import AuthShell, {
  authButtonClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
} from '../components/AuthShell';
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
    <AuthShell title={t('reset_password.title')} subtitle={t('reset_password.subtitle')}>
      {success ? (
        <div className="bg-accent-bright/[0.07] border border-accent-bright/25 rounded-xl p-6 text-center">
          <CheckCircle className="w-12 h-12 text-accent-deep mx-auto mb-4" />
          <p className="text-ink-deep font-bold mb-2">{t('reset_password.success_title')}</p>
          <p className="text-gray-600 mb-5">{t('reset_password.success_message')}</p>
          <Link to="/login" className={authLinkClass}>
            {t('reset_password.go_to_login')} &rarr;
          </Link>
        </div>
      ) : !token ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-800">{t('reset_password.invalid_token')}</p>
          <Link to="/forgot-password" className={`mt-5 inline-block ${authLinkClass}`}>
            {t('reset_password.request_new_link')}
          </Link>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label htmlFor="newPassword" className={authLabelClass}>
              {t('reset_password.new_password_label')}
            </label>
            <input
              id="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={authInputClass}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={authLabelClass}>
              {t('reset_password.confirm_password_label')}
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={authInputClass}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? t('reset_password.saving') : t('reset_password.submit')}
          </button>
        </form>
      )}
    </AuthShell>
  );
};

export default ResetPasswordPage;
