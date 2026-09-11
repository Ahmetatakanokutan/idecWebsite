import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, User, X } from 'lucide-react';
import { apiService } from '../services/apiService';
import AuthShell, {
  authButtonClass,
  authInputClass,
  authLinkClass,
} from '../components/AuthShell';
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

  const [consentChecked, setConsentChecked] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
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

    if (!consentChecked) {
      setError(t('register_page.consent_required_error'));
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
    <AuthShell title={t('register_page.title')} subtitle={t('register_page.subtitle')} wide>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setUserType('individual')}
            className={`flex items-center justify-center p-4 border rounded-lg transition-colors ${
              userType === 'individual'
                ? 'bg-accent-gradient text-white border-transparent shadow-md shadow-accent-bright/25'
                : 'bg-white text-gray-700 border-gray-300 hover:border-accent-bright/50 hover:bg-accent-bright/[0.06]'
            }`}
          >
            <User className="w-5 h-5 mr-2" />
            <span className="font-semibold">{t('register_page.user_type_individual')}</span>
          </button>
          <button
            onClick={() => setUserType('corporate')}
            className={`flex items-center justify-center p-4 border rounded-lg transition-colors ${
              userType === 'corporate'
                ? 'bg-accent-gradient text-white border-transparent shadow-md shadow-accent-bright/25'
                : 'bg-white text-gray-700 border-gray-300 hover:border-accent-bright/50 hover:bg-accent-bright/[0.06]'
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
              <label htmlFor="fullname" className="block text-sm font-semibold text-ink-deep mb-1.5">{t('register_page.fullname_label')}</label>
              <input id="fullname" name="fullname" type="text" required
                value={fullName} onChange={(e) => setFullName(e.target.value)}
                className={authInputClass}
                placeholder={t('register_page.fullname_placeholder')} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-ink-deep mb-1.5">{t('register_page.email_label')}</label>
              <input id="email" name="email" type="email" required
                value={email} onChange={handleEmailChange}
                className={authInputClass}
                placeholder={t('register_page.email_placeholder')} />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-ink-deep mb-1.5">{t('register_page.phone_label')}</label>
              <input id="phone" name="phone" type="tel"
                value={phone} onChange={handlePhoneChange}
                className={authInputClass}
                placeholder={t('register_page.phone_placeholder')} />
            </div>

            {userType === 'corporate' && (
              <>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-semibold text-ink-deep mb-1.5">{t('register_page.company_name_label')}</label>
                  <input id="companyName" name="companyName" type="text" required={userType === 'corporate'}
                    value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    className={authInputClass}
                    placeholder={t('register_page.company_name_placeholder')} />
                </div>
                <div>
                  <label htmlFor="taxId" className="block text-sm font-semibold text-ink-deep mb-1.5">{t('register_page.tax_id_label')}</label>
                  <input id="taxId" name="taxId" type="text" required={userType === 'corporate'}
                    value={taxId} onChange={(e) => setTaxId(e.target.value)}
                    className={authInputClass}
                    placeholder={t('register_page.tax_id_placeholder')} />
                </div>
                <div>
                  <label htmlFor="sector" className="block text-sm font-semibold text-ink-deep mb-1.5">{t('register_page.sector_label')}</label>
                  <select id="sector" name="sector" required={userType === 'corporate'}
                    value={sector} onChange={(e) => setSector(e.target.value)}
                    className={authInputClass}
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
                    <label htmlFor="profession" className="block text-sm font-semibold text-ink-deep mb-1.5">{t('register_page.profession_label')}</label>
                    <input id="profession" name="profession" type="text"
                        value={profession} onChange={(e) => setProfession(e.target.value)}
                        className={authInputClass}
                        placeholder={t('register_page.profession_placeholder')}
                    />
                </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-ink-deep mb-1.5">{t('register_page.password_label')}</label>
              <input id="password" name="password" type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className={authInputClass}
                placeholder="••••••••" />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-semibold text-ink-deep mb-1.5">{t('register_page.confirm_password_label')}</label>
              <input id="confirm-password" name="confirm-password" type="password" required
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className={authInputClass}
                placeholder="••••••••" />
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-1 h-4 w-4 text-accent-deep border-gray-300 rounded focus:ring-accent-bright cursor-pointer flex-shrink-0"
            />
            <label htmlFor="consent" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
              {t('register_page.consent_checkbox_text')}
              <button
                type="button"
                onClick={() => setShowConsentModal(true)}
                className="text-accent-deep hover:text-ink-deep font-bold underline underline-offset-2 focus:outline-none"
              >
                {t('register_page.consent_link_text')}
              </button>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className={authButtonClass}
            >
              {t('register_page.submit')}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            {t('register_page.already_have_account')}{' '}
            <Link to="/login" className={authLinkClass}>
              {t('register_page.login_now')}
            </Link>
          </p>
        </form>
      </div>
      {showConsentModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowConsentModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col font-archivo"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-ink-deep">{t('register_page.consent_modal_title')}</h3>
              <button
                type="button"
                onClick={() => setShowConsentModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={t('register_page.consent_modal_close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {t('register_page.consent_modal_body')}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setConsentChecked(true);
                  setShowConsentModal(false);
                }}
                className="px-6 py-2.5 bg-accent-gradient text-white rounded-lg hover:brightness-110 font-bold transition-all text-sm shadow-md shadow-accent-bright/25"
              >
                {t('register_page.consent_modal_close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthShell>
  );
};

export default RegisterPage;
