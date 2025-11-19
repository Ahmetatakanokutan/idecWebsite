import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Target, Globe, Loader, AlertTriangle } from 'lucide-react';

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

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error('Proje detayı yüklenemedi.');
        }
        const data = await response.json();
        setProject(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <Loader className="w-12 h-12 mx-auto animate-spin text-emerald-600" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-20 bg-red-50 p-8 rounded-lg">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
          <p className="mt-4 text-lg text-red-700 font-semibold">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Proje Bulunamadı</h1>
          <Link to="/projects" className="text-emerald-600 hover:underline mt-4 inline-block">
            Tüm projelere geri dön
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link to="/projects" className="text-emerald-600 hover:text-emerald-700 font-medium mb-4">
            ← Projelere dön
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-64 object-cover" />
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{project.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Proje Hedefleri</h3>
                <ul className="space-y-2">
                  {project.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Target className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Beklenen Çıktılar</h3>
                <ul className="space-y-2">
                  {project.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Globe className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hedef Sektörler</h3>
              <div className="flex flex-wrap gap-3">
                {project.sectors.map((sector, index) => (
                  <span key={index} className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg font-medium">
                    {sector}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Proje Paydaşları</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-2"><strong>Proje Yürütücüsü:</strong> {project.leader}</p>
                <p className="text-gray-700"><strong>Proje Paydaşları:</strong></p>
                <ul className="mt-2 space-y-1">
                  {project.partners.map((partner, index) => (
                    <li key={index} className="text-gray-600 ml-4">• {partner}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetailPage;
