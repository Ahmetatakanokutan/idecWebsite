import { Link } from 'react-router-dom';
import { Leaf, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiService } from '../services/apiService';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  leader: string;
  sectors: string[];
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await apiService.get('/projects');
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <Loader className="w-12 h-12 mx-auto animate-spin text-emerald-600" />
          <p className="mt-4 text-lg text-gray-600">Projeler yükleniyor...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 bg-red-50 p-8 rounded-lg">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
          <p className="mt-4 text-lg text-red-700 font-semibold">{error}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{project.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Hedef Sektörler:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.sectors.map((sector, index) => (
                      <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <p><strong>Proje Yürütücüsü:</strong> {project.leader}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Projelerimiz</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            IDEC-TT kapsamında yürütülen endüstriyel dekarbonizasyon projeleri ve araştırma faaliyetleri
          </p>
        </div>
        {renderContent()}
      </div>
    </Layout>
  );
};

export default ProjectsPage;
