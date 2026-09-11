import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthShell, { authButtonClass, authLinkClass } from '../components/AuthShell';
import { apiService } from '../services/apiService';

type VerifyState = 'loading' | 'success' | 'error';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<VerifyState>('loading');
  const [message, setMessage] = useState('E-posta adresiniz dogrulaniyor...');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setState('error');
      setMessage('Dogrulama kodu bulunamadi. Lutfen maildeki linki tekrar acin.');
      return;
    }

    let cancelled = false;

    const verify = async () => {
      try {
        const response = await apiService.get(`/auth/verify?code=${encodeURIComponent(code)}&mode=api`);
        if (cancelled) {
          return;
        }
        setState('success');
        setMessage(response?.message || 'E-posta adresiniz basariyla dogrulandi.');
      } catch (error: any) {
        if (cancelled) {
          return;
        }
        setState('error');
        setMessage(error?.message || 'Dogrulama basarisiz. Link gecersiz veya suresi dolmus olabilir.');
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <AuthShell title="E-posta Dogrulama">
      <div className="text-center">
        <p
          className={`mb-8 ${
            state === 'success' ? 'text-accent-deep' : state === 'error' ? 'text-red-700' : 'text-gray-600'
          }`}
        >
          {message}
        </p>

        <div className="space-y-3">
          <Link to="/login" className={authButtonClass}>
            Giris Sayfasina Git
          </Link>
          <Link to="/" className={`inline-block ${authLinkClass}`}>
            Ana Sayfaya Don
          </Link>
        </div>
      </div>
    </AuthShell>
  );
};

export default VerifyEmailPage;
