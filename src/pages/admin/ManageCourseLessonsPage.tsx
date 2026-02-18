import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader, ArrowLeft, ChevronDown, ChevronUp, Video, FileText, PlayCircle } from 'lucide-react';
import { apiService } from '../../services/apiService';
import LessonFormModal from './LessonFormModal';

// Interfaces based on NEW backend DTOs
interface LessonDto {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
}

interface SectionDto {
  id: number;
  title: string;
  lessons: LessonDto[];
}

interface CourseDetailDto {
  id: number;
  title: string;
  sections: SectionDto[];
}

const ManageCourseLessonsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for Section Editing
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);

  // State for Lesson Modal
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonDto | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null); // Which section are we adding a lesson to?

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

  // --- Section Handlers ---

  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return;
    try {
      await apiService.post(`/courses/${courseId}/sections`, { title: newSectionTitle });
      setNewSectionTitle('');
      setIsAddingSection(false);
      fetchCourseDetails();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateSection = async (sectionId: number, title: string) => {
    try {
      await apiService.put(`/courses/sections/${sectionId}`, { title });
      setEditingSectionId(null);
      fetchCourseDetails();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    if (window.confirm('Bu bölümü ve içindeki TÜM dersleri silmek istediğinizden emin misiniz?')) {
      try {
        await apiService.delete(`/courses/sections/${sectionId}`);
        fetchCourseDetails();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // --- Lesson Handlers ---

  const openAddLessonModal = (sectionId: number) => {
    setActiveSectionId(sectionId);
    setSelectedLesson(null);
    setIsLessonModalOpen(true);
  };

  const openEditLessonModal = (sectionId: number, lesson: LessonDto) => {
    setActiveSectionId(sectionId);
    setSelectedLesson(lesson);
    setIsLessonModalOpen(true);
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      try {
        await apiService.delete(`/courses/lessons/${lessonId}`);
        fetchCourseDetails();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleLessonModalSuccess = () => {
    setIsLessonModalOpen(false);
    fetchCourseDetails();
  };


  if (loading) return <div className="flex justify-center py-10"><Loader className="animate-spin h-8 w-8 text-emerald-600" /></div>;
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>;
  if (!course) return <div className="text-center py-10">Kurs bulunamadı.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link to="/admin/courses" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kurslara Dön
      </Link>
      
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-500 mt-1">Müfredat Yönetimi</p>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {course.sections && course.sections.map((section) => (
          <div key={section.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Section Header */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200 group">
              <div className="flex items-center flex-1">
                <h3 className="text-lg font-bold text-gray-800 mr-4">
                    {editingSectionId === section.id ? (
                        <input 
                            autoFocus
                            type="text" 
                            defaultValue={section.title}
                            onBlur={(e) => handleUpdateSection(section.id, e.target.value)}
                            onKeyDown={(e) => { if(e.key === 'Enter') handleUpdateSection(section.id, e.currentTarget.value) }}
                            className="border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                        />
                    ) : (
                        <span className="flex items-center">
                            {section.title}
                            <button onClick={() => setEditingSectionId(section.id)} className="ml-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Edit className="w-4 h-4" />
                            </button>
                        </span>
                    )}
                </h3>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                    onClick={() => openAddLessonModal(section.id)}
                    className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md transition-colors"
                >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Ders Ekle
                </button>
                <button onClick={() => handleDeleteSection(section.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lessons List inside Section */}
            <div className="divide-y divide-gray-100">
              {section.lessons && section.lessons.length > 0 ? (
                section.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 text-gray-400 text-sm font-medium">
                            {index + 1}.
                        </div>
                        <div className="ml-2">
                            <div className="flex items-center">
                                <PlayCircle className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-gray-700 font-medium">{lesson.title}</span>
                            </div>
                            <div className="flex items-center mt-1 ml-6 space-x-4 text-xs text-gray-500">
                                <span>{lesson.duration}</span>
                                {lesson.videoUrl && <span className="text-blue-500">Video Eklendi</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2"> 
                       <button onClick={() => openEditLessonModal(section.id, lesson)} className="p-1 text-gray-400 hover:text-indigo-600" title="Dersi Düzenle">
                         <Edit className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDeleteLesson(lesson.id)} className="p-1 text-gray-400 hover:text-red-600" title="Dersi Sil">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-400 text-sm italic bg-gray-50/50">
                    Bu bölümde henüz ders yok.
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add New Section Block */}
        {isAddingSection ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-2">Yeni Bölüm Başlığı</h3>
                <div className="flex gap-2">
                    <input 
                        autoFocus
                        type="text" 
                        value={newSectionTitle}
                        onChange={(e) => setNewSectionTitle(e.target.value)}
                        placeholder="Örn: Bölüm 2: İleri Teknikler"
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    />
                    <button onClick={handleAddSection} className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700">Ekle</button>
                    <button onClick={() => setIsAddingSection(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">İptal</button>
                </div>
            </div>
        ) : (
            <button 
                onClick={() => setIsAddingSection(true)}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center"
            >
                <Plus className="w-5 h-5 mr-2" />
                Yeni Bölüm Ekle
            </button>
        )}
      </div>

      {/* Lesson Modal */}
      {isLessonModalOpen && activeSectionId && (
          <LessonFormModal 
            lesson={selectedLesson} 
            // Note: We now pass sectionId, not courseId directly for creation
            sectionId={activeSectionId}
            onClose={() => setIsLessonModalOpen(false)} 
            onSuccess={handleLessonModalSuccess} 
          />
      )}
    </div>
  );
};

export default ManageCourseLessonsPage;