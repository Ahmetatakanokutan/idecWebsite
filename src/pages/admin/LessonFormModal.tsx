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
  courseId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const LessonFormModal: React.FC<LessonFormModalProps> = ({ lesson, courseId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    videoUrl: '',
  });
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing) {
        await apiService.put(`/courses/${courseId}/lessons/${lesson.id}`, { id: lesson.id, ...formData });
      } else {
        await apiService.post(`/courses/${courseId}/lessons`, formData);
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
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                {isEditing ? 'Dersi Düzenle' : 'Yeni Ders Ekle'}
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Ders Başlığı" className="w-full border-gray-300 rounded-md" required />
                <input name="duration" value={formData.duration} onChange={handleChange} placeholder="Süre (örn: 15 dk)" className="w-full border-gray-300 rounded-md" />
                <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="Video URL (Embed)" className="w-full border-gray-300 rounded-md" required />
                
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="mt-6 flex justify-end space-x-2">
                  <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200">
                    İptal
                  </button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700">
                    {isEditing ? 'Güncelle' : 'Oluştur'}
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
