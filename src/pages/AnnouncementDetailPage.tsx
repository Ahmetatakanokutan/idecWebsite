import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
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
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                </div>
            </Layout>
        );
    }

    if (notFound || !announcement) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto px-4 py-24 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('announcement_detail.not_found')}</h1>
                    <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
                        {t('announcement_detail.back_home')}
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-6 text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t('announcement_detail.back_home')}
                </Link>

                {announcement.imageUrl && (
                    <img
                        src={resolveAssetUrl(announcement.imageUrl)}
                        alt={announcement.title}
                        className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg mb-8"
                    />
                )}

                <div className="flex items-center text-emerald-600 text-sm font-semibold mb-4 uppercase tracking-widest">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(announcement.createdAt).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {announcement.title}
                </h1>

                <div
                    className="text-gray-700 text-lg leading-relaxed whitespace-pre-line mb-10 [&_p]:mb-4 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-6 [&_h4]:text-xl [&_h4]:font-bold [&_h4]:mb-2 [&_h4]:mt-4 [&_a]:text-emerald-600 [&_a]:underline hover:[&_a]:text-emerald-700"
                    dangerouslySetInnerHTML={{ __html: prepareContentHtml(announcement.content) }}
                />
            </div>
        </Layout>
    );
};

export default AnnouncementDetailPage;
