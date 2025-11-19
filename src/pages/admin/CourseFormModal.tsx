import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { apiService } from '../../services/apiService';

// This interface should match the Course DTO from the backend for editing
// We only need a subset of fields for the form.
interface Course {
  id: number;
  title: string;
  description: string;
  rating: number;
  students: number;
  // Instructor is handled separately, not including here for simplicity
}

interface CourseFormModalProps {
  course: Course | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({ course, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: 0,
    students: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const isEditing = course !== null;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: course.title,
        description: course.description,
        rating: course.rating,
        students: course.students,
      });
    } else {
        setFormData({
            title: '',
            description: '',
            rating: 0,
            students: 0,
        });
    }
  }, [course, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? parseFloat(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing) {
        // The backend expects the full Course object on update for now
        await apiService.put(`/courses/${course.id}`, { id: course.id, ...formData });
      } else {
        await apiService.post('/courses', formData);
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
                {isEditing ? 'Kursu Düzenle' : 'Yeni Kurs Ekle'}
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Başlık" className="w-full border-gray-300 rounded-md" required />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Açıklama" className="w-full border-gray-300 rounded-md" required />
                <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} placeholder="Puan" className="w-full border-gray-300 rounded-md" />
                <input type="number" name="students" value={formData.students} onChange={handleChange} placeholder="Öğrenci Sayısı" className="w-full border-gray-300 rounded-md" />
                
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

export default CourseFormModal;
