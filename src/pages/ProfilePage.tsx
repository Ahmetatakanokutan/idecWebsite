import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Shield, Save, Loader, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  id: number;
  username: string;
  fullName: string;
  phone: string;
  roles: string[];
}

const ProfilePage = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
        setError(err.message || 'Profil bilgileri yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
      setSuccessMessage('Profil bilgileriniz başarıyla güncellendi.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Güncelleme sırasında bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader className="animate-spin h-10 w-10 text-emerald-600" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="text-center py-20 text-red-600">Profil bulunamadı.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Header Background */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-32"></div>
          
          <div className="px-8 pb-8">
            {/* Avatar & Basic Info */}
            <div className="relative flex items-end -mt-12 mb-6">
              <div className="h-24 w-24 bg-white rounded-full p-1 shadow-md">
                <div className="h-full w-full bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-500">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-4 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
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
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Hesap Bilgileri</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700 text-sm">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate" title={profile.username}>{profile.username}</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <Shield className="w-4 h-4 mr-2 text-gray-400" />
                      <span>ID: {profile.id}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                    <button onClick={logout} className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors">
                        Hesaptan Çıkış Yap
                    </button>
                </div>
              </div>

              {/* Right Column: Edit Form */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Profili Düzenle</h2>
                
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
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefon Numarası</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
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
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                    >
                      {saving ? 'Kaydediliyor...' : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Değişiklikleri Kaydet
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
