import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Mail } from 'lucide-react';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import { useTranslation } from 'react-i18next';

/**
 * Eslesmeyen her adres icin. Eskiden route listesinde "diger her sey" satiri
 * olmadigi icin yanlis yazilmis bir adres bos beyaz sayfa aciyordu.
 */
const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <PageHero
        eyebrow={t('not_found.eyebrow')}
        title={t('not_found.title')}
        description={t('not_found.description')}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-accent text-ink-deep px-7 py-3.5 rounded-lg font-bold hover:bg-white transition-colors shadow-lg shadow-accent/20"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('not_found.home')}
          </Link>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center gap-2 bg-white/[0.08] backdrop-blur-sm border border-white/30 text-white px-7 py-3.5 rounded-lg font-semibold hover:bg-white/[0.18] transition-colors"
          >
            <GraduationCap className="w-5 h-5" />
            {t('not_found.courses')}
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 bg-white/[0.08] backdrop-blur-sm border border-white/30 text-white px-7 py-3.5 rounded-lg font-semibold hover:bg-white/[0.18] transition-colors"
          >
            <Mail className="w-5 h-5" />
            {t('not_found.contact')}
          </Link>
        </div>
      </PageHero>
    </Layout>
  );
};

export default NotFoundPage;
