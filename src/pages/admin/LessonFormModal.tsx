import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { apiService } from '../../services/apiService';

interface LessonDto {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
}

interface LessonFormModalProps {
  lesson: LessonDto | null;
  sectionId: number; // Changed from courseId to sectionId
  onClose: () => void;
  onSuccess: () => void;
}

const LessonFormModal: React.FC<LessonFormModalProps> = ({ lesson, sectionId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    videoUrl: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isEditing = lesson !== null;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: lesson.title,
        duration: lesson.duration,
        videoUrl: lesson.videoUrl,
      });
    } else {
        setFormData({
            title: '',
            duration: '',
            videoUrl: '',
        });
    }
  }, [lesson, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setIsUploading(true);
        try {
            const url = await apiService.uploadFile(file);
            setFormData(prev => ({ ...prev, videoUrl: url }));
        } catch (err) {
            setError("Dosya yüklenemedi.");
        } finally {
            setIsUploading(false);
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing) {
        // Update endpoint: /api/courses/lessons/{lessonId}
        await apiService.put(`/courses/lessons/${lesson.id}`, { id: lesson.id, ...formData });
      } else {
        // Create endpoint: /api/courses/sections/{sectionId}/lessons
        await apiService.post(`/courses/sections/${sectionId}/lessons`, formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
                {isEditing ? 'Dersi Düzenle' : 'Yeni Ders Ekle'}
              </Dialog.Title>
              <div className="mt-2">
                  <p className="text-sm text-gray-500">
                      Dersin içeriğini ve videosunu aşağıdan düzenleyebilirsiniz.
                  </p>
              </div>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ders Başlığı</label>
                      <input name="title" value={formData.title} onChange={handleChange} placeholder="Örn: Giriş Dersi" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Süre</label>
                      <input name="duration" value={formData.duration} onChange={handleChange} placeholder="Örn: 15 dk" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                  
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video Kaynağı</label>
                      <div className="flex gap-2 mb-2">
                          <input 
                              type="file" 
                              accept="video/*"
                              onChange={handleFileChange}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                              disabled={isUploading}
                          />
                          {isUploading && <span className="text-sm text-gray-500 self-center">Yükleniyor...</span>}
                      </div>
                      <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="veya YouTube Embed URL (https://www.youtube.com/embed/...)" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required />
                      <p className="text-xs text-gray-500 mt-1">Kendi videonuzu yükleyebilir veya YouTube embed linki kullanabilirsiniz.</p>
                  </div>                    
                  
                  {error && <div className="bg-red-50 text-red-600 text-sm p-2 rounded">{error}</div>}

                  <div className="mt-6 flex justify-end space-x-3">
                  <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      İptal
                  </button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 shadow-sm">
                      {isEditing ? 'Değişiklikleri Kaydet' : 'Dersi Ekle'}
                  </button>
                  </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LessonFormModal;
