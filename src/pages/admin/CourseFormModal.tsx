import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { apiService } from '../../services/apiService';

interface Instructor {
    id: number;
    name: string;
}

// DTO for creating/updating a course
interface CourseFormDto {
  title: string;
  description: string;
  image: string;
  instructorId: string; // Form uses string for select, converted to number for API
}

interface CourseFormModalProps {
  course: any; // Can be null or existing course object
  onClose: () => void;
  onSuccess: () => void;
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({ course, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CourseFormDto>({
    title: '',
    description: '',
    image: '',
    instructorId: '',
  });
  
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const isEditing = course !== null;

  // Fetch instructors for the dropdown
  useEffect(() => {
    const fetchInstructors = async () => {
        try {
            setLoadingInstructors(true);
            const data = await apiService.get('/instructors');
            setInstructors(data);
        } catch (err) {
            console.error("Failed to load instructors", err);
            setError("Eğitmen listesi yüklenemedi.");
        } finally {
            setLoadingInstructors(false);
        }
    };
    fetchInstructors();
  }, []);

  // Populate form if editing
  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: course.title,
        description: course.description,
        image: course.image || '',
        instructorId: course.instructor ? course.instructor.id.toString() : (course.instructorId ? course.instructorId.toString() : ''), 
      });
    } else {
        setFormData({
            title: '',
            description: '',
            image: '',
            instructorId: '',
        });
    }
  }, [course, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setIsUploading(true);
        try {
            const url = await apiService.uploadFile(file);
            setFormData(prev => ({ ...prev, image: url }));
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

    if (!formData.instructorId) {
        setError("Lütfen bir eğitmen seçiniz.");
        return;
    }

    const payload = {
        ...formData,
        instructorId: parseInt(formData.instructorId),
    };

    try {
      if (isEditing) {
        await apiService.put(`/courses/${course.id}`, payload);
      } else {
        await apiService.post('/courses', payload);
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
                {isEditing ? 'Kursu Düzenle' : 'Yeni Kurs Ekle'}
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kurs Başlığı</label>
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Örn: Sürdürülebilirlik 101" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Kurs içeriği hakkında kısa bilgi..." className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Resmi</label>
                    <div className="flex gap-2 mb-2">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            disabled={isUploading}
                        />
                        {isUploading && <span className="text-sm text-gray-500 self-center">Yükleniyor...</span>}
                    </div>
                    <input name="image" value={formData.image} onChange={handleChange} placeholder="veya Resim URL'si yapıştırın" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eğitmen</label>
                    <select 
                        name="instructorId" 
                        value={formData.instructorId} 
                        onChange={handleChange} 
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                        required
                        disabled={loadingInstructors}
                    >
                        <option value="">Eğitmen Seçiniz...</option>
                        {instructors.map(inst => (
                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                        ))}
                    </select>
                </div>
                
                {error && <div className="bg-red-50 text-red-600 text-sm p-2 rounded">{error}</div>}

                <div className="mt-6 flex justify-end space-x-3">
                  <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    İptal
                  </button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 shadow-sm">
                    {isEditing ? 'Değişiklikleri Kaydet' : 'Kurs Oluştur'}
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
