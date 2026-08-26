import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import { apiService, resolveAssetUrl } from '../services/apiService';
import { stripHtml, truncate } from '../utils/text';
import { useTranslation } from 'react-i18next';

interface Announcement {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

const SUMMARY_MAX_LENGTH = 220;

const AnnouncementsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: 'ACTIVE' | 'ARCHIVE' = searchParams.get('tab') === 'archive' ? 'ARCHIVE' : 'ACTIVE';

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  const switchTab = (tab: 'ACTIVE' | 'ARCHIVE') => {
    setSearchParams(tab === 'ARCHIVE' ? { tab: 'archive' } : {});
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const endpoint = activeTab === 'ARCHIVE' ? '/announcements/archive' : '/announcements/active';
        const data = await apiService.get(endpoint);
        setAnnouncements(data);
      } catch (err: any) {
        setError(err.message || t('announcements_page.fetch_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [activeTab]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('announcements_page.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('announcements_page.subtitle')}</p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          <button
            type="button"
            onClick={() => switchTab('ACTIVE')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'ACTIVE'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {t('announcements_page.tab_active')}
          </button>
          <button
            type="button"
            onClick={() => switchTab('ARCHIVE')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'ARCHIVE'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {t('announcements_page.tab_archive')}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-10 h-10 mx-auto animate-spin text-emerald-600" />
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 p-8 rounded-lg">
            <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
            <p className="mt-4 text-red-700 font-semibold">{error}</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            {t('announcements_page.no_results')}
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Link
                key={announcement.id}
                to={`/announcements/${announcement.id}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {announcement.imageUrl && (
                    <div className="sm:w-56 h-40 sm:h-auto flex-shrink-0">
                      <img
                        src={resolveAssetUrl(announcement.imageUrl)}
                        alt={announcement.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1">
                    <div className="flex items-center text-emerald-600 text-xs font-semibold mb-2 uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {new Date(announcement.createdAt).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{announcement.title}</h2>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      {truncate(stripHtml(announcement.content), SUMMARY_MAX_LENGTH)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-sm">
                      {t('common.read_more')}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AnnouncementsPage;
