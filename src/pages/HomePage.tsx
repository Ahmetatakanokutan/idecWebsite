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
import Reveal, { type RevealFrom } from '../components/Reveal';
import SplitReveal from '../components/SplitReveal';
import SectionHeading from '../components/SectionHeading';
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

// "Bugunden 2053'e" gorsel cifti: soldaki bugunun yogun emisyonlu sanayisi,
// sagdaki hedef — temiz enerji. (Eskiden hero'daki turbin fotografi burada da
// tekrar ediyordu, ikinci gorsel de konuyla ilgisiz bir teleskop aynasiydi.)
const TECH_IMAGE_NOW =
  'https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=600';
const TECH_IMAGE_GOAL =
  'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=600';

/** Giris animasyonu sinifi: gorunurken yerinde, degilken `hidden` donusumuyle saydam. */
const enter = (visible: boolean, hidden: string) =>
  `transition-all duration-1000 ease-out-expo ${
    visible ? 'opacity-100 translate-x-0 translate-y-0 rotate-0 scale-100' : `opacity-0 ${hidden}`
  }`;
const delayStyle = (ms: number, reducedMotion: boolean) =>
  reducedMotion ? undefined : { transitionDelay: `${ms}ms` };

const HomePage = () => {
  const { t } = useTranslation();

  const heroReveal = useScrollReveal<HTMLDivElement>();
  const statsReveal = useScrollReveal<HTMLDivElement>();
  const howReveal = useScrollReveal<HTMLDivElement>();
  const ctaReveal = useScrollReveal<HTMLDivElement>();

  const heroIn = (hidden: string, ms: number, extra = '') => ({
    className: `${enter(heroReveal.isVisible, hidden)} ${extra}`,
    style: delayStyle(ms, heroReveal.reducedMotion),
  });

  // Hero basligi iki renkli; ikinci parca birincinin son kelimesinin hemen ardindan acilsin.
  const heroTitle1 = t('home.hero_main_title_part1');
  const heroTitle2 = t('home.hero_main_title_part2');
  const HERO_WORD_STAGGER = 90;
  const heroTitle2Delay = 150 + heroTitle1.split(/\s+/).length * HERO_WORD_STAGGER;

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
        {/* Hero — canli gradyan + nokta matrisi, hepsi tarayicida ciziliyor.
            Metin sutunu soldan, video cercevesi sagdan donerek gelir. */}
        <section className="relative overflow-hidden bg-ink-deep">
          <HeroBackdrop />

          <div
            ref={heroReveal.ref}
            className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-20"
          >
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Metin sütunu */}
              <div className="flex-1 max-w-2xl text-center lg:text-left">
                <div {...heroIn('-translate-x-10', 0)}>
                  <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/[0.14] backdrop-blur-md border border-white/[0.3] text-white text-sm font-semibold tracking-wide uppercase">
                    <span className="relative flex w-2 h-2">
                      <span className="absolute inline-flex w-full h-full rounded-full bg-accent animate-pulse-ring motion-reduce:animate-none" />
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-accent" />
                    </span>
                    <span>{t('home.shaping_future')}</span>
                  </div>
                </div>

                <h1
                  className="font-archivo font-bold text-white mb-8 leading-[1.05]"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
                >
                  <SplitReveal text={heroTitle1} active={heroReveal.isVisible} delay={150} stagger={HERO_WORD_STAGGER} />{' '}
                  <SplitReveal
                    text={heroTitle2}
                    active={heroReveal.isVisible}
                    delay={heroTitle2Delay}
                    stagger={HERO_WORD_STAGGER}
                    className="text-accent drop-shadow-[0_2px_20px_rgba(74,222,128,0.35)]"
                  />
                </h1>

                <p {...heroIn('-translate-x-10', 500, 'text-lg md:text-xl text-white/80 mb-10 leading-relaxed')}>
                  {t('home.hero_description_line1')}{' '}
                  <br className="hidden md:block" />
                  {t('home.hero_description_line2')}
                </p>

                <div {...heroIn('translate-y-6', 700, 'flex flex-col sm:flex-row justify-center lg:justify-start gap-4')}>
                  <Link
                    to="/courses"
                    className="group relative overflow-hidden bg-accent text-ink-deep px-8 py-4 rounded-lg hover:bg-white transition-colors duration-300 font-bold flex items-center justify-center shadow-lg shadow-accent/20 hover:shadow-xl"
                  >
                    {/* Hover'da butonun uzerinden gecen isik yansimasi */}
                    <span
                      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/50 blur-md translate-x-0 group-hover:translate-x-[450%] transition-transform duration-1000 ease-out-expo motion-reduce:hidden"
                      aria-hidden="true"
                    />
                    <span className="relative">{t('home.start_learning')}</span>
                    <PlayCircleIcon className="relative ml-2 w-5 h-5 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <Link
                    to="/about"
                    className="bg-white/[0.06] backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-lg hover:bg-white/[0.16] transition-colors duration-300 font-semibold flex items-center justify-center"
                  >
                    {t('home.hero_learn_project')}
                  </Link>
                </div>
              </div>

              {/* Görsel sütunu: HUD çerçevesi içinde dönen ambiyans videosu — sağdan dönerek gelir */}
              <div className="flex-1 flex justify-center lg:justify-end w-full">
                <div {...heroIn('translate-x-24 rotate-6', 350, 'w-full max-w-sm')}>
                  <div className="relative w-full">
                    {/* Çerçevenin arkasındaki yumuşak vurgu halesi */}
                    <div className="absolute -inset-4 rounded-[1.75rem] bg-accent/20 blur-2xl" />

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
          </div>

          {/* Hero altindaki cam serit: dort rakam tek bakista, sirayla asagidan */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div
              ref={statsReveal.ref}
              className={`rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.2] px-4 py-8 sm:px-8 ${enter(
                statsReveal.isVisible,
                'translate-y-8 scale-[0.98]'
              )}`}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { number: '400+', key: 1, icon: <Users className="w-5 h-5" />, ring: 'text-accent' },
                  { number: '30+', key: 2, icon: <BarChart3 className="w-5 h-5" />, ring: 'text-sky-bright' },
                  { number: '4', key: 3, icon: <Layers className="w-5 h-5" />, ring: 'text-accent' },
                  { number: '5', key: 4, icon: <Award className="w-5 h-5" />, ring: 'text-sky-bright' },
                ].map((stat, i) => (
                  <StatItem
                    key={stat.key}
                    number={stat.number}
                    label={t(`home.stat_item_${stat.key}_label`)}
                    icon={stat.icon}
                    ringClass={stat.ring}
                    active={statsReveal.isVisible}
                    reducedMotion={statsReveal.reducedMotion}
                    delay={200 + i * 130}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Akan konu şeridi — hero ile zincir arasında ince bir nefes */}
        <TopicTicker />

        {/* Nasıl Çalışır — dört adımlı zincir, koyu gece zemin.
            Bağlantı çizgisi soldan sağa çizilir, adımlar onu takip ederek soldan girer. */}
        <section className="relative bg-ink-night overflow-hidden py-28">
          {/* Zemine derinlik veren iki soluk isik lekesi */}
          <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-ink-mid/40 blur-3xl animate-float-slow motion-reduce:animate-none" />
          <div className="pointer-events-none absolute -bottom-32 right-1/5 w-[28rem] h-[28rem] rounded-full bg-ink-teal/25 blur-3xl animate-float motion-reduce:animate-none" />

          <div ref={howReveal.ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              tone="dark"
              eyebrow={t('home.how_eyebrow')}
              title={t('home.how_title')}
              description={t('home.how_desc')}
              className="mb-20"
            />

            <div className="relative">
              {/* Masaüstü: ikonların ortasından geçen yatay kesikli çizgi */}
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] pointer-events-none" aria-hidden="true">
                <div
                  className={`origin-left transition-transform duration-[1800ms] ease-out-expo ${
                    howReveal.isVisible ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={delayStyle(400, howReveal.reducedMotion)}
                >
                  <svg width="100%" height="2" preserveAspectRatio="none" className="block">
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
                </div>
                {/* Çizgi tamamlanınca üzerinde soldan sağa ilerleyen ışık darbesi */}
                {howReveal.isVisible && (
                  <span
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent opacity-0 shadow-[0_0_16px_4px_rgba(74,222,128,0.55)] animate-travel motion-reduce:hidden"
                    style={{ animationDelay: '2s' }}
                  />
                )}
              </div>

              {/* Mobil: ikonların ortasından inen dikey kesikli çizgi */}
              <div
                className="md:hidden absolute left-6 top-6 bottom-16 w-px -translate-x-1/2 pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(to bottom, rgba(74,222,128,0.45) 0 6px, transparent 6px 16px)',
                }}
              />

              <ol className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                {howSteps.map((step, index) => (
                  <Reveal as="li" key={step.key} from="left" delay={450 + index * 220} className="relative">
                    <div className="flex md:flex-col items-start md:items-center gap-5 md:gap-0 md:text-center">
                      {/* İkon çizginin üzerinde oturur; koyu zemin çizgiyi arkasında keser */}
                      <span className="relative z-10 flex-shrink-0 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 md:mb-6 rounded-full bg-ink-night text-accent">
                        <span className="flex items-center justify-center w-full h-full rounded-full bg-accent/10 border border-accent/40 shadow-[0_0_28px_rgba(74,222,128,0.18)]">
                          {step.icon}
                        </span>
                      </span>
                      <div>
                        <span className="block font-bold text-accent/80 text-xs tracking-[0.3em] mb-2">
                          {String(step.key).padStart(2, '0')}
                        </span>
                        <h3 className="text-xl font-bold text-white mb-3">{t(`home.how_step_${step.key}_title`)}</h3>
                        <p className="text-white/60 leading-relaxed text-[15px]">{t(`home.how_step_${step.key}_desc`)}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>

            <Reveal delay={1400} className="mt-16 text-center">
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

        {/* Üç temel ilke — açık (paper) zemin. Kartlar soldan, alttan ve sağdan gelir. */}
        <section id="about" className="bg-paper relative py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={t('home.vision_title_section')}
              title={t('home.vision_subtitle_section')}
              titleAccent={t('home.vision_main_title_section')}
              description={t('home.vision_description_section')}
              className="mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                from="left"
                delay={0}
                to="/about"
                icon={<Target className="w-7 h-7 text-white" />}
                title={t('home.feature_card_1_title')}
                description={t('home.feature_card_1_desc')}
              />
              <FeatureCard
                from="up"
                delay={150}
                to="/projects"
                icon={<Globe className="w-7 h-7 text-white" />}
                title={t('home.feature_card_2_title')}
                description={t('home.feature_card_2_desc')}
              />
              <FeatureCard
                from="right"
                delay={300}
                to="/courses"
                icon={<Users className="w-7 h-7 text-white" />}
                title={t('home.feature_card_3_title')}
                description={t('home.feature_card_3_desc')}
              />
            </div>
          </div>
        </section>

        {/* Bugünden 2053'e — koyu zemin. Metin soldan, "bugün / hedef" görsel çifti sağdan. */}
        <section className="relative py-28 bg-ink-night overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <SectionHeading
                  tone="dark"
                  align="left"
                  eyebrow={t('home.tech_eyebrow')}
                  title={t('home.tech_harmony_title')}
                />
                <Reveal from="left" delay={250}>
                  <p className="text-lg text-white/70 mb-8 leading-relaxed">{t('home.tech_harmony_desc')}</p>
                </Reveal>
                <ul className="space-y-4 mb-8">
                  {[1, 2, 3].map((n, i) => (
                    <Reveal as="li" key={n} from="left" delay={400 + i * 120}>
                      <ListItem text={t(`home.list_item_${n}`)} />
                    </Reveal>
                  ))}
                </ul>
                <Reveal from="left" delay={800}>
                  <Link
                    to="/about"
                    className="text-accent font-bold hover:text-white transition-colors inline-flex items-center group"
                  >
                    {t('home.read_more_about')} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Reveal>
              </div>
              <div className="lg:w-1/2 w-full relative">
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-accent/15 rounded-full blur-3xl" />
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <Reveal from="right" delay={150}>
                    <TechFigure
                      src={TECH_IMAGE_NOW}
                      caption={t('home.tech_img_now')}
                      dotClass="bg-amber-400"
                      className="mt-12"
                      grayscale
                    />
                  </Reveal>
                  <Reveal from="right" delay={350}>
                    <TechFigure src={TECH_IMAGE_GOAL} caption={t('home.tech_img_goal')} dotClass="bg-accent" />
                  </Reveal>
                </div>
                {/* İki görselin arasında "bugünden hedefe" oku */}
                {/* Konumlandirma dis katmanda: Reveal kendi transform'unu yazdigi icin
                    ortalama translate'i ayni elemanda olamaz. */}
                <div className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <Reveal from="scale" delay={650}>
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-ink-deep shadow-lg shadow-accent/30 ring-4 ring-ink-night">
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sık sorulanlar — açılır kapanır sorular, iki yandan sırayla */}
        <FaqSection />

        {/* Kapanış çağrısı — canlı gradyan, yavaşça kayan. Butonlar iki yandan buluşur. */}
        <section className="relative bg-ink-drift bg-[length:200%_200%] animate-drift motion-reduce:animate-none overflow-hidden">
          <div ref={ctaReveal.ref} className="relative z-10 max-w-4xl mx-auto px-4 py-28 text-center">
            <h2 className="font-archivo text-4xl md:text-5xl font-bold text-white mb-8">
              <SplitReveal text={t('home.cta_title')} active={ctaReveal.isVisible} />
            </h2>
            <p
              className={`text-xl text-white/80 mb-10 ${enter(ctaReveal.isVisible, 'translate-y-6')}`}
              style={delayStyle(350, ctaReveal.reducedMotion)}
            >
              {t('home.cta_description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className={`bg-accent text-ink-deep px-10 py-4 rounded-lg hover:bg-white font-bold shadow-lg shadow-black/10 ${enter(
                  ctaReveal.isVisible,
                  '-translate-x-16'
                )}`}
                style={delayStyle(550, ctaReveal.reducedMotion)}
              >
                {t('home.cta_contact')}
              </Link>
              <Link
                to="/register"
                className={`bg-white/[0.08] backdrop-blur-sm border border-white/30 text-white px-10 py-4 rounded-lg hover:bg-white/[0.18] font-bold ${enter(
                  ctaReveal.isVisible,
                  'translate-x-16'
                )}`}
                style={delayStyle(550, ctaReveal.reducedMotion)}
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
 * Uzerine gelince durur — okumak isteyen yakalayabilsin.
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
    <div className="group relative bg-paper border-y border-gray-200 overflow-hidden py-4">
      {/* Kenarlarda yumusak kaybolma */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent z-10" />

      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
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

/**
 * "Bugun / hedef" gorsellerinden biri. Alttaki cam etiket neyi temsil ettigini
 * soyler. `grayscale`: bugunun gorseli soluk baslar, uzerine gelince renklenir.
 */
const TechFigure = ({
  src,
  caption,
  dotClass,
  className = '',
  grayscale = false,
}: {
  src: string;
  caption: string;
  dotClass: string;
  className?: string;
  grayscale?: boolean;
}) => (
  <figure className={`group relative rounded-2xl overflow-hidden shadow-lg shadow-black/30 ${className}`}>
    <img
      src={src}
      alt={caption}
      loading="lazy"
      className={`w-full aspect-[4/5] object-cover transition-all duration-700 group-hover:scale-105 ${
        grayscale ? 'grayscale-[0.6] group-hover:grayscale-0' : ''
      }`}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-ink-night/70 via-transparent to-transparent" />
    <figcaption className="absolute left-3 right-3 bottom-3 flex items-center gap-2 rounded-lg bg-ink-night/60 backdrop-blur-md border border-white/15 px-3 py-2 text-xs font-semibold text-white">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
      {caption}
    </figcaption>
  </figure>
);

/**
 * Sik sorulanlar. Acilir kapanir kartlar; sorular iki yandan sirayla gelir.
 * <details>/<summary> kullaniliyor: klavye ve ekran okuyucu destegi tarayicidan
 * geliyor, JS ile ac/kapa mantigi yazmaya gerek kalmiyor.
 */
const FAQ_COUNT = 6;

const FaqSection = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-paper py-24 md:py-28 border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('home.faq_eyebrow')}
          title={t('home.faq_title')}
          description={t('home.faq_desc')}
          className="mb-14"
        />

        <div className="space-y-4">
          {Array.from({ length: FAQ_COUNT }, (_, i) => i + 1).map((n, i) => (
            <Reveal key={n} from={i % 2 === 0 ? 'left' : 'right'} delay={i * 90}>
              {/* Ilk soru acik gelsin: icerinde icerik oldugu bir bakista gorunsun */}
              <details
                open={n === 1}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm open:shadow-lg open:border-accent-bright/30 transition-all duration-300"
              >
                <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="text-lg font-bold text-ink-deep leading-snug">{t(`home.faq_${n}_q`)}</h3>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-bright/10 border border-accent-bright/25 flex items-center justify-center text-accent-deep group-open:bg-cta-gradient group-open:text-white group-open:border-transparent transition-colors">
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
    delay,
}: {
    number: string;
    label: string;
    icon: React.ReactNode;
    ringClass: string;
    active: boolean;
    reducedMotion: boolean;
    delay: number;
}) => {
    const match = number.match(/^(\d+)(.*)$/);
    const target = match ? parseInt(match[1], 10) : 0;
    const suffix = match ? match[2] : '';
    const displayValue = useCountUp(target, active, reducedMotion);
    const progress = active && target > 0 ? displayValue / target : 0;

    return (
        <div
            className={`flex flex-col items-center justify-center p-2 text-center ${enter(active, 'translate-y-6')}`}
            style={delayStyle(delay, reducedMotion)}
        >
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
            <span className="text-4xl font-extrabold text-white mb-1 tabular-nums">
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
    to,
    delay = 0,
    from = 'up',
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    /** Kart hover'da kalkiyordu ama hicbir yere gitmiyordu; artik ilgili sayfaya link. */
    to: string;
    delay?: number;
    from?: RevealFrom;
}) => (
    <Reveal delay={delay} from={from} className="h-full">
        <Link
            to={to}
            className="group relative block h-full overflow-hidden bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-accent-bright/30 motion-reduce:hover:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-deep transition-all duration-300 ease-out"
        >
            {/* Hover'da ustten soldan saga dolan vurgu cizgisi */}
            <span className="absolute inset-x-0 top-0 h-1 bg-accent-gradient origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out-expo" />
            <div className="w-14 h-14 bg-accent-gradient rounded-xl flex items-center justify-center mb-6 shadow-md shadow-accent-bright/20 group-hover:scale-105 group-hover:-rotate-6 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 transition-transform duration-500 ease-out-expo">
                {icon}
            </div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-ink-deep mb-3">
                {title}
                <ArrowRight className="w-5 h-5 text-accent-deep opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </Link>
    </Reveal>
);

const ListItem = ({ text }: { text: string }) => (
    <span className="flex items-center text-white/80">
        <span className="w-6 h-6 bg-accent/15 border border-accent/30 rounded-full flex items-center justify-center mr-3 text-accent flex-shrink-0">
            <Leaf className="w-3 h-3 fill-current" />
        </span>
        {text}
    </span>
);

// Missing Icon
const PlayCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
);

export default HomePage;
