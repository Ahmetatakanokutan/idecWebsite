import { Link } from 'react-router-dom';
import { Phone, Printer, MapPin, Bus, Mail, Navigation, Train } from 'lucide-react';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';
import PageHero from '../components/PageHero';
import { useTranslation } from 'react-i18next';

// Yeditepe Universitesi Teknoloji Ussu — haritanin merkezi.
// Projenin resmi e-posta adresi.
const PROJECT_EMAIL = 'yukarbon@yeditepe.edu.tr';

const MAP_EMBED_SRC = 'https://maps.google.com/maps?q=40.922814360284555,29.31736328237939&hl=tr&z=17&output=embed';
const MAP_DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=40.922814360284555,29.31736328237939';

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="font-archivo">
        {/* Giriş bandı — diğer iç sayfalarla aynı bileşen */}
        <PageHero eyebrow={t('contact.eyebrow')} title={t('contact.title')} description={t('contact.subtitle')} />

        {/* Hızlı iletişim kartları */}
        <section className="bg-white py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ContactCard
                delay={0}
                icon={<Phone className="w-5 h-5 text-white" />}
                title={t('contact.card_phone_title')}
                lines={['(0216) 578 00 00 (pbx)']}
                href="tel:+902165780000"
              />
              <ContactCard
                delay={100}
                icon={<Printer className="w-5 h-5 text-white" />}
                title={t('contact.card_fax_title')}
                lines={['(0216) 578 02 99']}
              />
              <ContactCard
                delay={200}
                icon={<Bus className="w-5 h-5 text-white" />}
                title={t('contact.card_service_title')}
                lines={[
                  { text: '(0216) 578 01 34', href: 'tel:+902165780134' },
                  { text: '(0216) 578 01 35', href: 'tel:+902165780135' },
                  { text: 'istekservis@istek.org.tr', href: 'mailto:istekservis@istek.org.tr' },
                ]}
              />
              <ContactCard
                delay={300}
                icon={<Mail className="w-5 h-5 text-white" />}
                title={t('contact.card_email_title')}
                lines={[PROJECT_EMAIL]}
                href={`mailto:${PROJECT_EMAIL}`}
              />
            </div>
          </div>
        </section>

        {/* Adres + harita */}
        <section className="bg-paper py-20 md:py-24 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <Reveal from="left">
                <p className="text-accent-deep text-sm font-bold tracking-[0.2em] uppercase mb-3">
                  {t('contact.address_eyebrow')}
                </p>
                <h2 className="font-archivo text-2xl md:text-3xl font-bold text-ink-deep mb-8 leading-snug">
                  {t('about.contact_uni_title')}
                </h2>

                <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-7 mb-6">
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-accent-gradient flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </span>
                    <div className="text-gray-700 leading-relaxed">
                      <p className="font-bold text-ink-deep mb-1">{t('about.contact_uni_address_title')}</p>
                      <p>{t('about.contact_uni_address_line1')}</p>
                      <p>{t('about.contact_uni_address_line2')}</p>
                      <p>{t('about.contact_uni_address_line3')}</p>
                    </div>
                  </div>
                  <a
                    href={MAP_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-accent-deep font-bold hover:text-ink-deep transition-colors group"
                  >
                    <Navigation className="w-4 h-4" />
                    {t('contact.get_directions')}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>

                {/* Ulaşım imkanları */}
                <div className="rounded-2xl bg-ink-deep/[0.04] border border-ink-deep/10 p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <Train className="w-5 h-5 text-ink-deep" />
                    <h3 className="font-bold text-ink-deep">{t('about.contact_transport_options_title')}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {[1, 2, 3, 4].map((n) => (
                      <li key={n} className="flex items-start gap-3 text-gray-700">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent-bright flex-shrink-0" />
                        <span>{t(`about.transport_option_${n}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal from="right" delay={160}>
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-200 h-[540px]">
                  <iframe
                    src={MAP_EMBED_SRC}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={t('about.location_iframe_title')}
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Kapanış */}
        <section className="relative overflow-hidden bg-ink-gradient py-20">
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <Reveal>
              <h2 className="font-archivo text-3xl md:text-4xl font-bold text-white mb-5">
                {t('contact.closing_title')}
              </h2>
              <p className="text-lg text-white/70 mb-9">{t('contact.closing_desc')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/about"
                  className="bg-accent text-ink-deep px-8 py-4 rounded-lg font-bold hover:bg-white transition-colors shadow-lg shadow-accent/20"
                >
                  {t('contact.closing_cta_about')}
                </Link>
                <Link
                  to="/courses"
                  className="bg-white/[0.08] backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/[0.18] transition-colors"
                >
                  {t('contact.closing_cta_courses')}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </Layout>
  );
};

/** Kart satiri: duz metin ya da kendi baglantisi olan satir (servis kartindaki telefonlar/e-posta gibi). */
type ContactLine = string | { text: string; href: string };

const ContactCard = ({
  icon,
  title,
  lines,
  href,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  lines: ContactLine[];
  /** Kartin tamami tek bir yere gidiyorsa (telefon, e-posta) */
  href?: string;
  delay?: number;
}) => {
  const body = (
    <div
      className={`group h-full rounded-2xl border border-gray-100 bg-paper p-7 shadow-sm transition-all duration-300 ${
        href ? 'hover:shadow-xl hover:-translate-y-1 hover:border-accent-bright/40 motion-reduce:hover:translate-y-0' : ''
      }`}
    >
      <div className="w-11 h-11 rounded-xl bg-accent-gradient flex items-center justify-center mb-5 shadow-md shadow-accent-bright/20 group-hover:scale-105 motion-reduce:group-hover:scale-100 transition-transform">
        {icon}
      </div>
      <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold mb-2">{title}</p>
      {lines.map((line) =>
        typeof line === 'string' ? (
          <p key={line} className="text-ink-deep font-semibold leading-snug break-words">
            {line}
          </p>
        ) : (
          <a
            key={line.text}
            href={line.href}
            className="block text-ink-deep font-semibold leading-snug break-words hover:text-accent-deep underline-offset-4 hover:underline transition-colors"
          >
            {line.text}
          </a>
        )
      )}
    </div>
  );

  return (
    <Reveal delay={delay} from="scale" className="h-full">
      {href ? (
        <a href={href} className="block h-full">
          {body}
        </a>
      ) : (
        body
      )}
    </Reveal>
  );
};

export default ContactPage;
