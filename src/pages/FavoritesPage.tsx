import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Star, Users, AlertTriangle, Loader, Heart } from 'lucide-react';
import { apiService } from '../services/apiService';

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
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await apiService.get('/courses/favorites');
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Favoriler yüklenirken bir hata oluştu.');
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
          <Loader className="w-12 h-12 mx-auto animate-spin text-emerald-600" />
          <p className="mt-4 text-lg text-gray-600">Favoriler yükleniyor...</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Favorilerim
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Kaydettiğiniz derslere buradan hızlıca erişebilirsiniz.
          </p>
        </div>

        {courses.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Henüz favori dersiniz yok</h3>
                <p className="text-gray-500 mt-2">Beğendiğiniz dersleri favorilere ekleyerek burada görebilirsiniz.</p>
                <Link to="/courses" className="mt-6 inline-block bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors">
                    Dersleri Keşfet
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="block">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
                    {course.image ? (
                        <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                    ) : (
                        <div className="w-full h-48 bg-emerald-100 flex items-center justify-center">
                            <span className="text-emerald-500 font-semibold">IDEC Akademi</span>
                        </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex-grow">
                        {course.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                        {course.description}
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{course.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{course.students} öğrenci</span>
                        </div>
                        </div>
                        <div className="text-sm text-emerald-600 font-semibold">
                        Eğitmen: {course.instructorName}
                        </div>
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

export default FavoritesPage;
