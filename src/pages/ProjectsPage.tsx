import { Link } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiService } from '../services/apiService';
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();

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

  const getLocalizedContent = (project: Project) => {
    if (i18n.language === 'en') {
      // Try to find translation by project title match
      // In a real app, we would use ID or a specific key
      const translated = t(`projects.items.${project.title}`, { returnObjects: true }) as any;
      
      // If translation exists and is an object (not just the key string returned by fallback)
      if (translated && translated.title) {
        return {
          title: translated.title,
          description: translated.description
        };
      }
    }
    return {
      title: project.title,
      description: project.description
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-emerald-600" />
          <p className="mt-4 text-lg text-gray-600">{t('projects.loading')}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 bg-red-50 p-8 rounded-lg">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <p className="mt-4 text-lg text-red-700 font-semibold">{error}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project) => {
          const localized = getLocalizedContent(project);
          return (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
                <img src={project.image} alt={localized.title} className="w-full h-48 object-cover" />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{localized.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{localized.description}</p>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">{t('projects.sectors')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.sectors.map((sector, index) => (
                        <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p><strong>{t('projects.leader')}</strong> {project.leader}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('projects.title')}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </div>
        {renderContent()}
      </div>
    </Layout>
  );
};

export default ProjectsPage;
