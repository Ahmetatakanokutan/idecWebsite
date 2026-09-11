import { useEffect, useState } from 'react';
import { Search, Download, Loader2, AlertCircle, FileText } from 'lucide-react';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
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
      <div className="font-archivo">
        <PageHero
          title={t('seminar_certificates.title')}
          description={t('seminar_certificates.subtitle')}
          compact
        >
          <div className="max-w-xl relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/50" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3.5 rounded-full bg-white/[0.12] backdrop-blur-md border border-white/25 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              placeholder={t('seminar_certificates.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </PageHero>

        <div className="bg-paper py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {downloadError && (
          <div className="max-w-xl mx-auto mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {downloadError}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-10 h-10 mx-auto animate-spin text-accent-deep" />
            <p className="mt-4 text-gray-600">{t('seminar_certificates.loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 p-8 rounded-lg">
            <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
            <p className="mt-4 text-red-700 font-semibold">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-accent-deep flex-shrink-0" />
                  <span className="text-ink-deep font-semibold">{cert.fullName}</span>
                </div>
                <button
                  onClick={() => handleDownload(cert.id, cert.fullName)}
                  disabled={downloadingId === cert.id}
                  className="flex items-center space-x-2 bg-cta-gradient hover:brightness-105 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all shadow-md shadow-accent-bright/25 disabled:opacity-60 disabled:cursor-not-allowed"
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
        </div>
      </div>
    </Layout>
  );
};

export default SeminarCertificatesPage;
