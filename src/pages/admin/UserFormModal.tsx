import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { apiService } from '../../services/apiService';

interface User {
  id: number;
  username: string;
  fullName: string;
  phone: string;
  roles: string[];
  isEmailVerified: boolean;
}

interface UserFormModalProps {
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ user, onClose, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhone(user.phone || '');
      setEmail(user.username);
      setIsEmailVerified(user.isEmailVerified);
      setRoles(user.roles || []);
      setPassword(''); // Reset password field
    } else {
      setFullName('');
      setPhone('');
      setEmail('');
      setIsEmailVerified(false);
      setRoles(['ROLE_USER']);
      setPassword('');
    }
  }, [user]);

  const handleRoleChange = (role: string) => {
      if (roles.includes(role)) {
          setRoles(roles.filter(r => r !== role));
      } else {
          setRoles([...roles, role]);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: any = { fullName, phone, email, isEmailVerified, roles };
    if (password) {
        payload.password = password;
    }

    try {
      if (user) {
        await apiService.put(`/users/${user.id}`, payload);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
                Kullanıcıyı Düzenle (Admin)
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Boş bırakırsanız değişmez)</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" placeholder="********" />
                </div>

                <div className="flex items-center space-x-2">
                    <input 
                        type="checkbox" 
                        id="verified" 
                        checked={isEmailVerified} 
                        onChange={(e) => setIsEmailVerified(e.target.checked)} 
                        className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="verified" className="text-sm font-medium text-gray-700">E-posta Doğrulanmış</label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Roller</label>
                    <div className="space-y-2">
                        {['ROLE_USER', 'ROLE_COMPANY', 'ROLE_ADMIN'].map(role => (
                            <div key={role} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={role}
                                    checked={roles.includes(role)}
                                    onChange={() => handleRoleChange(role)}
                                    className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                                />
                                <label htmlFor={role} className="ml-2 text-sm text-gray-700">{role}</label>
                            </div>
                        ))}
                    </div>
                </div>
                
                {error && <div className="bg-red-50 text-red-600 text-sm p-2 rounded">{error}</div>}

                <div className="mt-6 flex justify-end space-x-3">
                  <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    İptal
                  </button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 shadow-sm">
                    Kaydet
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserFormModal;