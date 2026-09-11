import { Link, useSearchParams } from 'react-router-dom';
import { Search, Star, Users, Leaf, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { apiService, resolveAssetUrl } from '../services/apiService';
import { useTranslation } from 'react-i18next';

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  instructorName: string;
  rating: number;
  students: number;
  courseType?: 'COURSE' | 'WEBINAR';
}

const CoursesPage = () => {
  const [searchParams] = useSearchParams();
  const activeTab: 'COURSE' | 'WEBINAR' = searchParams.get('tab') === 'webinars' ? 'WEBINAR' : 'COURSE';

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await apiService.get(`/courses?type=${activeTab}`);
        setCourses(data);
      } catch (err: any) {
        setError(err.message || 'Dersler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [activeTab]);

  const getLocalizedContent = (course: Course) => {
    if (i18n.language === 'en') {
        const translated = t(`courses.items.${course.title}`, { returnObjects: true }) as any;
        if (translated && translated.title) {
            return {
                title: translated.title,
                description: translated.description
            };
        }
    }
    return {
        title: course.title,
        description: course.description
    };
  };

  const filteredCourses = courses.filter(course => {
    const localized = getLocalizedContent(course);
    return (
        localized.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        localized.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-accent-deep" />
          <p className="mt-4 text-lg text-gray-600">{t('courses.loading')}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16 bg-red-50 border border-red-100 p-8 rounded-2xl">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <p className="mt-4 text-lg text-red-700 font-semibold">{error}</p>
        </div>
      );
    }

    if (filteredCourses.length === 0) {
      return (
        <div className="text-center py-20 rounded-2xl border border-dashed border-gray-300 bg-white">
          <Leaf className="w-10 h-10 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">{t('courses.no_results')}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course, i) => {
          const localized = getLocalizedContent(course);
          return (
            <Reveal key={course.id} delay={(i % 3) * 100} className="h-full">
              <Link to={`/courses/${course.id}`} className="block h-full">
                <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-accent-bright/40 motion-reduce:hover:translate-y-0 transition-all duration-300 h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    {course.image ? (
                      <img
                        src={resolveAssetUrl(course.image)}
                        alt={localized.title}
                        className="w-full h-48 object-cover group-hover:scale-105 motion-reduce:group-hover:scale-100 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-48 bg-ink-gradient flex items-center justify-center">
                        <span className="text-white/80 font-semibold tracking-wide">IDEC Akademi</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-ink-deep mb-3 flex-grow leading-snug">{localized.title}</h3>
                    <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">{localized.description}</p>

                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="font-semibold text-ink-deep">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>
                          {course.students} {t('courses.students')}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-accent-deep font-semibold">
                      {t('courses.instructor')} {course.instructorName}
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    );
  };

  return (
    <Layout>
      <div className="font-archivo">
        <PageHero
          eyebrow={t('courses.hero_eyebrow')}
          title={activeTab === 'WEBINAR' ? t('courses.title_webinars') : t('courses.title')}
          description={t('courses.subtitle')}
        >
          {/* Arama kutusu koyu bandın içinde — listeyle birlikte kaymıyor */}
          <div className="max-w-xl relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/50" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3.5 rounded-full bg-white/[0.12] backdrop-blur-md border border-white/25 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              placeholder={t('courses.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </PageHero>

        <section className="bg-paper py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{renderContent()}</div>
        </section>
      </div>
    </Layout>
  );
};

export default CoursesPage;
