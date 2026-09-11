import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
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

  const tabButton = (tab: 'ACTIVE' | 'ARCHIVE', label: string) => (
    <button
      type="button"
      onClick={() => switchTab(tab)}
      aria-pressed={activeTab === tab}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
        activeTab === tab
          ? 'bg-accent text-ink-deep'
          : 'bg-white/[0.12] text-white/75 border border-white/25 hover:bg-white/[0.2] hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <Layout>
      <div className="font-archivo">
        <PageHero
          eyebrow={t('announcements_page.hero_eyebrow')}
          title={t('announcements_page.title')}
          description={t('announcements_page.subtitle')}
        >
          <div className="flex flex-wrap gap-2">
            {tabButton('ACTIVE', t('announcements_page.tab_active'))}
            {tabButton('ARCHIVE', t('announcements_page.tab_archive'))}
          </div>
        </PageHero>

        <section className="bg-paper py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-16">
                <Loader2 className="w-10 h-10 mx-auto animate-spin text-accent-deep" />
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-red-50 border border-red-100 p-8 rounded-2xl">
                <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
                <p className="mt-4 text-red-700 font-semibold">{error}</p>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-dashed border-gray-300 bg-white text-gray-500">
                {t('announcements_page.no_results')}
              </div>
            ) : (
              <div className="space-y-5">
                {announcements.map((announcement, i) => (
                  <Reveal key={announcement.id} delay={Math.min(i, 4) * 90}>
                    <Link
                      to={`/announcements/${announcement.id}`}
                      className="group block bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:border-accent-bright/40 motion-reduce:hover:translate-y-0 transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {announcement.imageUrl && (
                          <div className="sm:w-56 h-44 sm:h-auto flex-shrink-0 overflow-hidden">
                            <img
                              src={resolveAssetUrl(announcement.imageUrl)}
                              alt={announcement.title}
                              className="w-full h-full object-cover group-hover:scale-105 motion-reduce:group-hover:scale-100 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6 flex-1">
                          <div className="flex items-center text-accent-deep text-xs font-bold mb-2 uppercase tracking-widest">
                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                            {new Date(announcement.createdAt).toLocaleDateString(i18n.language, {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </div>
                          <h2 className="text-xl font-bold text-ink-deep mb-2 leading-snug">{announcement.title}</h2>
                          <p className="text-gray-600 leading-relaxed mb-4">
                            {truncate(stripHtml(announcement.content), SUMMARY_MAX_LENGTH)}
                          </p>
                          <span className="inline-flex items-center gap-1.5 text-accent-deep font-bold text-sm">
                            {t('common.read_more')}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AnnouncementsPage;
