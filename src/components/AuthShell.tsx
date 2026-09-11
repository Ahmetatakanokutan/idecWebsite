import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import DotMatrixField from './DotMatrixField';
import { useTranslation } from 'react-i18next';

/**
 * Giris / kayit / sifre sayfalarinin ortak kabugu: ana sayfadaki koyu gradyan
 * ve nokta matrisi zemin, ustunde beyaz bir kart. Bes auth sayfasi da bunu
 * kullandigi icin form gorunumu her yerde ayni.
 */

// Formlarda tekrar eden siniflar — sayfalar bunlari ice aktarip kullaniyor.
export const authLabelClass = 'block text-sm font-semibold text-ink-deep mb-1.5';
export const authInputClass =
  'block w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-bright focus:border-transparent transition-all';
export const authButtonClass =
  'w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-white font-bold bg-accent-gradient shadow-md shadow-accent-bright/25 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-deep transition-all disabled:opacity-60 disabled:cursor-not-allowed';
export const authLinkClass = 'font-bold text-accent-deep hover:text-ink-deep transition-colors';

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Kayit gibi uzun formlarda karti genislet */
  wide?: boolean;
};

const AuthShell = ({ title, subtitle, children, wide = false }: AuthShellProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-deep font-archivo flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Zemin: ana sayfayla ayni dil */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-ink-drift bg-[length:200%_200%] animate-drift motion-reduce:animate-none" />
        <DotMatrixField className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-ink-night/45" />
      </div>

      <div className={`relative z-10 w-full ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
        <div className="bg-white rounded-2xl shadow-2xl border border-white/20 p-8 sm:p-10">
          <div className="flex justify-center mb-6">
            <Link
              to="/"
              className="flex items-center justify-center w-16 h-16 bg-accent-gradient rounded-xl shadow-md shadow-accent-bright/25"
              aria-label="IDEC-TT"
            >
              <Leaf className="w-8 h-8 text-white" />
            </Link>
          </div>

          <h1 className="text-center font-archivo text-2xl sm:text-3xl font-bold text-ink-deep mb-2">{title}</h1>
          {subtitle && <p className="text-center text-gray-500 mb-8">{subtitle}</p>}

          <div className={subtitle ? '' : 'mt-8'}>{children}</div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-white/80 hover:text-accent font-semibold transition-colors">
            {t('login_page.back_home')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
