import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Building } from 'lucide-react';
import { apiService } from '../services/apiService';
import useDebounce from '../hooks/useDebounce';

const RegisterPage = () => {
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
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const debouncedEmail = useDebounce(email, 500);

  useEffect(() => {
    if (debouncedEmail) {
      setIsCheckingEmail(true);
      apiService.get(`/auth/check-email?email=${debouncedEmail}`)
        .then((exists: boolean) => {
          setIsEmailTaken(exists);
          setIsCheckingEmail(false);
        })
        .catch(() => {
          setIsEmailTaken(false);
          setIsCheckingEmail(false);
        });
    } else {
      setIsEmailTaken(false);
    }
  }, [debouncedEmail]);

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
      setError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    if (isEmailTaken) {
      setError('Bu e-posta adresi zaten kullanımda.');
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
      await apiService.post('/auth/register', requestBody);
      
      setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

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
            Yeni Hesap Oluşturun
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            IDEC-TT platformuna katılın ve karbonsuzlaştırma yolculuğuna başlayın.
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
            <span className="font-semibold">Bireysel Üyelik</span>
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
            <span className="font-semibold">Kurumsal Üyelik</span>
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Hata: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Başarılı: </strong>
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Ad Soyad</label>
              <input id="fullname" name="fullname" type="text" required
                value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Adınız ve soyadınız" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta Adresi</label>
              <input id="email" name="email" type="email" required
                value={email} onChange={handleEmailChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${isEmailTaken ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="ornek@sirket.com" />
              {isCheckingEmail && <p className="mt-1 text-sm text-gray-500">E-posta kontrol ediliyor...</p>}
              {isEmailTaken && !isCheckingEmail && <p className="mt-1 text-sm text-red-600">Bu e-posta adresi zaten kullanımda.</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefon Numarası</label>
              <input id="phone" name="phone" type="tel"
                value={phone} onChange={handlePhoneChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Telefon numaranızı girin (örn: 5XX XXX XX XX)" />
            </div>

            {userType === 'corporate' && (
              <>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Şirket Adı</label>
                  <input id="companyName" name="companyName" type="text" required={userType === 'corporate'}
                    value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Şirketinizin tam adı" />
                </div>
                <div>
                  <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">Vergi Numarası</label>
                  <input id="taxId" name="taxId" type="text" required={userType === 'corporate'}
                    value={taxId} onChange={(e) => setTaxId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Şirketinizin vergi numarası" />
                </div>
                <div>
                  <label htmlFor="sector" className="block text-sm font-medium text-gray-700">Sektör</label>
                  <select id="sector" name="sector" required={userType === 'corporate'}
                    value={sector} onChange={(e) => setSector(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Sektör seçin...</option>
                    <option value="demir-celik">Demir-Çelik</option>
                    <option value="cimento">Çimento</option>
                    <option value="aluminyum">Alüminyum</option>
                    <option value="kimya">Kimya</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>
              </>
            )}
            
            {userType === 'individual' && (
                <div>
                    <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Meslek / Unvan</label>
                    <input id="profession" name="profession" type="text"
                        value={profession} onChange={(e) => setProfession(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Örn: Çevre Mühendisi"
                    />
                </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Şifre</label>
              <input id="password" name="password" type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••" />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Şifre Tekrarı</label>
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
              Hesap Oluştur
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Zaten bir hesabınız var mı?{' '}
              <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                Giriş yapın
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
