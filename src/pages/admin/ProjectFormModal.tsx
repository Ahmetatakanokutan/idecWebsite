import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { apiService } from '../../services/apiService';

// This interface should match the Project DTO from the backend
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  leader: string;
  sectors: string[];
  partners: string[];
  objectives: string[];
  outcomes: string[];
}

interface ProjectFormModalProps {
  project: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ project, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    leader: '',
    sectors: '', // Use comma-separated string for simplicity in form
    partners: '',
    objectives: '',
    outcomes: '',
  });
  const [error, setError] = useState<string | null>(null);

  const isEditing = project !== null;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image,
        leader: project.leader,
        sectors: project.sectors.join(', '),
        partners: project.partners.join(', '),
        objectives: project.objectives.join(', '),
        outcomes: project.outcomes.join(', '),
      });
    } else {
        setFormData({
            title: '',
            description: '',
            image: '',
            leader: '',
            sectors: '',
            partners: '',
            objectives: '',
            outcomes: '',
        });
    }
  }, [project, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
        ...formData,
        sectors: formData.sectors.split(',').map(s => s.trim()),
        partners: formData.partners.split(',').map(s => s.trim()),
        objectives: formData.objectives.split(',').map(s => s.trim()),
        outcomes: formData.outcomes.split(',').map(s => s.trim()),
    };

    try {
      if (isEditing) {
        await apiService.put(`/projects/${project.id}`, { id: project.id, ...payload });
      } else {
        await apiService.post('/projects', payload);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {isEditing ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {/* Form fields */}
                  <input name="title" value={formData.title} onChange={handleChange} placeholder="Başlık" className="w-full border-gray-300 rounded-md" required />
                  <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Açıklama" className="w-full border-gray-300 rounded-md" required />
                  <input name="image" value={formData.image} onChange={handleChange} placeholder="Resim URL" className="w-full border-gray-300 rounded-md" />
                  <input name="leader" value={formData.leader} onChange={handleChange} placeholder="Proje Yürütücüsü" className="w-full border-gray-300 rounded-md" />
                  <input name="sectors" value={formData.sectors} onChange={handleChange} placeholder="Sektörler (virgülle ayırın)" className="w-full border-gray-300 rounded-md" />
                  <input name="partners" value={formData.partners} onChange={handleChange} placeholder="Partnerler (virgülle ayırın)" className="w-full border-gray-300 rounded-md" />
                  <input name="objectives" value={formData.objectives} onChange={handleChange} placeholder="Hedefler (virgülle ayırın)" className="w-full border-gray-300 rounded-md" />
                  <input name="outcomes" value={formData.outcomes} onChange={handleChange} placeholder="Çıktılar (virgülle ayırın)" className="w-full border-gray-300 rounded-md" />

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
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProjectFormModal;
