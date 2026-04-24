import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Leaf } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-14 h-14 bg-emerald-600 rounded-lg">
            <Leaf className="w-7 h-7 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">E-posta Dogrulama</h1>
        <p
          className={`text-sm mb-6 ${
            state === 'success'
              ? 'text-emerald-700'
              : state === 'error'
              ? 'text-red-700'
              : 'text-gray-600'
          }`}
        >
          {message}
        </p>

        <div className="space-y-3">
          <Link
            to="/login"
            className="inline-flex w-full justify-center py-2 px-4 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Giris Sayfasina Git
          </Link>
          <Link to="/" className="inline-flex w-full justify-center text-emerald-700 hover:text-emerald-800">
            Ana Sayfaya Don
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
