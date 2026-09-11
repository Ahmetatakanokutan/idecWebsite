import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Users,
  Globe,
  ArrowRight,
  Leaf,
  BarChart3,
  Award,
  Layers,
  AlertTriangle,
  BookOpen,
  Factory,
  TrendingUp,
  Plus,
} from 'lucide-react';
import Layout from '../components/Layout';
import AnnouncementsSection from '../components/AnnouncementsSection';
import Reveal from '../components/Reveal';
import DotMatrixField from '../components/DotMatrixField';
import { useScrollReveal, usePrefersReducedMotion } from '../hooks/useScrollReveal';
import { useCountUp } from '../hooks/useCountUp';
import { useTranslation } from 'react-i18next';

// Yandaki HUD cercevesinde donen ambiyans videosu (Pexels, telifsiz):
// yesil tepelerde ruzgar turbinleri — "Yesil Enerji, Guclu Sanayi" basligiyla
// ayni seyi anlatiyor. Degistirmek icin asagidaki iki adresi guncellemek yeterli.
// 960x540 secildi: cerceve ~384px genisliginde gorundugu icin daha buyugu
// gereksiz — dosya 5 MB yerine ~2.8 MB.
const FRAME_VIDEO_SRC = 'https://videos.pexels.com/video-files/4842993/4842993-sd_960_540_30fps.mp4';
// Video yuklenene kadar duran kare: ayni temada bir fotograf.
const FRAME_VIDEO_POSTER =
  'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=800';

// Tüm bölümlerde aynı: 20px yukarı kayarak + opaklık artarak belirme.
const REVEAL_HIDDEN = 'opacity-0 translate-y-5';
const REVEAL_SHOWN = 'opacity-100 translate-y-0';
const REVEAL_TRANSITION = 'transition-all duration-700 ease-out';

