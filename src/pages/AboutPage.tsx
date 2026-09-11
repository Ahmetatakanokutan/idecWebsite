import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowDown,
  Bot,
  Building2,
  Landmark,
  Library,
  GraduationCap,
  Handshake,
  Gauge,
  LineChart,
  TrendingDown,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Sprout,
} from 'lucide-react';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';
import SplitReveal from '../components/SplitReveal';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCountUp } from '../hooks/useCountUp';
import { openKarbonBot } from '../utils/karbonBot';
import { useTranslation } from 'react-i18next';

interface TeamMember {
  name: string;
  roleKey: string;
  image: string;
}

// Firmanin yolculugu: olcumden belgelendirmeye dort adim.
// `support` her adimi projenin hangi bileseninin destekledigini soyluyor —
// dort bilesen dort adima birebir dagiliyor, sema boylece IDEC-TT'ye ozgu oluyor.
const companyJourney = [
  { key: 1, icon: Gauge, support: 3 },        // Egitim Modulleri
  { key: 2, icon: LineChart, support: 1 },    // KarbonBot
  { key: 3, icon: TrendingDown, support: 4 }, // Mentorluk
  { key: 4, icon: FileCheck, support: 2 },    // Dijital Kutuphane
];

// Projenin dort bileseni ve tiklaninca gidecegi yer (kartlarda ve "Destek:" rozetlerinde ortak).
// Dijital Kutuphane'nin ayri bir sayfasi yok; ogrenme arsivi olarak webinar kayitlarina gidiyor
// (dersler zaten Egitim Modulleri'nde).
type ComponentTarget = { to?: string; bot?: true };
const components: { key: number; icon: typeof Bot; target: ComponentTarget }[] = [
  { key: 1, icon: Bot, target: { bot: true } },
  { key: 2, icon: Library, target: { to: '/courses?tab=webinars' } },
  { key: 3, icon: GraduationCap, target: { to: '/courses' } },
  { key: 4, icon: Handshake, target: { to: '/contact' } },
];
const componentTarget = (key: number) => components.find((c) => c.key === key)?.target ?? {};
const isActionable = (target: ComponentTarget) => Boolean(target.to || target.bot);

/** Hedefe gore Link, KarbonBot'u acan buton ya da duz kutu. */
const ComponentAction = ({
  target,
  className,
  children,
}: {
  target: ComponentTarget;
  className: string;
  children: React.ReactNode;
}) => {
  if (target.to) {
    return (
      <Link to={target.to} className={className}>
        {children}
      </Link>
    );
  }
  if (target.bot) {
    return (
      <button type="button" onClick={openKarbonBot} className={`${className} text-left`}>
        {children}
      </button>
    );
  }
  return <div className={className}>{children}</div>;
};

// TUIK Sera Gazi Emisyon Istatistikleri, 2024: toplam 584,5 Mt CO2 esdegeri.
// Sektorel paylar resmi bultendeki degerlerdir, yuvarlanmamistir.
const TR_TOTAL_MT = 584.5;
const TR_INVENTORY_YEAR = 2024;
const sectorShares = [
  { key: 'energy', value: 71.8 },
  { key: 'ippu', value: 12.9 },
  { key: 'agriculture', value: 12.6 },
  { key: 'waste', value: 2.6 },
];
// Cubuklar en buyuk paya gore olceklenir; enerjinin baskinligi gorunsun diye
// 100 degil 75 tavan kullaniliyor.
const SECTOR_MAX = 75;

// SKDM (CBAM) kapsamindaki alti urun grubu — AB Tuzugu 2023/956 ile belirlendi.
// `exposure` Turkiye'nin AB ihracatindaki agirligina dayanan niteliksel bir
// degerlendirmedir, sayisal bir pay degildir; kart altindaki not bunu soyluyor.
const cbamSectors = [
  { key: 'steel', exposure: 'high' },
  { key: 'aluminium', exposure: 'high' },
  { key: 'cement', exposure: 'high' },
  { key: 'fertiliser', exposure: 'mid' },
  { key: 'electricity', exposure: 'low' },
  { key: 'hydrogen', exposure: 'low' },
] as const;

