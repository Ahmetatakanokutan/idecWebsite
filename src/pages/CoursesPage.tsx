import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Star, Users, AlertTriangle, Loader } from 'lucide-react';

// Define the Course type based on the backend DTO
interface CourseSummary {
  id: number;
  title: string;
  description: string;
  instructorName: string;
  rating: number;
  students: number;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/courses');
        if (!response.ok) {
          throw new Error('Dersler yüklenemedi.');
        }
        const data = await response.json();
        setCourses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <Loader className="w-12 h-12 mx-auto animate-spin text-emerald-600" />
          <p className="mt-4 text-lg text-gray-600">Dersler yükleniyor...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 bg-red-50 p-8 rounded-lg">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
          <p className="mt-4 text-lg text-red-700 font-semibold">{error}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link key={course.id} to={`/courses/${course.id}`} className="block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="w-full h-48 bg-emerald-100 flex items-center justify-center">
                 {/* Placeholder for image, as it's not in the DTO */}
                <span className="text-emerald-500">IDEC Akademi</span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex-grow">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4">
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
    );
  };


  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            IDEC Akademi Dersleri
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Karbonsuzlaştırma ve sürdürülebilirlik alanında uzmanlaşmak için hazırlanan eğitimlerimize göz atın.
          </p>
        </div>
        {renderContent()}
      </div>
    </Layout>
  );
};

export default CoursesPage;