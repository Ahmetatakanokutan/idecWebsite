import { Link, useNavigate, useSearchParams, useLocation, type Location } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AuthShell, {
  authButtonClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
} from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const verified = searchParams.get('verified');
    if (verified === 'success') {
      setSuccess(t('login_page.verified_success'));
      setError(null);
    } else if (verified === 'error') {
      setError(t('login_page.verified_error'));
      setSuccess(null);
    }
  }, [searchParams, t]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // const response = await fetch('http://localhost:8080/api/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ username: email, password }),
      // });
      
      const data = await apiService.post('/auth/login', { username: email, password });
      
      // apiService throws error if not ok, so we catch it below. 
      // And apiService returns the json directly.
      
      login(data.token);

      // ProtectedRoute, giriş yapılmamış kullanıcıyı buraya yönlendirirken hedeflediği
      // sayfayı state.from'a koyar; varsa oraya, yoksa eski davranış (ana sayfa).
      const from = (location.state as { from?: Location } | null)?.from;
      if (from) {
        navigate(`${from.pathname}${from.search}${from.hash}`);
      } else {
        navigate('/');
      }
    } catch (error: any) {
      const backendMessage = error?.message || '';
      if (backendMessage.toLowerCase().includes('verify your email')) {
        setError(t('login_page.error_verify_email'));
      } else if (backendMessage.includes('401')) {
        setError(t('login_page.error_invalid_credentials'));
      } else {
        setError(backendMessage || t('login_page.error_generic'));
      }
    }
  };

  return (
    <AuthShell title={t('login_page.title')} subtitle={t('login_page.subtitle')}>
      <form className="space-y-5" onSubmit={handleLogin}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">{t('login_page.error_prefix')}</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {success && (
          <div className="bg-accent-bright/10 border border-accent-bright/30 text-accent-deep px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">{t('login_page.success_prefix')}</strong>
            <span className="block sm:inline"> {success}</span>
          </div>
        )}

        <div>
          <label htmlFor="email" className={authLabelClass}>
            {t('login_page.email_label')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
            placeholder={t('login_page.email_placeholder')}
          />
        </div>

        <div>
          <label htmlFor="password" className={authLabelClass}>
            {t('login_page.password_label')}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
            placeholder={t('login_page.password_placeholder')}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-accent-deep focus:ring-accent-bright border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
              {t('login_page.remember_me')}
            </label>
          </div>

          <Link to="/forgot-password" className={`text-sm ${authLinkClass}`}>
            {t('login_page.forgot_password')}
          </Link>
        </div>

        <button type="submit" className={authButtonClass}>
          {t('login_page.submit')}
        </button>

        <p className="text-center text-sm text-gray-600">
          {t('login_page.no_account')}{' '}
          <Link to="/register" className={authLinkClass}>
            {t('login_page.register_now')}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
