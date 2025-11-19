import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Star, Users, ChevronRight, BookOpen, Loader, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Backend DTO yapılarına göre arayüzleri tanımla
interface Lesson {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
}

interface Instructor {
  name: string;
  title: string;
}

interface CourseDetail {
  id: number;
  title: string;
  description: string;
  rating: number;
  students: number;
  instructor: Instructor;
  lessons: Lesson[];
}

const CourseDetailPage = () => {
  const { isLoggedIn, token } = useAuth();
  const { courseId } = useParams();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/courses/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Ders detayı yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        }
        
        const data: CourseDetail = await response.json();
        setCourse(data);
        if (data.lessons && data.lessons.length > 0) {
          setSelectedLesson(data.lessons[0]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId, isLoggedIn, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader className="w-12 h-12 mx-auto animate-spin text-emerald-600" />
      </div>
    );
  }
  
  // Kullanıcı giriş yapmamışsa kilitli ekranı göster
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6"><div className="flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-lg"><BookOpen className="w-8 h-8 text-white" /></div></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bu Derse Erişmek İçin Giriş Yapmalısınız</h2>
            <p className="text-gray-600 mb-6">Ders içeriklerini görüntülemek ve eğitiminize devam etmek için lütfen giriş yapın.</p>
            <Link to="/login" className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold mb-4 inline-block">Giriş Yap</Link>
            <p className="text-sm text-gray-500">Hesabınız yok mu? <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">Kayıt olun</Link></p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
          <p className="mt-4 text-lg text-red-700 font-semibold">{error}</p>
          <Link to="/courses" className="text-emerald-600 hover:underline mt-4 inline-block">Tüm derslere geri dön</Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Ders Bulunamadı</h1>
          <Link to="/courses" className="text-emerald-600 hover:underline mt-4 inline-block">Tüm derslere geri dön</Link>
        </div>
      </div>
    );
  }

  // Kullanıcı giriş yapmışsa ve ders varsa ders detayını göster
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="flex-1 bg-black flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          {selectedLesson ? (
            <iframe width="100%" height="100%" src={selectedLesson.videoUrl} title={selectedLesson.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
          ) : (
            <div className="text-white text-center"><Play className="w-16 h-16 mx-auto mb-4 opacity-50" /><p>Bir ders seçin</p></div>
          )}
        </div>
        {selectedLesson && (
          <div className="bg-gray-900 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
            <div className="flex items-center space-x-4 text-gray-300">
              <span>{course.instructor.name}</span><span>•</span><span>{selectedLesson.duration}</span>
            </div>
          </div>
        )}
      </div>
      <div className="w-full lg:w-96 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Ders İçeriği</h3>
            <Link to="/courses" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">← Derslere dön</Link>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span>{course.rating}</span></div>
              <div className="flex items-center space-x-1"><Users className="w-4 h-4" /><span>{course.students} öğrenci</span></div>
            </div>
          </div>
          <div className="space-y-2">
            {course.lessons.map((lesson, index) => (
              <div key={lesson.id} className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedLesson && selectedLesson.id === lesson.id ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'}`} onClick={() => setSelectedLesson(lesson)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${selectedLesson && selectedLesson.id === lesson.id ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{index + 1}</div>
                    <div><h4 className="font-medium text-gray-900 text-sm">{lesson.title}</h4><p className="text-xs text-gray-500">{lesson.duration}</p></div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${selectedLesson && selectedLesson.id === lesson.id ? 'text-emerald-600' : 'text-gray-400'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