const HomePage = () => {
  const { t } = useTranslation();

  const heroReveal = useScrollReveal<HTMLDivElement>();
  const statsReveal = useScrollReveal<HTMLDivElement>();
  const howReveal = useScrollReveal<HTMLDivElement>();
  const featuresReveal = useScrollReveal<HTMLDivElement>();
  const imageGridReveal = useScrollReveal<HTMLDivElement>();
  const ctaReveal = useScrollReveal<HTMLDivElement>();

  // "Nasil Calisir" dort adimi — icerik ceviri dosyasindan, ikon/renk burada.
  const howSteps = [
    { icon: <AlertTriangle className="w-5 h-5" />, key: 1 },
    { icon: <BookOpen className="w-5 h-5" />, key: 2 },
    { icon: <Factory className="w-5 h-5" />, key: 3 },
    { icon: <TrendingUp className="w-5 h-5" />, key: 4 },
  ];

  return (
    <Layout>
      <div className="font-archivo">
        {/* Hero — canli gradyan + nokta matrisi, hepsi tarayicida ciziliyor */}
        <section className="relative overflow-hidden bg-ink-deep">
          <HeroBackdrop />

          <div
            ref={heroReveal.ref}
            className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-20 ${REVEAL_TRANSITION} ${
              heroReveal.isVisible ? REVEAL_SHOWN : REVEAL_HIDDEN
            }`}
          >
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Metin sütunu */}
              <div className="flex-1 max-w-2xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/[0.14] backdrop-blur-md border border-white/[0.3] text-white text-sm font-semibold tracking-wide uppercase">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-accent animate-pulse-ring motion-reduce:animate-none" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-accent" />
                  </span>
                  <span>{t('home.shaping_future')}</span>
                </div>

                <h1
                  className="font-archivo font-bold text-white mb-8 leading-[1.05]"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
                >
                  {t('home.hero_main_title_part1')}{' '}
                  <span className="text-accent drop-shadow-[0_2px_20px_rgba(74,222,128,0.35)]">
                    {t('home.hero_main_title_part2')}
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                  {t('home.hero_description_line1')}
                  <br />
                  {t('home.hero_description_line2')}
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
                  <HeroChip>{t('home.hero_chip_free')}</HeroChip>
                  <HeroChip>{t('home.hero_chip_certificate')}</HeroChip>
                  <HeroChip>{t('home.hero_chip_ai')}</HeroChip>
                </div>

                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                  <Link
                    to="/courses"
                    className="group bg-accent text-ink-deep px-8 py-4 rounded-lg hover:bg-white transition-colors duration-300 font-bold flex items-center justify-center shadow-lg shadow-accent/20 hover:shadow-xl"
                  >
                    {t('home.start_learning')}
                    <PlayCircleIcon className="ml-2 w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    to="/about"
                    className="bg-white/[0.06] backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-lg hover:bg-white/[0.16] transition-colors duration-300 font-semibold flex items-center justify-center"
                  >
                    {t('home.hero_learn_project')}
                  </Link>
                </div>
              </div>

              {/* Görsel sütunu: HUD çerçevesi içinde dönen ambiyans videosu */}
              <div className="flex-1 flex justify-center lg:justify-end w-full">
                <div className="relative w-full max-w-sm">
                  {/* Çerçevenin arkasındaki yumuşak vurgu halesi */}
                  <div className="absolute -inset-4 rounded-[1.75rem] bg-accent/20 blur-2xl animate-glow motion-reduce:animate-none" />

                  <div className="relative rotate-2 hover:rotate-0 motion-reduce:rotate-0 transition-transform duration-500 ease-out">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-accent/40 aspect-[4/5]">
                      <FrameVideo />

                      {/* Görseli koyu palete çeken perde */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/10 to-transparent" />

                      {/* İnce ölçüm ızgarası */}
                      <div
                        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
                        style={{
                          backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                          backgroundSize: '24px 24px',
                        }}
                      />

                      {/* Yukarıdan aşağı süzülen tarama çizgisi */}
                      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-transparent via-accent/35 to-transparent animate-scan motion-reduce:hidden" />

                      {/* HUD köşe işaretleri */}
                      <HudCorner className="top-3 left-3 border-t-2 border-l-2 rounded-tl-md" />
                      <HudCorner className="top-3 right-3 border-t-2 border-r-2 rounded-tr-md" />
                      <HudCorner className="bottom-3 left-3 border-b-2 border-l-2 rounded-bl-md" />
                      <HudCorner className="bottom-3 right-3 border-b-2 border-r-2 rounded-br-md" />

                      {/* Alt kunye: cerceve icinde tek blok — ayri rozetle cakisma riski yok */}
                      <div className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-10 bg-gradient-to-t from-ink-night/90 via-ink-night/50 to-transparent">
                        <div className="flex items-center gap-2 mb-1.5 text-[10px] uppercase tracking-[0.16em] text-accent font-bold">
                          <span className="relative flex w-1.5 h-1.5">
                            <span className="absolute inline-flex w-full h-full rounded-full bg-accent animate-pulse-ring motion-reduce:animate-none" />
                            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-accent" />
                          </span>
                          <span>{t('home.hero_frame_caption')}</span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-white/45 font-bold">
                          {t('home.hero_badge_label')}
                        </p>
                        <p className="text-white text-sm font-semibold leading-snug">
                          {t('home.hero_badge_value')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero altindaki cam serit: dort rakam tek bakista */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div
              ref={statsReveal.ref}
              className={`rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.2] px-4 py-8 sm:px-8 ${REVEAL_TRANSITION} ${
                statsReveal.isVisible ? REVEAL_SHOWN : REVEAL_HIDDEN
              }`}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                  ringClass="text-sky-bright"
                  active={statsReveal.isVisible}
                  reducedMotion={statsReveal.reducedMotion}
                />
                <StatItem
                  number="4"
                  label={t('home.stat_item_3_label')}
                  icon={<Layers className="w-5 h-5" />}
                  ringClass="text-accent"
                  active={statsReveal.isVisible}
                  reducedMotion={statsReveal.reducedMotion}
                />
                <StatItem
                  number="5"
                  label={t('home.stat_item_4_label')}
                  icon={<Award className="w-5 h-5" />}
                  ringClass="text-sky-bright"
                  active={statsReveal.isVisible}
                  reducedMotion={statsReveal.reducedMotion}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Akan konu şeridi — hero ile zincir arasında ince bir nefes */}
        <TopicTicker />

        {/* Nasıl Çalışır — dört adımlı zincir, koyu gece zemin */}
        <section className="relative bg-ink-night overflow-hidden py-28">
          {/* Zemine derinlik veren iki soluk isik lekesi */}
          <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-ink-mid/40 blur-3xl animate-float-slow motion-reduce:animate-none" />
          <div className="pointer-events-none absolute -bottom-32 right-1/5 w-[28rem] h-[28rem] rounded-full bg-ink-teal/25 blur-3xl animate-float motion-reduce:animate-none" />

          <div ref={howReveal.ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-20 ${REVEAL_TRANSITION} ${
                howReveal.isVisible ? REVEAL_SHOWN : REVEAL_HIDDEN
              }`}
            >
              <h2 className="text-sm font-bold text-accent tracking-[0.2em] uppercase mb-4">
                {t('home.how_eyebrow')}
              </h2>
              <h3 className="font-archivo text-4xl md:text-5xl font-bold text-white mb-6">
                {t('home.how_title')}
              </h3>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">{t('home.how_desc')}</p>
            </div>

            <div className="relative">
              {/* Masaüstü: adımların üstünden geçen yatay kesikli bağlantı çizgisi
                  ve üzerinde soldan sağa ilerleyen ışık darbesi */}
              <div className="hidden md:block absolute top-[38px] left-[12.5%] right-[12.5%] pointer-events-none">
                <svg width="100%" height="2" preserveAspectRatio="none" aria-hidden="true">
                  <line
                    x1="0"
                    y1="1"
                    x2="100%"
                    y2="1"
                    stroke="#4ADE80"
                    strokeOpacity="0.45"
                    strokeWidth="2"
                    strokeDasharray="6 10"
                    className="animate-dash-flow motion-reduce:animate-none"
                  />
                </svg>
                <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_16px_4px_rgba(74,222,128,0.55)] animate-travel motion-reduce:hidden" />
              </div>

              {/* Mobil: adımların solundan inen dikey kesikli çizgi */}
              <div
                className="md:hidden absolute left-[19px] top-6 bottom-16 w-px pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(to bottom, rgba(74,222,128,0.45) 0 6px, transparent 6px 16px)',
                }}
              />

              <ol className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                {howSteps.map((step, index) => (
                  <Reveal as="li" key={step.key} delay={index * 140} className="relative">
                    {/* Masaüstü: numara ortada, ikon numaranın üzerinde, yazılar altında */}
                    <div className="hidden md:flex flex-col items-center text-center">
                      <div className="relative flex items-center justify-center h-[76px] mb-6">
                        <span className="font-archivo font-extrabold text-white/[0.16] leading-none select-none text-[6rem]">
                          {String(step.key).padStart(2, '0')}
                        </span>
                        <span className="absolute flex items-center justify-center w-11 h-11 rounded-full bg-ink-night text-accent">
                          <span className="absolute inset-0 rounded-full bg-accent/25 animate-pulse-ring motion-reduce:animate-none" />
                          <span className="relative flex items-center justify-center w-11 h-11 rounded-full bg-accent/15 border border-accent/40">
                            {step.icon}
                          </span>
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3">{t(`home.how_step_${step.key}_title`)}</h4>
                      <p className="text-white/60 leading-relaxed text-[15px]">{t(`home.how_step_${step.key}_desc`)}</p>
                    </div>

                    {/* Mobil: ikon solda (dikey çizgi üzerinde), yazılar sağda */}
                    <div className="md:hidden flex items-start gap-5">
                      <span className="relative flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-ink-night text-accent">
                        <span className="absolute inset-0 rounded-full bg-accent/15 border border-accent/40" />
                        <span className="relative">{step.icon}</span>
                      </span>
                      <div>
                        <span className="block font-archivo font-extrabold text-white/25 text-2xl leading-none mb-2">
                          {String(step.key).padStart(2, '0')}
                        </span>
                        <h4 className="text-xl font-bold text-white mb-2">{t(`home.how_step_${step.key}_title`)}</h4>
                        <p className="text-white/60 leading-relaxed text-[15px]">{t(`home.how_step_${step.key}_desc`)}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>

            <Reveal delay={640} className="mt-16 text-center">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-accent font-bold hover:text-white transition-colors group"
              >
                {t('home.how_cta')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
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
              <h2 className="text-sm font-bold text-accent-deep tracking-[0.2em] uppercase mb-3">
                {t('home.vision_title_section')}
              </h2>
              <h3 className="font-archivo text-4xl md:text-5xl font-bold text-ink-deep mb-6">
                {t('home.vision_subtitle_section')} <br /> {t('home.vision_main_title_section')}
              </h3>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">{t('home.vision_description_section')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                delay={0}
                icon={<Target className="w-7 h-7 text-white" />}
                title={t('home.feature_card_1_title')}
                description={t('home.feature_card_1_desc')}
              />
              <FeatureCard
                delay={120}
                icon={<Globe className="w-7 h-7 text-white" />}
                title={t('home.feature_card_2_title')}
                description={t('home.feature_card_2_desc')}
              />
              <FeatureCard
                delay={240}
                icon={<Users className="w-7 h-7 text-white" />}
                title={t('home.feature_card_3_title')}
                description={t('home.feature_card_3_desc')}
              />
            </div>
          </div>
        </section>

        {/* Teknoloji ve Doğa Uyumu — açık (paper) zemin */}
        <section className="relative py-28 bg-ink-night overflow-hidden">
          <div
            ref={imageGridReveal.ref}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${REVEAL_TRANSITION} ${
              imageGridReveal.isVisible ? REVEAL_SHOWN : REVEAL_HIDDEN
            }`}
          >
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <h2 className="font-source-serif text-4xl font-bold text-white mb-6">
                  {t('home.tech_harmony_title')}
                </h2>
                <p className="text-lg text-white/70 mb-8 leading-relaxed">{t('home.tech_harmony_desc')}</p>
                <ul className="space-y-4 mb-8">
                  <ListItem text={t('home.list_item_1')} />
                  <ListItem text={t('home.list_item_2')} />
                  <ListItem text={t('home.list_item_3')} />
                </ul>
                <Link
                  to="/about"
                  className="text-accent font-bold hover:text-white transition-colors inline-flex items-center group"
                >
                  {t('home.read_more_about')} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-accent/15 rounded-full blur-3xl" />
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

        {/* Sık sorulanlar — açılır kapanır üç soru */}
        <FaqSection />

        {/* Kapanış çağrısı — canlı gradyan, yavaşça kayan */}
        <section className="relative bg-ink-drift bg-[length:200%_200%] animate-drift motion-reduce:animate-none overflow-hidden">
          <div
            ref={ctaReveal.ref}
            className={`relative z-10 max-w-4xl mx-auto px-4 py-28 text-center ${REVEAL_TRANSITION} ${
              ctaReveal.isVisible ? REVEAL_SHOWN : REVEAL_HIDDEN
            }`}
          >
            <h2 className="font-archivo text-4xl md:text-5xl font-bold text-white mb-8">{t('home.cta_title')}</h2>
            <p className="text-xl text-white/75 mb-10 font-light">{t('home.cta_description')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-accent text-ink-deep px-10 py-4 rounded-lg hover:bg-white transition-colors duration-300 font-bold shadow-lg shadow-black/10"
              >
                {t('home.cta_contact')}
              </Link>
              <Link
                to="/register"
                className="bg-white/[0.08] backdrop-blur-sm border border-white/30 text-white px-10 py-4 rounded-lg hover:bg-white/[0.18] transition-colors duration-300 font-bold"
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

/**
 * Hero arka plani — hazir video yok, hepsi tarayicida ciziliyor:
 *  1. yavasca kayan canli gradyan (eskisi gibi),
 *  2. blueprint hissi veren ince izgara,
 *  3. capraz dalgayla canlanan nokta matrisi (canvas),
 *  4. serbest yuzen isik lekeleri,
 *  5. altta karartma — metin her zaman okunur kalsin.
 */
const HeroBackdrop = () => (
  <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 bg-ink-drift bg-[length:200%_200%] animate-drift motion-reduce:animate-none" />

    {/* Blueprint izgarasi — kenarlara dogru soluyor */}
    <div
      className="absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, #000 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, #000 40%, transparent 100%)',
      }}
    />

    <DotMatrixField className="absolute inset-0 w-full h-full" />

    <div className="absolute -top-32 -left-24 w-[34rem] h-[34rem] rounded-full bg-sky-bright/10 blur-3xl animate-float-slow motion-reduce:animate-none" />
    <div className="absolute -bottom-40 right-0 w-[30rem] h-[30rem] rounded-full bg-accent/10 blur-3xl animate-float motion-reduce:animate-none" />

    {/* Soldan perde: gradyan kayarken metin sutunu her zaman koyu lacivert
        zeminde kalsin — yesil baslik yesil zemine denk gelmesin. */}
    <div className="absolute inset-0 bg-gradient-to-r from-ink-night/85 via-ink-night/35 to-transparent" />
    {/* Mobilde metin ortalandigi icin soldan perde yetmiyor: tumunu bir tik koyulastir. */}
    <div className="absolute inset-0 bg-ink-night/45 md:hidden" />
    <div className="absolute inset-0 bg-gradient-to-t from-ink-night/70 via-transparent to-ink-deep/35" />
  </div>
);

/**
 * Kesintisiz akan konu seridi. Ayni liste iki kez basilir ve serit
 * genisliginin yarisi kadar kaydirilir; bittigi anda basa dondugu icin
 * dikis gorunmez. Ekran okuyucular icin ikinci kopya gizlenir.
 */
const TICKER_KEYS = [
  'home.ticker_1',
  'home.ticker_2',
  'home.ticker_3',
  'home.ticker_4',
  'home.ticker_5',
  'home.ticker_6',
];

const TopicTicker = () => {
  const { t } = useTranslation();
  const items = TICKER_KEYS.map((key) => t(key));

  return (
    <div className="relative bg-paper border-y border-gray-200 overflow-hidden py-4">
      {/* Kenarlarda yumusak kaybolma */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent z-10" />

      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex items-center shrink-0"
            aria-hidden={copy === 1 ? 'true' : undefined}
          >
            {items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-6 px-6 text-sm uppercase tracking-[0.22em] text-gray-500 whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rotate-45 bg-accent-bright" />
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

/**
 * HUD cercevesinin icinde donen ambiyans videosu.
 * Poster gorseli hemen gorunur, video ancak `canplay` sonrasi yumusakca
 * uzerine biner; yuklenemezse poster oldugu yerde kalir. Reduced motion
 * acikken video hic indirilmez, sadece poster gosterilir.
 */
const FrameVideo = () => {
  const [ready, setReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <img src={FRAME_VIDEO_POSTER} alt="" className="w-full h-full object-cover" />;
  }

  return (
    <>
      <img src={FRAME_VIDEO_POSTER} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <video
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
        src={FRAME_VIDEO_SRC}
        poster={FRAME_VIDEO_POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setReady(true)}
      />
    </>
  );
};

/** HUD cerceve kosesi: sadece iki kenari olan kucuk bir dikdortgen. */
const HudCorner = ({ className }: { className: string }) => (
  <span className={`absolute w-6 h-6 border-accent/70 ${className}`} />
);

const HeroChip = ({ children }: { children: React.ReactNode }) => (
  <span className="px-4 py-2 rounded-full bg-white/[0.12] border border-white/[0.28] text-white text-sm font-medium backdrop-blur-sm">
    {children}
  </span>
);

/**
 * Sik sorulanlar. Acilir kapanir kartlar.
 * <details>/<summary> kullaniliyor: klavye ve ekran okuyucu destegi tarayicidan
 * geliyor, JS ile ac/kapa mantigi yazmaya gerek kalmiyor.
 */
const FAQ_COUNT = 6;

const FaqSection = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-paper py-24 md:py-28 border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-14">
          <p className="text-accent-deep text-sm font-bold tracking-[0.2em] uppercase mb-3">
            {t('home.faq_eyebrow')}
          </p>
          <h2 className="font-archivo text-3xl md:text-5xl font-bold text-ink-deep mb-5">{t('home.faq_title')}</h2>
          <p className="text-lg text-gray-500">{t('home.faq_desc')}</p>
        </Reveal>

        <div className="space-y-4">
          {Array.from({ length: FAQ_COUNT }, (_, i) => i + 1).map((n, i) => (
            <Reveal key={n} delay={i * 110}>
              {/* Ilk soru acik gelsin: icerinde icerik oldugu bir bakista gorunsun */}
              <details
                open={n === 1}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm open:shadow-lg open:border-accent-bright/30 transition-all duration-300"
              >
                <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="text-lg font-bold text-ink-deep leading-snug">{t(`home.faq_${n}_q`)}</h3>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-bright/10 border border-accent-bright/25 flex items-center justify-center text-accent-deep group-open:bg-accent-gradient group-open:text-white group-open:border-transparent transition-colors">
                    <Plus className="w-4 h-4 group-open:rotate-45 transition-transform duration-300" />
                  </span>
                </summary>
                <div className="px-6 pb-6 -mt-1">
                  <p className="text-gray-600 leading-relaxed">{t(`home.faq_${n}_a`)}</p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal delay={360} className="text-center mt-10">
          <p className="text-gray-500 mb-4">{t('home.faq_more')}</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-accent-deep font-bold hover:text-ink-deep transition-colors group"
          >
            {t('home.faq_cta')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
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
        <div className="flex flex-col items-center justify-center p-2 text-center">
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
            <span className="text-xs sm:text-sm text-white/60 font-medium uppercase tracking-wide">{label}</span>
        </div>
    );
};

const FeatureCard = ({
    icon,
    title,
    description,
    delay = 0,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay?: number;
}) => (
    <Reveal delay={delay}>
        <div className="group h-full bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 motion-reduce:hover:translate-y-0 transition-all duration-300 ease-out cursor-default">
            <div className="w-14 h-14 bg-accent-gradient rounded-xl flex items-center justify-center mb-6 shadow-md shadow-accent-bright/20 group-hover:scale-105 motion-reduce:group-hover:scale-100 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-ink-deep mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    </Reveal>
);

const ListItem = ({ text }: { text: string }) => (
    <li className="flex items-center text-white/80">
        <span className="w-6 h-6 bg-accent/15 border border-accent/30 rounded-full flex items-center justify-center mr-3 text-accent flex-shrink-0">
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
