import { useEffect, useState } from 'react';
import { Search, Download, Loader2, AlertCircle, FileText } from 'lucide-react';
import Layout from '../components/Layout';
import { seminarCertificateService } from '../services/apiService';
import { useTranslation } from 'react-i18next';

interface SeminarCertificate {
  id: number;
  fullName: string;
}

const SeminarCertificatesPage = () => {
  const { t } = useTranslation();
  const [certificates, setCertificates] = useState<SeminarCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchCertificates = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await seminarCertificateService.list(searchTerm);
          setCertificates(data);
        } catch (err: any) {
          setError(err.message || t('seminar_certificates.fetch_error'));
        } finally {
          setLoading(false);
        }
      };
      fetchCertificates();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleDownload = async (id: number, fullName: string) => {
    setDownloadingId(id);
    setDownloadError(null);

    try {
      const token = localStorage.getItem('token');
      const envBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
      const baseUrl = envBaseUrl || window.location.origin;
      const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/seminar-certificates/${id}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error(t('seminar_certificates.download_error'));
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${fullName}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setDownloadError(err.message || t('seminar_certificates.download_error'));
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('seminar_certificates.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('seminar_certificates.subtitle')}</p>
        </div>

        <div className="max-w-xl mx-auto relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm sm:text-sm transition-all"
            placeholder={t('seminar_certificates.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {downloadError && (
          <div className="max-w-xl mx-auto mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {downloadError}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-10 h-10 mx-auto animate-spin text-emerald-600" />
            <p className="mt-4 text-gray-600">{t('seminar_certificates.loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 p-8 rounded-lg">
            <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
            <p className="mt-4 text-red-700 font-semibold">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">{cert.fullName}</span>
                </div>
                <button
                  onClick={() => handleDownload(cert.id, cert.fullName)}
                  disabled={downloadingId === cert.id}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {downloadingId === cert.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{downloadingId === cert.id ? t('seminar_certificates.downloading') : t('seminar_certificates.download')}</span>
                </button>
              </div>
            ))}
            {certificates.length === 0 && (
              <div className="text-center py-10 text-gray-500">{t('seminar_certificates.no_results')}</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SeminarCertificatesPage;
