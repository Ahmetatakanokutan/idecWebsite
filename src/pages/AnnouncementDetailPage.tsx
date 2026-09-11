import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { apiService, resolveAssetUrl } from '../services/apiService';
import { useTranslation } from 'react-i18next';

interface Announcement {
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
}

// Icerik icindeki linkleri hedefe gore ayarlar: site-ici (/ ile baslayan) linkler
// ayni sekmede, harici linkler yeni sekmede acilir. Icerik zaten backend'de
// (jsoup Safelist) sanitize edildigi icin burada sadece link ozniteliklerini duzenliyoruz.
const prepareContentHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('a').forEach((anchor) => {
        const href = anchor.getAttribute('href') || '';
        if (href.startsWith('/') && !href.startsWith('//')) {
            anchor.removeAttribute('target');
            anchor.removeAttribute('rel');
        } else {
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('rel', 'noopener noreferrer');
        }
    });
    return doc.body.innerHTML;
};

const AnnouncementDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                setLoading(true);
                setNotFound(false);
                const data = await apiService.get(`/announcements/${id}`);
                setAnnouncement(data);
            } catch (err) {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncement();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-10 h-10 animate-spin text-accent-deep" />
                </div>
            </Layout>
        );
    }

    if (notFound || !announcement) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto px-4 py-24 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold text-ink-deep mb-6">{t('announcement_detail.not_found')}</h1>
                    <Link to="/" className="text-accent-deep hover:text-ink-deep font-bold">
                        {t('announcement_detail.back_home')}
                    </Link>
                </div>
            </Layout>
        );
    }

    const publishedOn = new Date(announcement.createdAt).toLocaleDateString(i18n.language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <Layout>
            <div className="font-archivo">
                <PageHero
                    eyebrow={publishedOn}
                    title={announcement.title}
                    align="center"
                />

                <section className="bg-paper py-16 md:py-20">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link
                            to="/announcements"
                            className="inline-flex items-center gap-2 text-accent-deep hover:text-ink-deep mb-8 font-bold transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {t('announcement_detail.back_home')}
                        </Link>

                        <Reveal>
                            <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                {announcement.imageUrl && (
                                    <img
                                        src={resolveAssetUrl(announcement.imageUrl)}
                                        alt={announcement.title}
                                        className="w-full h-64 sm:h-80 object-cover"
                                    />
                                )}

                                <div className="p-7 md:p-10">
                                    <div className="flex items-center text-accent-deep text-sm font-bold mb-6 uppercase tracking-widest">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {publishedOn}
                                    </div>

                                    <div
                                        className="text-gray-700 text-lg leading-relaxed whitespace-pre-line [&_p]:mb-4 [&_strong]:font-bold [&_strong]:text-ink-deep [&_em]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-ink-deep [&_h3]:mb-3 [&_h3]:mt-6 [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-ink-deep [&_h4]:mb-2 [&_h4]:mt-4 [&_a]:text-accent-deep [&_a]:underline hover:[&_a]:text-ink-deep"
                                        dangerouslySetInnerHTML={{ __html: prepareContentHtml(announcement.content) }}
                                    />
                                </div>
                            </article>
                        </Reveal>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default AnnouncementDetailPage;
