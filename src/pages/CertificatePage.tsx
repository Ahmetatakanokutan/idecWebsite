import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Award, Download, Loader2 } from 'lucide-react';
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
      const token = localStorage.getItem('token');
      const envBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
      const baseUrl = envBaseUrl || window.location.origin;
      const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/certificate/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('Sertifika indirilemedi.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'IDECTT_Sertifika.pdf';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch {
      setError('Sertifika indirilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setDownloading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper font-archivo">
        <div className="text-center p-8">
          <p className="text-gray-600 mb-4">Sertifikanızı görüntülemek için giriş yapmalısınız.</p>
          <Link to="/login" className="bg-cta-gradient text-white px-6 py-2.5 rounded-lg hover:brightness-105 font-bold shadow-md shadow-accent-bright/25">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <Loader2 className="w-10 h-10 animate-spin text-accent-deep" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper font-archivo flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {eligible ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-accent-bright/25">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-accent-gradient rounded-full flex items-center justify-center shadow-lg shadow-accent-bright/25">
                <Award className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-ink-deep mb-2">Tebrikler!</h2>
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
              className="w-full flex items-center justify-center space-x-2 bg-cta-gradient hover:brightness-105 text-white font-bold shadow-md shadow-accent-bright/25 py-3 px-6 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
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
            <h2 className="text-2xl font-bold text-ink-deep mb-2">Sertifika Henüz Hazır Değil</h2>
            <p className="text-gray-600 mb-4">
              Başarı belgesi alabilmek için platformdaki tüm eğitimlerin en az <strong>%80'ini</strong> tamamlamanız gerekiyor.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Eğitimlerinizi tamamladıktan sonra bu sayfaya gelin.
            </p>
            <Link
              to="/courses"
              className="inline-block bg-cta-gradient hover:brightness-105 text-white font-bold py-3 px-6 rounded-lg transition-all"
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