const EXPOSURE_STYLES: Record<string, string> = {
  high: 'bg-accent/20 text-accent border-accent/40',
  mid: 'bg-sky-bright/15 text-sky-bright border-sky-bright/40',
  low: 'bg-white/10 text-white/60 border-white/20',
};

const AboutPage = () => {
  const { t } = useTranslation();

  const teamMembers: TeamMember[] = [
    {
      name: 'Doç. Dr. Ahmet Turan',
      roleKey: 'about.team_role_project_lead',
      image: 'https://myyu.yeditepe.edu.tr/sites/default/files/styles/272x272_image_style/public/pictures/2024-12/dscf5986-min_2_0.jpg?itok=LmeIF308'
    },
    {
      name: 'Dr. Öğr. Üyesi Zeliha Cansu Canbek',
      roleKey: 'about.team_role_project_coordinator',
      image: 'https://myyu.yeditepe.edu.tr/sites/default/files/styles/272x272_image_style/public/pictures/2025-08/personel.png?itok=BfQ2BK0J'
    },
    {
      name: 'Dr. Öğr. Üyesi Hatice Kübra Akben',
      roleKey: 'about.team_role_researcher',
      image: 'https://myyu.yeditepe.edu.tr/sites/default/files/styles/large/public/pictures/2025-08/hatice.png?itok=JIWPEKVV'
    },
    {
      name: 'Prof. Dr. Emine Şule Aydeniz',
      roleKey: 'about.team_role_researcher',
      image: 'https://myyu.yeditepe.edu.tr/sites/default/files/styles/large/public/pictures/2024-07/sule_aydeniz_0.jpg?itok=81SOJlnY'
    },
    {
      name: 'Doç. Dr. Dionysis Goularas',
      roleKey: 'about.team_role_researcher',
      image: 'https://myyu.yeditepe.edu.tr/sites/default/files/styles/large/public/pictures/2024-12/dionysis_goularas_cse_kare.jpg?itok=qofg-l91'
    },
    {
      name: 'Aleyna İşler',
      roleKey: 'about.team_role_specialist',
      image: 'https://i1.rgstatic.net/ii/profile.image/11431281474101642-1748553486405_Q512/Aleyna-Isler.jpg'
    },
    {
      name: 'Ahmet Atakan Okutan',
      roleKey: 'about.team_role_specialist',
      image: 'https://drive.google.com/thumbnail?id=1WwjDUcthm5mvo8MYBeiWM9yI_hJVSH__&sz=w1000'
    }
  ];

  return (
    <Layout>
      <div className="font-archivo">
        {/* 1) Giriş bandı — canlı gradyan, yavaşça kayan */}
        <section className="relative overflow-hidden bg-ink-drift bg-[length:200%_200%] animate-drift motion-reduce:animate-none">
          <div className="pointer-events-none absolute -top-24 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-float-slow motion-reduce:animate-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-28">
            <div className="max-w-3xl">
              <Reveal from="left">
                <p className="text-accent text-sm font-bold tracking-[0.2em] uppercase mb-4">
                  {t('about.hero_eyebrow')}
                </p>
              </Reveal>
              <h1 className="font-archivo text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.08]">
                <SplitReveal text={t('about.title')} delay={120} />
              </h1>
              <Reveal from="left" delay={350}>
                <p className="text-lg md:text-xl text-white/75 leading-relaxed">{t('about.subtitle')}</p>
              </Reveal>
            </div>

            {/* Künye: destekleyen, yürütücü, alan, süre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
              {[
                { icon: Landmark, labelKey: 'about.fact_1_label', valueKey: 'about.fact_1_value' },
                { icon: Building2, labelKey: 'about.fact_2_label', valueKey: 'about.fact_2_value' },
                { icon: Sprout, labelKey: 'about.fact_3_label', valueKey: 'about.fact_3_value' },
                { icon: Cpu, labelKey: 'about.fact_4_label', valueKey: 'about.fact_4_value' },
              ].map((fact, i) => (
                <Reveal key={fact.labelKey} from="right" delay={450 + i * 120} className="h-full">
                  <div className="h-full rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/[0.18] p-5">
                    <fact.icon className="w-5 h-5 text-accent mb-3" />
                    <p className="text-[11px] uppercase tracking-widest text-white/50 font-bold mb-1">
                      {t(fact.labelKey)}
                    </p>
                    <p className="text-white font-semibold leading-snug">{t(fact.valueKey)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 2) Vizyon + ikiz dönüşüm şeması */}
        <section className="bg-paper py-24 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <Reveal from="left" className="lg:w-1/2">
                <p className="text-accent-deep text-sm font-bold tracking-[0.2em] uppercase mb-3">
                  {t('about.project_vision_title')}
                </p>
                <h2 className="font-archivo text-3xl md:text-4xl font-bold text-ink-deep mb-6 leading-tight">
                  {t('about.vision_headline')}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">{t('about.project_vision_desc_1')}</p>
                <p className="text-gray-700 text-lg leading-relaxed">{t('about.project_vision_desc_2')}</p>
              </Reveal>

              <Reveal from="right" delay={180} className="lg:w-1/2 w-full">
                <TwinTransitionDiagram />
              </Reveal>
            </div>
          </div>
        </section>

        {/* 3) Firmanın yolculuğu — dört adımlı zincir */}
        <CompanyJourneySection />

        {/* 4) Problem → Çözüm eşleşmesi */}
        <section className="bg-paper py-24 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-16">
              <p className="text-accent-deep text-sm font-bold tracking-[0.2em] uppercase mb-3">
                {t('about.mapping_eyebrow')}
              </p>
              <h2 className="font-archivo text-3xl md:text-5xl font-bold text-ink-deep mb-5">
                {t('about.mapping_title')}
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t('about.mapping_desc')}</p>
            </Reveal>

            {/* Sütun başlıkları */}
            <div className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-6 mb-6 items-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500/80">
                {t('about.problems_title')}
              </p>
              <span className="w-10" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-deep">
                {t('about.solutions_title')}
              </p>
            </div>

            {/* Her satırda problem soldan, çözüm sağdan gelip ortadaki okta buluşur */}
            <div className="space-y-5">
              {[1, 2, 3, 4].map((n, i) => (
                <div key={n} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch">
                  {/* Problem */}
                  <Reveal from="left" delay={i * 120} className="h-full">
                    <div className="h-full rounded-2xl border border-red-100 bg-red-50/60 p-6 flex gap-4">
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 leading-relaxed">{t(`about.problem_${n}`)}</p>
                    </div>
                  </Reveal>

                  {/* Ok */}
                  <Reveal from="scale" delay={i * 120 + 250} className="flex items-center justify-center">
                    <span className="w-10 h-10 rounded-full bg-ink-deep text-white flex items-center justify-center shadow-md">
                      <ArrowRight className="w-5 h-5 hidden md:block" />
                      <ArrowDown className="w-5 h-5 md:hidden" />
                    </span>
                  </Reveal>

                  {/* Çözüm */}
                  <Reveal from="right" delay={i * 120 + 120} className="h-full">
                    <div className="h-full rounded-2xl border border-accent-bright/25 bg-accent-bright/[0.07] p-6 flex gap-4">
                      <CheckCircle2 className="w-5 h-5 text-accent-deep flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-ink-deep mb-1">{t(`about.solution_${n}_title`)}</h3>
                        <p className="text-gray-600 leading-relaxed text-[15px]">{t(`about.solution_${n}_desc`)}</p>
                      </div>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5) Neden şimdi? — sektörel pay grafiği + SKDM zaman çizelgesi */}
        <WhyNowSection />

        {/* 6) Proje bileşenleri */}
        <section className="bg-paper py-24 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-16">
              <p className="text-accent-deep text-sm font-bold tracking-[0.2em] uppercase mb-3">
                {t('about.components_eyebrow')}
              </p>
              <h2 className="font-archivo text-3xl md:text-5xl font-bold text-ink-deep mb-5">
                {t('about.components_title')}
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t('about.components_desc')}</p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {components.map((c, i) => {
                const actionable = isActionable(c.target);
                return (
                  <Reveal key={c.key} delay={i * 110} className="h-full">
                    {/* Sadece bir yere giden kartlar hover'da kalkar ve ok gosterir */}
                    <ComponentAction
                      target={c.target}
                      className={`group block w-full h-full rounded-2xl border border-gray-100 bg-paper p-7 shadow-sm transition-all duration-300 ${
                        actionable
                          ? 'hover:shadow-xl hover:-translate-y-1 hover:border-accent-bright/40 motion-reduce:hover:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-deep'
                          : ''
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-accent-gradient flex items-center justify-center mb-5 shadow-md shadow-accent-bright/20 group-hover:scale-105 motion-reduce:group-hover:scale-100 transition-transform">
                        <c.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="flex items-center gap-2 text-lg font-bold text-ink-deep mb-2">
                        {t(`about.component_${c.key}_title`)}
                        {actionable && (
                          <ArrowRight className="w-4 h-4 text-accent-deep opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        )}
                      </h3>
                      <p className="text-gray-600 text-[15px] leading-relaxed">{t(`about.component_${c.key}_desc`)}</p>
                    </ComponentAction>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7) Ekibimiz */}
        <section className="bg-paper py-24 md:py-28 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14">
              <p className="text-accent-deep text-sm font-bold tracking-[0.2em] uppercase mb-3">
                {t('about.team_eyebrow')}
              </p>
              <h2 className="font-archivo text-3xl md:text-5xl font-bold text-ink-deep mb-5">
                {t('about.team_title')}
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t('about.team_subtitle')}</p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, i) => (
                <Reveal key={member.name} delay={(i % 4) * 100}>
                  <article className="group h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="h-72 bg-gray-100 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 motion-reduce:group-hover:scale-100 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-ink-deep">{member.name}</h3>
                      <p className="text-sm text-accent-deep mt-1 font-medium">{t(member.roleKey)}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 8) Kapanış */}
        <section className="relative overflow-hidden bg-ink-gradient py-24">
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <Reveal>
              <h2 className="font-archivo text-3xl md:text-4xl font-bold text-white mb-6">
                {t('about.closing_title')}
              </h2>
              <p className="text-lg text-white/70 mb-10">{t('about.closing_desc')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-accent text-ink-deep px-8 py-4 rounded-lg font-bold hover:bg-white transition-colors shadow-lg shadow-accent/20"
                >
                  {t('about.closing_cta_contact')}
                </Link>
                <Link
                  to="/courses"
                  className="bg-white/[0.08] backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/[0.18] transition-colors"
                >
                  {t('about.closing_cta_courses')}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </Layout>
  );
};

/**
 * Ikiz donusum semasi: kesisen iki daire (dijital + yesil), kesisimde proje.
 * Saf CSS — daireler yari saydam, ust uste bindiginde ortak alan koyulasiyor.
 */
const TwinTransitionDiagram = () => {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto w-full max-w-md aspect-square">
      {/* Arka plan halkası */}
      <div className="absolute inset-0 rounded-full border border-gray-200/80" />

      {/* Dijital dönüşüm — konumlandirma disarida, animasyon iceride:
          animate-* kendi transform'unu yazdigi icin ikisi ayni elemanda olamaz. */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[62%] aspect-square">
        <div className="w-full h-full rounded-full bg-ink-mid/25 border-2 border-ink-mid/40 flex items-start justify-start p-7 animate-float-slow motion-reduce:animate-none">
          <div className="max-w-[7rem]">
            <Cpu className="w-6 h-6 text-ink-mid mb-2" />
            <p className="text-ink-deep font-bold leading-tight">{t('about.twin_digital')}</p>
          </div>
        </div>
      </div>

      {/* Yeşil dönüşüm */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[62%] aspect-square">
        <div className="w-full h-full rounded-full bg-accent-bright/25 border-2 border-accent-bright/45 flex items-end justify-end p-7 text-right animate-float motion-reduce:animate-none">
          <div className="max-w-[7rem]">
            <Sprout className="w-6 h-6 text-accent-deep mb-2 ml-auto" />
            <p className="text-ink-deep font-bold leading-tight">{t('about.twin_green')}</p>
          </div>
        </div>
      </div>

      {/* Kesişim: IDEC-TT */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-[26%]">
        <p className="text-[10px] uppercase tracking-[0.15em] text-ink-deep/60 font-bold mb-1 leading-tight">
          {t('about.twin_center_label')}
        </p>
        <p className="font-archivo text-xl md:text-2xl font-extrabold text-ink-deep leading-none">IDEC-TT</p>
      </div>
    </div>
  );
};

/**
 * Firmanin yolculugu: olcum -> analiz -> azaltim -> belgelendirme.
 * Her adimin altinda o adimi destekleyen proje bileseni yaziyor.
 */
const CompanyJourneySection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-ink-night py-24 md:py-28 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-ink-mid/30 blur-3xl animate-float-slow motion-reduce:animate-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-20">
          <p className="text-accent text-sm font-bold tracking-[0.2em] uppercase mb-3">
            {t('about.journey_eyebrow')}
          </p>
          <h2 className="font-archivo text-3xl md:text-5xl font-bold text-white mb-5">
            {t('about.journey_title')}
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">{t('about.journey_desc')}</p>
        </Reveal>

        <div className="relative">
          {/* Masaüstü bağlantı çizgisi — halkaların tam ortasından geçer */}
          <div className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] pointer-events-none">
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
          </div>

          {/* Mobil dikey çizgi */}
          <div
            className="md:hidden absolute left-7 top-10 bottom-16 w-px pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(to bottom, rgba(74,222,128,0.45) 0 6px, transparent 6px 16px)',
            }}
          />

          <ol className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            {companyJourney.map((step, i) => (
              <Reveal as="li" key={step.key} from="left" delay={i * 200} className="h-full">
                {/* Masaüstü */}
                <div className="hidden md:flex flex-col items-center text-center h-full">
                  <span className="relative flex items-center justify-center w-28 h-28 rounded-full bg-ink-night border-2 border-accent/40 mb-5">
                    <span className="absolute inset-0 rounded-full bg-accent/15 animate-pulse-ring motion-reduce:animate-none" />
                    <step.icon className="relative w-10 h-10 text-accent" strokeWidth={1.6} />
                  </span>
                  <span className="text-xs font-bold tracking-[0.3em] text-white/40 mb-2">
                    {String(step.key).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">{t(`about.journey_step_${step.key}_title`)}</h3>
                  <p className="text-white/60 text-[15px] leading-relaxed max-w-[15rem] mb-4 flex-grow">
                    {t(`about.journey_step_${step.key}_desc`)}
                  </p>
                  <SupportChip
                    label={t('about.journey_support_label')}
                    value={t(`about.component_${step.support}_title`)}
                    target={componentTarget(step.support)}
                  />
                </div>

                {/* Mobil */}
                <div className="md:hidden flex items-start gap-5">
                  <span className="relative flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-ink-night border-2 border-accent/40">
                    <step.icon className="w-6 h-6 text-accent" strokeWidth={1.6} />
                  </span>
                  <div>
                    <span className="block text-xs font-bold tracking-[0.3em] text-white/40 mb-1.5">
                      {String(step.key).padStart(2, '0')}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-1.5">
                      {t(`about.journey_step_${step.key}_title`)}
                    </h3>
                    <p className="text-white/60 text-[15px] leading-relaxed mb-3">
                      {t(`about.journey_step_${step.key}_desc`)}
                    </p>
                    <SupportChip
                      label={t('about.journey_support_label')}
                      value={t(`about.component_${step.support}_title`)}
                      target={componentTarget(step.support)}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

/** Adimin altindaki kucuk etiket: bu adimi projenin hangi bileseni destekliyor. */
/** "Destek: <bilesen>" rozeti. Bileseni bir yere gidiyorsa rozet de oraya goturur. */
const SupportChip = ({ label, value, target }: { label: string; value: string; target: ComponentTarget }) => {
  const actionable = isActionable(target);
  return (
    <ComponentAction
      target={target}
      className={`inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs transition-colors ${
        actionable ? 'hover:bg-accent/20 hover:border-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent' : ''
      }`}
    >
      <span className="text-white/60">{label}</span>
      <span className="font-semibold text-accent">{value}</span>
      {actionable && <ArrowRight className="w-3 h-3 text-accent" aria-hidden="true" />}
    </ComponentAction>
  );
};

/**
 * "Neden simdi?" — uc parca:
 *   1. Turkiye'nin toplam emisyonu (TUIK) buyuk rakam olarak,
 *   2. solda sektorel dagilim cubuklari, sagda SKDM takvimi,
 *   3. altta SKDM kapsamindaki alti urun grubu.
 * Butun sayilar resmi kaynaktan geliyor; her kartin altinda kaynagi yaziyor.
 */
const WhyNowSection = () => {
  const { t } = useTranslation();
  const { ref, isVisible, reducedMotion } = useScrollReveal<HTMLDivElement>();
  const totalShown = useCountUp(TR_TOTAL_MT, isVisible, reducedMotion, 1800, 1);

  return (
    <section className="relative overflow-hidden bg-ink-night py-24 md:py-28">
      <div className="pointer-events-none absolute -bottom-32 -left-24 w-[30rem] h-[30rem] rounded-full bg-ink-mid/30 blur-3xl animate-float-slow motion-reduce:animate-none" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-14">
          <p className="text-accent text-sm font-bold tracking-[0.2em] uppercase mb-3">{t('about.why_eyebrow')}</p>
          <h2 className="font-archivo text-3xl md:text-5xl font-bold text-white mb-5">{t('about.why_title')}</h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">{t('about.why_desc')}</p>
        </Reveal>

        {/* Tek bakışta Türkiye'nin toplam emisyonu */}
        <Reveal className="mb-10">
          <div className="rounded-2xl bg-accent/[0.08] border border-accent/25 px-7 py-8 text-center">
            <p className="text-5xl md:text-6xl font-extrabold text-accent tabular-nums leading-none mb-3">
              {totalShown.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              <span className="text-2xl md:text-3xl ml-2 align-middle">Mt CO₂e</span>
            </p>
            <p className="text-white/70 max-w-2xl mx-auto">
              {t('about.total_caption', { year: TR_INVENTORY_YEAR })}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sektörel pay grafiği */}
          <Reveal from="left">
            <div className="h-full rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/[0.14] p-7 md:p-9">
              <h3 className="text-white font-bold text-xl mb-1">{t('about.chart_title')}</h3>
              <p className="text-white/50 text-sm mb-8">{t('about.chart_subtitle')}</p>

              <div className="space-y-6">
                {sectorShares.map((sector, i) => (
                  <SectorBar
                    key={sector.key}
                    label={t(`about.sector_${sector.key}`)}
                    value={sector.value}
                    max={SECTOR_MAX}
                    highlight={sector.key === 'ippu'}
                    active={isVisible}
                    reducedMotion={reducedMotion}
                    delay={i * 160}
                  />
                ))}
              </div>

              <p className="text-white/40 text-xs mt-8 leading-relaxed">{t('about.chart_source')}</p>
            </div>
          </Reveal>

          {/* SKDM takvimi */}
          <Reveal from="right" delay={180}>
            <div className="h-full rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/[0.14] p-7 md:p-9">
              <h3 className="text-white font-bold text-xl mb-1">{t('about.cbam_title')}</h3>
              <p className="text-white/50 text-sm mb-8">{t('about.cbam_subtitle')}</p>

              <ol className="relative border-l border-white/20 pl-7 space-y-8">
                {[1, 2, 3].map((n, i) => (
                  <li key={n} className="relative">
                    <span className="absolute -left-[35px] top-1 flex items-center justify-center w-4 h-4">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          n === 3 ? 'bg-accent' : 'bg-white/40'
                        }`}
                      />
                      {n === 3 && (
                        <span className="absolute inset-0 rounded-full bg-accent/40 animate-pulse-ring motion-reduce:animate-none" />
                      )}
                    </span>
                    <Reveal from="right" delay={i * 140}>
                      <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-1">
                        {t(`about.cbam_step_${n}_period`)}
                      </p>
                      <p className="text-white font-semibold mb-1">{t(`about.cbam_step_${n}_title`)}</p>
                      <p className="text-white/60 text-[15px] leading-relaxed">{t(`about.cbam_step_${n}_desc`)}</p>
                    </Reveal>
                  </li>
                ))}
              </ol>

              <p className="text-white/40 text-xs mt-8 leading-relaxed">{t('about.cbam_source')}</p>
            </div>
          </Reveal>
        </div>

        {/* SKDM kapsamındaki altı ürün grubu */}
        <Reveal delay={120} className="mt-8">
          <div className="rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/[0.14] p-7 md:p-9">
            <h3 className="text-white font-bold text-xl mb-1">{t('about.scope_title')}</h3>
            <p className="text-white/50 text-sm mb-8">{t('about.scope_subtitle')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cbamSectors.map((sector, i) => (
                <Reveal key={sector.key} delay={i * 90}>
                  <div className="h-full rounded-xl bg-white/[0.04] border border-white/10 p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-white font-semibold">{t(`about.scope_${sector.key}_name`)}</h4>
                      <span
                        className={`flex-shrink-0 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                          EXPOSURE_STYLES[sector.exposure]
                        }`}
                      >
                        {t(`about.exposure_${sector.exposure}`)}
                      </span>
                    </div>
                    <p className="text-white/55 text-sm leading-relaxed">{t(`about.scope_${sector.key}_desc`)}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <p className="text-white/40 text-xs mt-8 leading-relaxed">{t('about.scope_source')}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/**
 * Tek bir sektor cubugu: genislik gorunur olunca dolar, yuzde sayarak artar.
 * `highlight` verilen cubuk (endustriyel islemler) vurgu rengiyle cizilir —
 * projenin ilgilendigi dilim o.
 */
const SectorBar = ({
  label,
  value,
  max,
  active,
  reducedMotion,
  delay,
  highlight = false,
}: {
  label: string;
  value: number;
  max: number;
  active: boolean;
  reducedMotion: boolean;
  delay: number;
  highlight?: boolean;
}) => {
  const shown = useCountUp(value, active, reducedMotion, 1600, 1);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <span className={highlight ? 'text-white font-semibold' : 'text-white/75'}>{label}</span>
        <span
          className={`text-2xl font-extrabold tabular-nums ${
            highlight ? 'text-accent' : 'text-white/70'
          }`}
        >
          %{shown.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-[1600ms] ease-out ${
            highlight ? 'bg-gradient-to-r from-accent-bright to-accent' : 'bg-sky-bright/60'
          }`}
          style={{
            width: active ? `${(value / max) * 100}%` : '0%',
            transitionDelay: reducedMotion ? '0ms' : `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
};

export default AboutPage;
