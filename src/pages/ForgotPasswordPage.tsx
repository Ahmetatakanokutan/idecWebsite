import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail } from 'lucide-react';
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
            <Mail className="w-12 h-12 text-green-500 mx-auto mb-4" />
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
