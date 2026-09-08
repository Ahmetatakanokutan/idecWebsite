import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Globe, ArrowRight, Leaf, BarChart3, Award, Layers } from 'lucide-react';
import Layout from '../components/Layout';
import AnnouncementsSection from '../components/AnnouncementsSection';
import { useScrollReveal, usePrefersReducedMotion } from '../hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

// Hero'daki kart için kullanılan fotoğraf (favori olan, index 0).
const heroImages = [
  "https://images.pexels.com/photos/9800009/pexels-photo-9800009.jpeg?auto=compress&cs=tinysrgb&w=1920", // Rüzgar Gülleri (Favori)
  "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1920", // Deniz/Okyanus
  "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1920", // Doğa ve Su
  "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1920"  // Yeşil Doğa
];

// Tüm bölümlerde aynı: 20px yukarı kayarak + opaklık artarak belirme, 300ms ease-out.
const REVEAL_HIDDEN = 'opacity-0 translate-y-5';
const REVEAL_SHOWN = 'opacity-100 translate-y-0';
const REVEAL_TRANSITION = 'transition-all duration-300 ease-out';

const HomePage = () => {
  const reducedMotion = usePrefersReducedMotion();
  const { t } = useTranslation();

  const heroReveal = useScrollReveal<HTMLDivElement>();
  const statsReveal = useScrollReveal<HTMLDivElement>();
  const featuresReveal = useScrollReveal<HTMLDivElement>();
  const imageGridReveal = useScrollReveal<HTMLDivElement>();
  const ctaReveal = useScrollReveal<HTMLDivElement>();

  return (
    <Layout>
      <div className="font-archivo">
        {/* Hero — koyu gradyan tuval */}
        <section className="relative bg-ink-gradient overflow-hidden">
          <div
            ref={heroReveal.ref}
            className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 ${REVEAL_TRANSITION} ${
              heroReveal.isVisible ? REVEAL_SHOWN : REVEAL_HIDDEN
            }`}
          >
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Metin sütunu */}
              <div className="flex-1 max-w-2xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/[0.12] backdrop-blur-md border border-white/[0.25] text-white text-sm font-semibold tracking-wide uppercase">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse motion-reduce:animate-none" />
                  <span>{t('home.shaping_future')}</span>
                </div>

                <h1
                  className="font-archivo font-bold text-white mb-8 leading-[1.1]"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
                >
                  {t('home.hero_main_title_part1')}{' '}
                  <span className="text-accent">{t('home.hero_main_title_part2')}</span>
                </h1>

                <p className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed">
                  {t('home.hero_description_line1')}
                  <br />
                  {t('home.hero_description_line2')}
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
                  <span className="px-4 py-2 rounded-full bg-white/[0.12] border border-white/[0.25] text-white text-sm font-medium">
                    400+ {t('home.stat_item_1_label')}
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/[0.12] border border-white/[0.25] text-white text-sm font-medium">
                    30+ {t('home.stat_item_2_label')}
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/[0.12] border border-white/[0.25] text-white text-sm font-medium">
                    4 {t('home.stat_item_3_label')}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                  <Link
                    to="/courses"
                    className="group bg-accent text-ink-deep px-8 py-4 rounded-lg hover:bg-accent-deep transition-colors duration-300 font-bold flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    {t('home.start_learning')}
                    <PlayCircleIcon className="ml-2 w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    to="/projects"
                    className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-lg hover:bg-white/[0.08] transition-colors duration-300 font-semibold flex items-center justify-center"
                  >
                    {t('home.explore_projects')}
                  </Link>
                </div>
              </div>

              {/* Görsel sütunu: tek fotoğraf, eğik kart */}
              <div className="flex-1 flex justify-center lg:justify-end w-full">
                <div className="w-full max-w-sm rotate-2 hover:rotate-0 motion-reduce:rotate-0 transition-transform duration-500 ease-out">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/[0.25] aspect-[4/5]">
                    <img src={heroImages[0]} alt="IDEC-TT" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* İstatistikler — koyu gradyan */}
        <section className="relative bg-ink-gradient overflow-hidden">
          <div
            ref={statsReveal.ref}
            className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 ${REVEAL_TRANSITION} ${
              statsReveal.isVisible ? REVEAL_SHOWN : REVEAL_HIDDEN
            }`}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatItem
                number="400+"
                label={t('home.stat_item_1_label')}
                icon={<Users className="w-5 h-5" />}
                ringClass="text-accent"
                active={statsReveal.isVisible}
                reducedMotion={statsReveal.reducedMotion}
              />
              <StatItem
                number="30+"
                label={t('home.stat_item_2_label')}
                icon={<BarChart3 className="w-5 h-5" />}
                ringClass="text-white/70"
                active={statsReveal.isVisible}
                reducedMotion={statsReveal.reducedMotion}
              />
              <StatItem
                number="4"
                label={t('home.stat_item_3_label')}
                icon={<Layers className="w-5 h-5" />}
                ringClass="text-white/70"
                active={statsReveal.isVisible}
                reducedMotion={statsReveal.reducedMotion}
              />
              <StatItem
                number="5"
                label={t('home.stat_item_4_label')}
                icon={<Award className="w-5 h-5" />}
                ringClass="text-white/70"
                active={statsReveal.isVisible}
                reducedMotion={statsReveal.reducedMotion}
              />
            </div>
          </div>
        </section>

        {/* Duyurular — açık (paper) zemin. Kesinlikle korunuyor. */}
        <AnnouncementsSection />

        {/* 3 Temel Adım — açık (paper) zemin */}
        <section id="about" className="bg-paper relative py-28">
          <div
            ref={featuresReveal.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${REVEAL_TRANSITION} ${
              featuresReveal.isVisible ? REVEAL_SHOWN : REVEAL_HIDDEN
            }`}
          >
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-accent-deep tracking-widest uppercase mb-3">
                {t('home.vision_title_section')}
              </h2>
              <h3 className="font-archivo text-4xl md:text-5xl font-bold text-ink-deep mb-6">
                {t('home.vision_subtitle_section')} <br /> {t('home.vision_main_title_section')}
              </h3>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">{t('home.vision_description_section')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Target className="w-7 h-7 text-ink-deep" />}
                title={t('home.feature_card_1_title')}
                description={t('home.feature_card_1_desc')}
              />
              <FeatureCard
                icon={<Globe className="w-7 h-7 text-ink-deep" />}
                title={t('home.feature_card_2_title')}
                description={t('home.feature_card_2_desc')}
              />
              <FeatureCard
                icon={<Users className="w-7 h-7 text-ink-deep" />}
                title={t('home.feature_card_3_title')}
                description={t('home.feature_card_3_desc')}
              />
            </div>
          </div>
        </section>

        {/* Teknoloji ve Doğa Uyumu — açık (paper) zemin, Duyurular'dan sonra */}
        <section className="py-28 bg-paper overflow-hidden border-t border-gray-200">
          <div
            ref={imageGridReveal.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${REVEAL_TRANSITION} ${
              imageGridReveal.isVisible ? REVEAL_SHOWN : REVEAL_HIDDEN
            }`}
          >
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <h2 className="font-source-serif text-4xl font-bold text-ink-deep mb-6">
                  {t('home.tech_harmony_title')}
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{t('home.tech_harmony_desc')}</p>
                <ul className="space-y-4 mb-8">
                  <ListItem text={t('home.list_item_1')} />
                  <ListItem text={t('home.list_item_2')} />
                  <ListItem text={t('home.list_item_3')} />
                </ul>
                <Link
                  to="/about"
                  className="text-accent-deep font-bold hover:text-ink-deep transition-colors inline-flex items-center group"
                >
                  {t('home.read_more_about')} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-ink-teal/5 rounded-full blur-3xl" />
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <img
                    src="https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=600"
                    className="rounded-2xl shadow-lg transform translate-y-8"
                    alt="Nature"
                  />
                  <img
                    src="https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=600"
                    className="rounded-2xl shadow-lg"
                    alt="Tech"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kapanış çağrısı — koyu gradyan */}
        <section className="relative bg-ink-gradient overflow-hidden">
          <div
            ref={ctaReveal.ref}
            className={`relative z-10 max-w-4xl mx-auto px-4 py-28 text-center ${REVEAL_TRANSITION} ${
              ctaReveal.isVisible ? REVEAL_SHOWN : REVEAL_HIDDEN
            }`}
          >
            <h2 className="font-archivo text-4xl md:text-5xl font-bold text-white mb-8">{t('home.cta_title')}</h2>
            <p className="text-xl text-white/70 mb-10 font-light">{t('home.cta_description')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-accent text-ink-deep px-10 py-4 rounded-lg hover:bg-accent-deep transition-colors duration-300 font-bold shadow-lg"
              >
                {t('home.cta_contact')}
              </Link>
              <Link
                to="/register"
                className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-lg hover:bg-white/[0.08] transition-colors duration-300 font-bold"
              >
                {t('home.cta_register')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

// Helper Components for cleaner code
const COUNT_UP_DURATION_MS = 1200;

// Sayiyi (400+, 30+, 4, 5) rakam + sonek olarak ayirir, gorunur oldugunda
// requestAnimationFrame ile ease-out sayarak hedefe ulasir. Reduced motion'da
// (veya henuz aktif degilken) dogrudan hedef/0 gosterir, kutuphane gerekmez.
const useCountUp = (target: number, active: boolean, reducedMotion: boolean) => {
    const [value, setValue] = useState(reducedMotion ? target : 0);

    useEffect(() => {
        if (!active) return;
        if (reducedMotion) {
            setValue(target);
            return;
        }

        let frameId: number;
        const start = performance.now();

        const tick = (now: number) => {
            const progress = Math.min((now - start) / COUNT_UP_DURATION_MS, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) {
                frameId = requestAnimationFrame(tick);
            }
        };

        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [active, target, reducedMotion]);

    return value;
};

// Ikonun etrafinda dolan dairesel gosterge (SVG). Kutuphane gerektirmez;
// stroke-dashoffset her render'da useCountUp'in guncel degeriyle birlikte
// hesaplandigi icin sayimla birebir senkron doluyor.
const RING_SIZE = 72;
const RING_STROKE = 4;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const StatItem = ({
    number,
    label,
    icon,
    ringClass,
    active,
    reducedMotion,
}: {
    number: string;
    label: string;
    icon: React.ReactNode;
    ringClass: string;
    active: boolean;
    reducedMotion: boolean;
}) => {
    const match = number.match(/^(\d+)(.*)$/);
    const target = match ? parseInt(match[1], 10) : 0;
    const suffix = match ? match[2] : '';
    const displayValue = useCountUp(target, active, reducedMotion);
    const progress = active && target > 0 ? displayValue / target : 0;

    return (
        <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="relative mb-3" style={{ width: RING_SIZE, height: RING_SIZE }}>
                <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
                    <circle
                        cx={RING_SIZE / 2}
                        cy={RING_SIZE / 2}
                        r={RING_RADIUS}
                        fill="none"
                        strokeWidth={RING_STROKE}
                        className="text-white/15"
                        stroke="currentColor"
                    />
                    <circle
                        cx={RING_SIZE / 2}
                        cy={RING_SIZE / 2}
                        r={RING_RADIUS}
                        fill="none"
                        strokeWidth={RING_STROKE}
                        strokeLinecap="round"
                        className={ringClass}
                        stroke="currentColor"
                        strokeDasharray={RING_CIRCUMFERENCE}
                        strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
                    />
                </svg>
                <div className={`absolute inset-0 flex items-center justify-center ${ringClass}`}>{icon}</div>
            </div>
            <span className="font-source-serif text-4xl font-extrabold text-white mb-1">
                {displayValue}
                {suffix}
            </span>
            <span className="text-sm text-white/60 font-medium uppercase tracking-wide">{label}</span>
        </div>
    );
};

const FeatureCard = ({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) => (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 motion-reduce:hover:translate-y-0 transition-all duration-300 ease-out cursor-default">
        <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6">{icon}</div>
        <h3 className="text-xl font-bold text-ink-deep mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
);

const ListItem = ({ text }: { text: string }) => (
    <li className="flex items-center text-gray-700">
        <span className="w-6 h-6 bg-accent-deep/10 rounded-full flex items-center justify-center mr-3 text-accent-deep flex-shrink-0">
            <Leaf className="w-3 h-3 fill-current" />
        </span>
        {text}
    </li>
);

// Missing Icon
const PlayCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
);

export default HomePage;
