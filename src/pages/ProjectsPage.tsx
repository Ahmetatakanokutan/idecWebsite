import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { useTranslation } from 'react-i18next';

interface Organization {
  name: string;
  image: string;
  website?: string;
}

const projectPartners: Organization[] = [
  {
    name: 'TALSAD',
    image: 'https://yt3.googleusercontent.com/ytc/AIdro_loFHTG_bV5O1BpsUpnBMhVDJJ20E82kfXF44DnGXfMoUY=s900-c-k-c0x00ffffff-no-rj',
    website: 'https://talsad.org.tr/',
  },
  {
    name: 'Türkiye İhracatçılar Meclisi',
    image: 'https://tim.org.tr/files/images/content/logolar/tim_logotype.png',
    website: 'https://tim.org.tr',
  },
  {
    name: 'TÜDÖKSAD',
    image: 'https://denizmetaldokum.com/wp-content/uploads/tudoksad-aluminum-recycling.webp',
    website: 'https://tudoksad.org.tr/',
  },
];

const participants: Organization[] = [
  { name: 'Türkiye Çelik Üreticileri Derneği', image: 'https://celik.org.tr/celik_image.jpg', website: 'https://celik.org.tr/tr' },
  { name: 'Mesa Makina Döküm Gıda Sanayi ve Ticaret A.Ş.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6GBj-EBk49BM0hCXS6ttfbXV0uELNQSJweQ&s', website: 'https://www.mesamakina.com.tr/' },
  { name: 'Some Carbon Enerji ve Karbon Teknolojileri Sanayi Ticaret A.Ş.', image: 'https://someco2.com/wp-content/uploads/2024/02/some-carbon-koyu-renk-logo-seffaf-arka-plan-300x169.jpg', website: 'https://someco2.com/' },
  { name: 'Metallic Mühendislik Çözümleri Sanayi Ticaret A.Ş.', image: 'https://media.licdn.com/dms/image/v2/D4D0BAQGZ4gvuI0EbxA/company-logo_200_200/company-logo_200_200/0/1710422963628/metallic_engineering_solution_logo?e=2147483647&v=beta&t=MrLisHFqnzNCV6lTFwQFQ_sgjo9ZUMVHOL_jqIRlpXc', website: 'https://metallicco.com/' },
  { name: 'Silvan Sanayi A.Ş.', image: 'https://media.licdn.com/dms/image/v2/C4E0BAQGPBr57q0KOLQ/company-logo_200_200/company-logo_200_200/0/1648540604101?e=2147483647&v=beta&t=LsqhmPihj05J6OJROmpVtOL4X5vGykDAGyWI-NV97Zg', website: 'https://www.silvansanayi.com/tr' },
  { name: 'Eti Krom A.Ş.', image: 'https://static.flashintel.ai/image/a/d/8/ad8ef5021b003e1789ff52f437615482.jpeg', website: 'https://www.etikrom.com/' },
  { name: 'Alpomet Mühendislik Danışmanlık Yazılım İmalat Sanayi ve Ticaret Ltd. Şti.', image: 'https://www.sahaistanbul.org.tr/imgs/300x200x2/Alpomet_KYrmYzY_Siyah_Yan_yana.png', website: 'https://www.alpomet.com/' },
  { name: 'TRXAL Mühendislik A.Ş.', image: 'https://trxal.com/wp-content/uploads/2024/07/cropped-TRXAL-Logo-Final-TR.png', website: 'https://trxal.com/' },
  { name: 'Nanografi Nanoteknoloji A.Ş.', image: 'https://www.sasad.org.tr/storage/posts/9gYGzI0ExaTHJSAe1TyzD5EHwSoYv40Bmgx3vQL1.png', website: 'https://nanografi.com/tr/' },
  { name: 'Yurtbay Seramik San. ve Tic. A.Ş.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Ct09On7RuWq8v1Wgd2Mz3w1RXGxXTbakGQ&s', website: 'https://www.yurtbayseramik.com/tr' },
  { name: 'Konverta Geri Dönüşüm A.Ş.', image: 'https://media.licdn.com/dms/image/v2/C4D0BAQEPj4TcRrdZHw/company-logo_200_200/company-logo_200_200/0/1633433994935?e=2147483647&v=beta&t=PqVQWzV3qAKTFnM0fhtuTEidgPLRFgqoG3GxDhzSBNM', website: 'https://www.konverta.com.tr/?lang=tr' },
  { name: 'Aydöküm Makina Sanayi ve Ticaret A.Ş.', image: 'https://media.licdn.com/dms/image/v2/D4D0BAQHhOVJBQt7CfA/company-logo_200_200/company-logo_200_200/0/1718182550110/ay_dokum_logo?e=2147483647&v=beta&t=GQrtgduj_ozm458qaCr8BJyewqbAnV4XCFRT4KakgYo', website: 'https://aydokum.com/' },
  { name: 'Gedik İleri Döküm Teknolojileri San. ve Tic. A.Ş.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDG3IMNHesEn9g00bffCwgq7caBDW6azxqIg&s', website: 'https://gedik.com.tr/dokum' },
  { name: 'Türkiye Çimento Sanayicileri Birliği (TÜRKÇİMENTO)', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6B5FcWOIBeHomSlk5OM2Uc8kYYlAKCS7qsA&s', website: 'https://www.turkcimento.org.tr/' },
  { name: 'Akcoat İleri Kimyasal Kaplama Malzemeleri Sanayi ve Ticaret A.Ş.', image: 'https://static.akcoat.com/media/site_settings/meta_image_16_9.jpg?v=130324053144', website: 'https://akcoat.com/tr' },
  { name: 'Kavi Entegre Plastik Sanayi Ticaret A.Ş.', image: 'https://www.kavientegre.com.tr/images/yeni-renkler-Logo.png?rand=9a07', website: 'https://www.kavientegre.com.tr/' },
  { name: 'Ma-Pa Makina Parçaları Endüstrisi A.Ş.', image: 'https://taysad.org.tr/Uploads/UyeLogo/mapaautomotive.jpg', website: 'https://www.mapa.com.tr/' },
];

const fitContainParticipants = new Set([
  'Türkiye Çelik Üreticileri Derneği',
  'Kavi Entegre Plastik Sanayi Ticaret A.Ş.',
  'Konverta Geri Dönüşüm A.Ş.',
  'TRXAL Mühendislik A.Ş.',
  'Aydöküm Makina Sanayi ve Ticaret A.Ş.',
  'Ma-Pa Makina Parçaları Endüstrisi A.Ş.',
]);

const fallbackAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ECFDF5&color=065F46&bold=true&size=256`;

const LogoImage = ({ name, src, className }: { name: string; src: string; className: string }) => (
  <img
    src={src}
    alt={name}
    loading="lazy"
    className={className}
    onError={(event) => {
      const target = event.currentTarget;
      if (target.dataset.fallbackApplied === 'true') {
        return;
      }
      target.dataset.fallbackApplied = 'true';
      target.src = fallbackAvatar(name);
    }}
  />
);

const ProjectsPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="font-archivo">
        <PageHero
          eyebrow={t('projects.hero_eyebrow')}
          title={t('projects.title')}
          description={t('projects.subtitle')}
        />

        {/* Proje ortakları */}
        <section className="bg-white py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t('projects.project_partners_title')}
              count={`${projectPartners.length} ${t('projects.org_count_label')}`}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projectPartners.map((partner, i) => {
                const isTalsad = partner.name === 'TALSAD';
                const card = (
                  <article className="group h-full bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 hover:border-accent-bright/40 motion-reduce:hover:translate-y-0 transition-all duration-300">
                    <div
                      className={`h-40 bg-paper rounded-xl flex items-center justify-center mb-4 ${
                        isTalsad ? 'p-0 overflow-hidden' : 'p-6'
                      }`}
                    >
                      <LogoImage
                        name={partner.name}
                        src={partner.image}
                        className={isTalsad ? 'h-full w-full object-cover' : 'max-h-28 max-w-full object-contain'}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-ink-deep text-center leading-snug">{partner.name}</h3>
                  </article>
                );

                return (
                  <Reveal key={partner.name} delay={i * 100} className="h-full">
                    {partner.website ? (
                      <a href={partner.website} target="_blank" rel="noreferrer" className="block h-full">
                        {card}
                      </a>
                    ) : (
                      card
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Proje iştirakçileri */}
        <section className="bg-paper py-20 md:py-24 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t('projects.project_participants_title')}
              count={`${participants.length} ${t('projects.org_count_label')}`}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {participants.map((participant, i) => {
                const shouldContain = fitContainParticipants.has(participant.name);

                return (
                  <Reveal key={participant.name} delay={(i % 5) * 80} className="h-full">
                    <a
                      href={participant.website || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="block h-full"
                    >
                      <article className="h-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-accent-bright/40 motion-reduce:hover:translate-y-0 transition-all duration-300">
                        <div className="h-28 rounded-lg overflow-hidden mb-3">
                          <LogoImage
                            name={participant.name}
                            src={participant.image}
                            className={
                              shouldContain
                                ? 'h-full w-full object-contain object-center p-1'
                                : 'h-full w-full object-cover object-center'
                            }
                          />
                        </div>
                        <h3 className="text-[13px] leading-5 font-medium text-gray-700 line-clamp-3">
                          {participant.name}
                        </h3>
                      </article>
                    </a>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

/** Bolum basligi + sagda kurum sayisi rozeti. */
const SectionHeading = ({ title, count }: { title: string; count: string }) => (
  <Reveal className="flex flex-wrap items-center justify-between gap-4 mb-8">
    <h2 className="font-archivo text-2xl md:text-3xl font-bold text-ink-deep">{title}</h2>
    <span className="text-sm font-bold text-accent-deep bg-accent-bright/10 border border-accent-bright/25 px-4 py-1.5 rounded-full">
      {count}
    </span>
  </Reveal>
);

export default ProjectsPage;
