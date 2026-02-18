import React, { useState, useEffect } from 'react';
import { Trash2, Search, Mail, Phone, Edit, Loader } from 'lucide-react';
import { apiService } from '../../services/apiService';
import UserFormModal from './UserFormModal';

interface User {
  id: number;
  username: string;
  fullName: string;
  phone: string;
  roles: string[];
  isEmailVerified: boolean;
}

const ManageUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.get('/users');
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Kullanıcılar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        await apiService.delete(`/users/${id}`);
        fetchUsers();
      } catch (err: any) {
        alert('Kullanıcı silinirken hata oluştu: ' + err.message);
      }
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    fetchUsers();
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-10"><Loader className="animate-spin h-8 w-8 text-emerald-600" /></div>;
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Kullanıcıları Yönet</h2>
        
        <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="İsim veya E-posta ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roller</th>
              <th className="relative px-6 py-3"><span className="sr-only">Eylemler</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg">
                        {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400"/> 
                    {user.username}
                    {user.isEmailVerified ? 
                        <span title="Doğrulanmış E-posta" className="ml-2 text-green-600">✓</span> : 
                        <span title="Doğrulanmamış E-posta" className="ml-2 text-red-500 text-xs">(Onaysız)</span>
                    }
                  </div>
                  <div className="text-sm text-gray-500 flex items-center mt-1"><Phone className="w-4 h-4 mr-2 text-gray-400"/> {user.phone || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role, idx) => (
                        <span key={idx} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                            {role.replace('ROLE_', '')}
                        </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => openEditModal(user)} className="text-indigo-600 hover:text-indigo-900 transition-colors" title="Düzenle">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 transition-colors" title="Sil">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                        Kullanıcı bulunamadı.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && <UserFormModal user={selectedUser} onClose={handleModalClose} onSuccess={handleFormSuccess} />}
    </div>
  );
};

export default ManageUsersPage;
