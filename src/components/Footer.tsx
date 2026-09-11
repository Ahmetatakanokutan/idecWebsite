import { Link } from "react-router-dom";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

// Hizli erisim: yeni bir baglanti eklemek buraya bir satir eklemek kadar basit.
const QUICK_LINKS = [
  { to: '/about', labelKey: 'header.about' },
  { to: '/projects', labelKey: 'header.projects' },
  { to: '/courses', labelKey: 'header.academy' },
  { to: '/announcements', labelKey: 'common.announcements' },
  { to: '/contact', labelKey: 'header.contact' },
];

// Ceviri dosyasindaki footer.activity_1..4
const ACTIVITY_KEYS = ['footer.activity_1', 'footer.activity_2', 'footer.activity_3', 'footer.activity_4'];

// Projenin resmi e-posta adresi.
const PROJECT_EMAIL = 'yukarbon@yeditepe.edu.tr';
const SWITCHBOARD = '(0216) 578 00 00';
const SWITCHBOARD_TEL = '+902165780000';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full">
      {/* Ana katman: koyu, dort sutunlu */}
      <div className="bg-ink-night text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.3fr] gap-10 lg:gap-12">
            {/* 1) Marka + kisa tanim */}
            <div>
              <Link to="/" className="inline-flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-11 h-11 bg-accent-gradient rounded-lg shadow-md shadow-accent-bright/25">
                  <Leaf className="w-6 h-6 text-white" />
                </span>
                <span className="font-archivo text-2xl font-bold tracking-tight">IDEC-TT</span>
              </Link>
              <p className="text-white/60 leading-relaxed max-w-sm">{t('footer.description')}</p>
            </div>

            {/* 2) Hizli erisim */}
            <nav aria-label={t('footer.quickLinks')}>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-5">
                {t('footer.quickLinks')}
              </h2>
              <ul className="space-y-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-white/70 hover:text-accent transition-colors leading-snug inline-block"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 3) Faaliyet alanlari — baglanti degil, tanim */}
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-5">
                {t('footer.activities')}
              </h2>
              <ul className="space-y-3">
                {ACTIVITY_KEYS.map((key) => (
                  <li key={key} className="flex items-start gap-2.5 text-white/70 leading-snug">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/70 flex-shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            {/* 4) Iletisim */}
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-5">
                {t('footer.contact')}
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-3 text-white/70 leading-relaxed">
                  <MapPin className="w-4 h-4 mt-1 text-white/40 flex-shrink-0" />
                  <span>
                    {t('about.contact_uni_address_line1')}
                    <br />
                    {t('about.contact_uni_address_line2')}
                    <br />
                    {t('about.contact_uni_address_line3')}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-white/40 flex-shrink-0" />
                  <a href={`tel:${SWITCHBOARD_TEL}`} className="text-white/70 hover:text-accent transition-colors">
                    {SWITCHBOARD}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-white/40 flex-shrink-0" />
                  <a
                    href={`mailto:${PROJECT_EMAIL}`}
                    className="text-white/70 hover:text-accent transition-colors break-all"
                  >
                    {PROJECT_EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Alt satir */}
          <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/45">
            <p>
              © {new Date().getFullYear()} IDEC-TT · {t('footer.rights')}
            </p>
            <p>{t('footer.beneficiary_name')}</p>
          </div>
        </div>
      </div>

      {/* ISTKA bandi: gorunurluk kurallari geregi acik zeminde, logolar oldugu gibi korunuyor */}
      <div className="w-full bg-[#E9E9E9] py-12 border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:flex-1">
              <p className="text-[#4A4A4A] text-sm md:text-base leading-relaxed font-medium text-justify">
                {t('footer.istka_disclaimer', {
                  projectName: t('footer.project_name_long'),
                  beneficiaryName: t('footer.beneficiary_name'),
                })}
              </p>
            </div>

            <div className="lg:flex-1 flex items-center justify-center lg:justify-end gap-16">
              <a
                href="https://www.sanayi.gov.tr/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="https://www.istka.org.tr/media/about/xIdKSy0TeNDJij4yuIhpzwcrQJInIpRd1a7C6OZ20TJdsqsLQ2TR.jpg"
                  alt="T.C. Sanayi ve Teknoloji Bakanlığı"
                  className="h-[90px] md:h-[110px] w-auto border border-black shadow-sm bg-white"
                />
              </a>

              <a
                href="https://www.istka.org.tr/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="https://www.istka.org.tr/media/about/gpUnLFoxW9MA3xxifMEKu2ijJfmNJnGsMNzMutuRsrQmFfEVvvEN.png"
                  alt="İstanbul Kalkınma Ajansı"
                  className="h-[75px] md:h-[95px] w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
