import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { Star, Users, AlertTriangle, Loader, Heart } from 'lucide-react';
import { apiService, resolveAssetUrl } from '../services/apiService';
import { useTranslation } from 'react-i18next';

interface CourseSummary {
  id: number;
  title: string;
  description: string;
  image: string;
  instructorName: string;
  rating: number;
  students: number;
}

const FavoritesPage = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await apiService.get('/courses/favorites');
      setCourses(data);
    } catch (err: any) {
      setError(err.message || t('favorites_page.error_loading'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <Loader className="w-12 h-12 mx-auto animate-spin text-accent-deep" />
          <p className="mt-4 text-lg text-gray-600">{t('favorites_page.loading')}</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-20 bg-red-50 p-8 rounded-lg mx-4">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
          <p className="mt-4 text-lg text-red-700 font-semibold">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="font-archivo">
        <PageHero title={t('favorites_page.title')} description={t('favorites_page.subtitle')} compact />

        <section className="bg-paper py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {courses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <Heart className="w-14 h-14 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-ink-deep">{t('favorites_page.empty_title')}</h3>
                <p className="text-gray-500 mt-2">{t('favorites_page.empty_desc')}</p>
                <Link
                  to="/courses"
                  className="mt-6 inline-block bg-accent-gradient text-white px-6 py-3 rounded-lg font-bold hover:brightness-110 transition-all shadow-md shadow-accent-bright/25"
                >
                  {t('favorites_page.explore_courses')}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, i) => (
                  <Reveal key={course.id} delay={(i % 3) * 100} className="h-full">
                    <Link to={`/courses/${course.id}`} className="block h-full">
                      <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-accent-bright/40 motion-reduce:hover:translate-y-0 transition-all duration-300 h-full flex flex-col">
                        {course.image ? (
                          <img
                            src={resolveAssetUrl(course.image)}
                            alt={course.title}
                            className="w-full h-48 object-cover group-hover:scale-105 motion-reduce:group-hover:scale-100 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-48 bg-ink-gradient flex items-center justify-center">
                            <span className="text-white/80 font-semibold tracking-wide">{t('header.academy')}</span>
                          </div>
                        )}
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold text-ink-deep mb-3 flex-grow leading-snug">{course.title}</h3>
                          <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">{course.description}</p>
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
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FavoritesPage;
