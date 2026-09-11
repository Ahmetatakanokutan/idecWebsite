import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, User, Phone, Mail, Shield, Save, Loader, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { apiService, progressService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface UserProfile {
  id: number;
  username: string;
  fullName: string;
  phone: string;
  roles: string[];
}

interface ProgressSummary {
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
  certificateEligible: boolean;
}

const ProfilePage = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressSummary, setProgressSummary] = useState<ProgressSummary | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await apiService.get('/users/me');
        setProfile(data);
        setFullName(data.fullName);
        setPhone(data.phone || '');
        progressService.getSummary()
          .then(setProgressSummary)
          .catch(() => {});
      } catch (err: any) {
        setError(err.message || t('profile_page.error_loading'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [t]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedProfile = await apiService.put('/users/me', {
        fullName,
        phone,
      });
      setProfile(updatedProfile);
      setSuccessMessage(t('profile_page.update_success'));
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || t('profile_page.error_updating'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader className="animate-spin h-10 w-10 text-accent-deep" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="text-center py-20 text-red-600">{t('profile_page.not_found')}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="font-archivo bg-paper">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
          {/* Header Background */}
          <div className="bg-ink-gradient h-32" />
          
          <div className="px-8 pb-8">
            {/* Avatar & Basic Info */}
            <div className="relative flex items-end -mt-12 mb-6">
              <div className="h-24 w-24 bg-white rounded-full p-1 shadow-md">
                <div className="h-full w-full bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-500">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-4 mb-1">
                <h1 className="text-2xl font-bold text-ink-deep">{profile.fullName}</h1>
                <p className="text-gray-500 text-sm flex items-center">
                  {profile.roles.map(r => r.replace('ROLE_', '')).join(', ')}
                </p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column: Read-only Info */}
              <div className="md:col-span-1 space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('profile_page.account_info')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700 text-sm">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate" title={profile.username}>{profile.username}</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <Shield className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{t('profile_page.id_label')} {profile.id}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                    <button onClick={logout} className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors">
                        {t('profile_page.logout')}
                    </button>
                </div>
              </div>

              {/* Right Column: Edit Form */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold text-ink-deep mb-4">{t('profile_page.edit_profile')}</h2>
                
                {successMessage && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {successMessage}
                    </div>
                )}
                
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-ink-deep">{t('profile_page.fullname_label')}</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        className="focus:ring-accent-bright focus:border-transparent block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-ink-deep">{t('profile_page.phone_label')}</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        className="focus:ring-accent-bright focus:border-transparent block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+90 555 ..."
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cta-gradient hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-deep disabled:opacity-50"
                    >
                      {saving ? t('profile_page.saving') : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            {t('profile_page.save_changes')}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {progressSummary && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mt-6">
            <h3 className="text-lg font-bold text-ink-deep mb-4">{t('profile_page.learning_progress')}</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">
                {t('profile_page.lessons_completed', {
                  completed: progressSummary.completedLessons,
                  total: progressSummary.totalLessons,
                })}
              </span>
              <span className="text-sm font-semibold text-accent-deep">
                %{progressSummary.completionPercentage.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-accent-bright/[0.07]0 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressSummary.completionPercentage, 100)}%` }}
              />
            </div>
            {progressSummary.certificateEligible && (
              <div className="mt-4">
                <div className="p-3 bg-accent-bright/[0.07] border border-accent-bright/30 rounded-lg text-sm text-accent-deep font-medium text-center">
                  {t('profile_page.certificate_eligible')}
                </div>
                <div className="mt-4 flex justify-center">
                  <Link
                    to="/certificate"
                    className="flex items-center space-x-2 bg-cta-gradient hover:brightness-105 text-white font-bold shadow-md shadow-accent-bright/25 py-2 px-5 rounded-lg transition-colors text-sm"
                  >
                    <Award className="w-4 h-4" />
                    <span>{t('profile_page.get_certificate')}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
