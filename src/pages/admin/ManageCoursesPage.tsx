import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, BookOpen, Loader, AlertTriangle, Search } from 'lucide-react';
import { apiService } from '../../services/apiService';
import CourseFormModal from './CourseFormModal';

// Matches the CourseSummaryDto from the backend
interface CourseSummary {
  id: number;
  title: string;
  description: string; // Add description to be able to edit it
  instructorName: string;
  rating: number;
  students: number;
}

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseSummary | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await apiService.get('/courses');
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Kurslar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu kursu silmek istediğinizden emin misiniz? Bu işlem kursa ait tüm dersleri de silecektir.')) {
      try {
        await apiService.delete(`/courses/${id}`);
        fetchCourses(); // Refresh list
      } catch (err: any) {
        setError(err.message || 'Kurs silinirken bir hata oluştu.');
      }
    }
  };
  
  const openModalForCreate = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const openModalForUpdate = (course: CourseSummary) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    fetchCourses(); // Refresh data
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader className="animate-spin h-8 w-8 text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Hata: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Kursları Yönet</h2>
        
        <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Kurs veya Eğitmen ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button
            onClick={openModalForCreate}
            className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap"
            >
            <Plus className="h-5 w-5 mr-2" />
            Yeni Kurs Ekle
            </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kurs Başlığı
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Eğitmen
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Eylemler</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCourses.map((course) => (
              <tr key={course.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{course.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{course.instructorName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                   <Link to={`/admin/courses/${course.id}/lessons`} className="text-green-600 hover:text-green-900 inline-flex items-center" title="Dersleri Yönet">
                     <BookOpen className="h-5 w-5" />
                   </Link>
                  <button onClick={() => openModalForUpdate(course)} className="text-indigo-600 hover:text-indigo-900" title="Düzenle">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-900" title="Sil">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
                <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                        Aradığınız kriterlere uygun kurs bulunamadı.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && <CourseFormModal course={selectedCourse} onClose={handleModalClose} onSuccess={handleFormSuccess} />}
    </div>
  );
};

export default ManageCoursesPage;