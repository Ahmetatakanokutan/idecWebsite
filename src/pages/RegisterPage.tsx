import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Building } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('individual'); // 'individual' or 'corporate'
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Corporate-specific state
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [sector, setSector] = useState('');

  // Individual-specific state
  const [profession, setProfession] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Sadece sayısal karakterleri tut
    let numericValue = value.replace(/\D/g, '');
    
    // Başındaki 0'ları temizle
    while (numericValue.startsWith('0')) {
        numericValue = numericValue.substring(1);
    }
    
    // Maksimum 10 karakter
    if (numericValue.length > 10) {
        numericValue = numericValue.substring(0, 10);
    }
    
    setPhone(numericValue);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const isValidEmail = (email: string) => {
    // Regex: chars + @ + chars + . + 2-6 letter extension
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isValidEmail(email)) {
      setError(t('register_page.invalid_email'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('register_page.password_mismatch'));
      return;
    }

    const requestBody: any = {
      username: email,
      password: password,
      confirmPassword: confirmPassword, // Eklendi
      fullName: fullName,
      phone: phone,
      userType: userType, // 'roles' yerine 'userType' gönderilir
      profession: userType === 'individual' ? profession : null,
      companyName: userType === 'corporate' ? companyName : null,
      taxId: userType === 'corporate' ? taxId : null,
      sector: userType === 'corporate' ? sector : null,
    };
    
    try {
      const response = await apiService.post('/auth/register', requestBody);
      setSuccess(response?.message || t('register_page.success_default'));
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error: any) {
      setError(error.message);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {t('register_page.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('register_page.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setUserType('individual')}
            className={`flex items-center justify-center p-4 border rounded-lg transition-colors ${
              userType === 'individual'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg'
                : 'bg-white text-gray-700 hover:bg-emerald-50'
            }`}
          >
            <User className="w-5 h-5 mr-2" />
            <span className="font-semibold">{t('register_page.user_type_individual')}</span>
          </button>
          <button
            onClick={() => setUserType('corporate')}
            className={`flex items-center justify-center p-4 border rounded-lg transition-colors ${
              userType === 'corporate'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg'
                : 'bg-white text-gray-700 hover:bg-emerald-50'
            }`}
          >
            <Building className="w-5 h-5 mr-2" />
            <span className="font-semibold">{t('register_page.user_type_corporate')}</span>
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
            {t('register_page.email_verification_notice')}
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">{t('register_page.error_prefix')} </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">{t('register_page.success_prefix')} </strong>
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">{t('register_page.fullname_label')}</label>
              <input id="fullname" name="fullname" type="text" required
                value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={t('register_page.fullname_placeholder')} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('register_page.email_label')}</label>
              <input id="email" name="email" type="email" required
                value={email} onChange={handleEmailChange}
                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 border-gray-300"
                placeholder={t('register_page.email_placeholder')} />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('register_page.phone_label')}</label>
              <input id="phone" name="phone" type="tel"
                value={phone} onChange={handlePhoneChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={t('register_page.phone_placeholder')} />
            </div>

            {userType === 'corporate' && (
              <>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">{t('register_page.company_name_label')}</label>
                  <input id="companyName" name="companyName" type="text" required={userType === 'corporate'}
                    value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={t('register_page.company_name_placeholder')} />
                </div>
                <div>
                  <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">{t('register_page.tax_id_label')}</label>
                  <input id="taxId" name="taxId" type="text" required={userType === 'corporate'}
                    value={taxId} onChange={(e) => setTaxId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={t('register_page.tax_id_placeholder')} />
                </div>
                <div>
                  <label htmlFor="sector" className="block text-sm font-medium text-gray-700">{t('register_page.sector_label')}</label>
                  <select id="sector" name="sector" required={userType === 'corporate'}
                    value={sector} onChange={(e) => setSector(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">{t('register_page.sector_placeholder')}</option>
                    <option value="demir-celik">{t('register_page.sector_demir_celik')}</option>
                    <option value="cimento">{t('register_page.sector_cimento')}</option>
                    <option value="aluminyum">{t('register_page.sector_aluminyum')}</option>
                    <option value="kimya">{t('register_page.sector_kimya')}</option>
                    <option value="diger">{t('register_page.sector_diger')}</option>
                  </select>
                </div>
              </>
            )}
            
            {userType === 'individual' && (
                <div>
                    <label htmlFor="profession" className="block text-sm font-medium text-gray-700">{t('register_page.profession_label')}</label>
                    <input id="profession" name="profession" type="text"
                        value={profession} onChange={(e) => setProfession(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder={t('register_page.profession_placeholder')}
                    />
                </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('register_page.password_label')}</label>
              <input id="password" name="password" type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••" />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">{t('register_page.confirm_password_label')}</label>
              <input id="confirm-password" name="confirm-password" type="password" required
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••" />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              {t('register_page.submit')}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t('register_page.already_have_account')}{' '}
              <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                {t('register_page.login_now')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
