import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader, AlertTriangle, ArrowLeft } from 'lucide-react';
import { apiService } from '../../services/apiService';
import LessonFormModal from './LessonFormModal';

// Interfaces based on backend DTOs
interface LessonDto {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
}

interface CourseDetailDto {
  id: number;
  title: string;
  lessons: LessonDto[];
}

const ManageCourseLessonsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonDto | null>(null);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const data = await apiService.get(`/courses/${courseId}`);
      setCourse(data);
    } catch (err: any) {
      setError(err.message || `Kurs detayları yüklenirken bir hata oluştu.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const handleDelete = async (lessonId: number) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      try {
        await apiService.delete(`/courses/${courseId}/lessons/${lessonId}`);
        fetchCourseDetails(); // Refresh list
      } catch (err: any) {
        setError(err.message || 'Ders silinirken bir hata oluştu.');
      }
    }
  };

  const openModalForCreate = () => {
    setSelectedLesson(null);
    setIsModalOpen(true);
  };

  const openModalForUpdate = (lesson: LessonDto) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    fetchCourseDetails();
  };

  if (loading) {
    return <div className="flex justify-center py-10"><Loader className="animate-spin h-8 w-8 text-emerald-600" /></div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>;
  }

  if (!course) {
    return <div className="text-center py-10">Kurs bulunamadı.</div>;
  }

  return (
    <div>
      <Link to="/admin/courses" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Tüm Kurslara Geri Dön
      </Link>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold truncate">
          <span className="text-gray-500">Kurs: </span>{course.title}
        </h2>
        <button
          onClick={openModalForCreate}
          className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Ders Ekle
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ders Başlığı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Süre</th>
              <th className="relative px-6 py-3"><span className="sr-only">Eylemler</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {course.lessons && course.lessons.length > 0 ? (
              course.lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lesson.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lesson.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => openModalForUpdate(lesson)} className="text-indigo-600 hover:text-indigo-900">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(lesson.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Bu kurs için henüz ders eklenmemiş.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && courseId && <LessonFormModal lesson={selectedLesson} courseId={courseId} onClose={handleModalClose} onSuccess={handleFormSuccess} />}
    </div>
  );
};

export default ManageCourseLessonsPage;

