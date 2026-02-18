import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { apiService } from '../../services/apiService';

interface Instructor {
  id: number;
  name: string;
  title: string;
}

interface InstructorFormModalProps {
  instructor: Instructor | null;
  onClose: () => void;
  onSuccess: () => void;
}

const InstructorFormModal: React.FC<InstructorFormModalProps> = ({ instructor, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', title: '' });
  const [error, setError] = useState<string | null>(null);

  const isEditing = instructor !== null;

  useEffect(() => {
    if (isEditing) {
      setFormData({ name: instructor.name, title: instructor.title });
    } else {
      setFormData({ name: '', title: '' });
    }
  }, [instructor, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing) {
        await apiService.put(`/instructors/${instructor.id}`, { id: instructor.id, ...formData });
      } else {
        await apiService.post('/instructors', formData);
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
                {isEditing ? 'Eğitmeni Düzenle' : 'Yeni Eğitmen Ekle'}
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="İsim" className="w-full border-gray-300 rounded-md" required />
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Unvan" className="w-full border-gray-300 rounded-md" required />
                
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

export default InstructorFormModal;
