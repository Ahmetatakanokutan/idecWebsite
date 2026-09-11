import { useParams, Link } from 'react-router-dom';
import { Globe, Target, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import React from 'react';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { apiService, resolveAssetUrl } from '../services/apiService';
import { useTranslation } from 'react-i18next';

// ... interface definition ...
interface ProjectDetail {
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
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setLoading(true);
        const data = await apiService.get(`/projects/${projectId}`);
        setProject(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
        fetchProjectDetail();
    }
  }, [projectId]);

  const getLocalizedContent = (project: ProjectDetail) => {
    if (i18n.language === 'en') {
      // Try to find translation by project title match
      const translated = t(`projects.items.${project.title}`, { returnObjects: true }) as any;
      
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

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-accent-deep" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-20 bg-red-50 p-8 rounded-lg">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <p className="mt-4 text-lg text-red-700 font-semibold">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-ink-deep">{t('projects.not_found')}</h1>
          <Link to="/projects" className="text-accent-deep hover:text-ink-deep font-bold mt-4 inline-block">
            {t('projects.back_to_all')}
          </Link>
        </div>
      </Layout>
    );
  }

  const localized = getLocalizedContent(project);

  return (
    <Layout>
      <div className="font-archivo">
        <PageHero title={localized.title} description={localized.description} />

        <section className="bg-paper py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-accent-deep hover:text-ink-deep font-bold mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t('projects.back_to_projects')}
            </Link>

            <Reveal>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {project.image && (
                  <img
                    src={resolveAssetUrl(project.image)}
                    alt={localized.title}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                )}

                <div className="p-8 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <DetailHeading icon={<Target className="w-5 h-5" />} title={t('projects.objectives')} />
                      <ul className="space-y-3">
                        {project.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-700 leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent-bright flex-shrink-0" />
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <DetailHeading icon={<Globe className="w-5 h-5" />} title={t('projects.outcomes')} />
                      <ul className="space-y-3">
                        {project.outcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-700 leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-ink-mid flex-shrink-0" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-10 pt-10 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-ink-deep mb-4">{t('projects.target_sectors')}</h3>
                    <div className="flex flex-wrap gap-3">
                      {project.sectors.map((sector, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-accent-bright/10 border border-accent-bright/25 text-accent-deep rounded-full font-semibold text-sm"
                        >
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10">
                    <h3 className="text-lg font-bold text-ink-deep mb-4">{t('projects.stakeholders')}</h3>
                    <div className="bg-paper border border-gray-100 rounded-2xl p-6">
                      <p className="text-gray-700 mb-4">
                        <strong className="text-ink-deep">{t('projects.leader_label')}</strong> {project.leader}
                      </p>
                      <p className="text-ink-deep font-bold mb-2">{t('projects.partners_label')}</p>
                      <ul className="space-y-2">
                        {project.partners.map((partner, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-600">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                            {partner}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </Layout>
  );
};

/** Detay sayfasindaki alt baslik: kucuk vurgu ikonu + baslik. */
const DetailHeading = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center text-white flex-shrink-0">
      {icon}
    </span>
    <h3 className="text-lg font-bold text-ink-deep">{title}</h3>
  </div>
);

export default ProjectDetailPage;
