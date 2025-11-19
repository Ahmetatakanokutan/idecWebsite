import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader, AlertTriangle } from 'lucide-react';
import { apiService } from '../../services/apiService'; // Assuming a shared service exists

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

const ManageProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for managing the modal and the currently selected project
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiService.get('/projects');
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Projeler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      try {
        await apiService.delete(`/projects/${id}`);
        // Refresh the list after deletion
        fetchProjects();
      } catch (err: any) {
        setError(err.message || 'Proje silinirken bir hata oluştu.');
      }
    }
  };

  const openModalForCreate = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const openModalForUpdate = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    fetchProjects(); // Refresh data
  };


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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projeleri Yönet</h2>
        <button
          onClick={openModalForCreate}
          className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Proje Ekle
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proje Başlığı
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proje Yürütücüsü
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Eylemler</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{project.leader}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => openModalForUpdate(project)} className="text-indigo-600 hover:text-indigo-900">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
import ProjectFormModal from './ProjectFormModal'; // Import the modal component

// ... (rest of the component)

      {/* The Modal for Add/Edit will be rendered here */}
      {isModalOpen && <ProjectFormModal project={selectedProject} onClose={handleModalClose} onSuccess={handleFormSuccess} />}
    </div>
  );
};

export default ManageProjectsPage;
