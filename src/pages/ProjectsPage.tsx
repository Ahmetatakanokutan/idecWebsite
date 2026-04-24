import Layout from '../components/Layout';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('projects.title')}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('projects.subtitle')}</p>
        </div>

        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-900">{t('projects.project_partners_title')}</h2>
            <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              {projectPartners.length} {t('projects.org_count_label')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectPartners.map((partner) => {
              const isTalsad = partner.name === 'TALSAD';
              const card = (
                <article className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full hover:shadow-md transition-shadow">
                  <div className={`h-40 bg-gray-50 rounded-xl flex items-center justify-center mb-4 ${isTalsad ? 'p-0 overflow-hidden' : 'p-6'}`}>
                    <LogoImage
                      name={partner.name}
                      src={partner.image}
                      className={isTalsad ? 'h-full w-full object-cover' : 'max-h-28 max-w-full object-contain'}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 text-center leading-snug">{partner.name}</h3>
                </article>
              );

              if (!partner.website) {
                return <div key={partner.name}>{card}</div>;
              }

              return (
                <a
                  key={partner.name}
                  href={partner.website}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  {card}
                </a>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-900">{t('projects.project_participants_title')}</h2>
            <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              {participants.length} {t('projects.org_count_label')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {participants.map((participant) => {
              const shouldContain = fitContainParticipants.has(participant.name);
              const card = (
                <article className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow h-full">
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
                  <h3 className="text-[13px] leading-5 font-medium text-gray-800 line-clamp-3">{participant.name}</h3>
                </article>
              );

              return (
                <a
                  key={participant.name}
                  href={participant.website || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  {card}
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProjectsPage;
