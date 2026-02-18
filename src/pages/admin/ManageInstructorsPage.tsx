import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader } from 'lucide-react';
import { apiService } from '../../services/apiService';
import InstructorFormModal from './InstructorFormModal';

interface Instructor {
  id: number;
  name: string;
  title: string;
}

const ManageInstructorsPage = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const data = await apiService.get('/instructors');
      setInstructors(data);
    } catch (err: any) {
      setError(err.message || 'Eğitmenler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu eğitmeni silmek istediğinizden emin misiniz? Bu eğitmen bir kursa atanmışsa silme işlemi başarısız olabilir.')) {
      try {
        await apiService.delete(`/instructors/${id}`);
        fetchInstructors();
      } catch (err: any) {
        setError(err.message || 'Eğitmen silinirken bir hata oluştu.');
      }
    }
  };

  const openModalForCreate = () => {
    setSelectedInstructor(null);
    setIsModalOpen(true);
  };

  const openModalForUpdate = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedInstructor(null);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    fetchInstructors();
  };

  if (loading) {
    return <div className="flex justify-center py-10"><Loader className="animate-spin h-8 w-8 text-emerald-600" /></div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Eğitmenleri Yönet</h2>
        <button
          onClick={openModalForCreate}
          className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Eğitmen Ekle
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İsim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unvan</th>
              <th className="relative px-6 py-3"><span className="sr-only">Eylemler</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {instructors.map((instructor) => (
              <tr key={instructor.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{instructor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => openModalForUpdate(instructor)} className="text-indigo-600 hover:text-indigo-900">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(instructor.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <InstructorFormModal instructor={selectedInstructor} onClose={handleModalClose} onSuccess={handleFormSuccess} />}
    </div>
  );
};

export default ManageInstructorsPage;
