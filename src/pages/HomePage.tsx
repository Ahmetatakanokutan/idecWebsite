import { Link } from 'react-router-dom';
import { Target, Users, Globe } from 'lucide-react';
import Layout from '../components/Layout';

const HomePage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              IDEC-TT
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Sürdürülebilir Gelecek İçin Karbonsuzlaştırma Projesi
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8">
              Türkiye'nin iklim hedeflerine ulaşması için yenilikçi teknolojiler ve sürdürülebilir 
              çözümlerle karbonsuzlaştırma sürecini destekliyoruz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/projects"
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Projelerimizi Keşfedin
              </Link>
              <Link 
                to="/about"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Daha Fazla Bilgi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Neden IDEC-TT?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Karbonsuzlaştırma hedeflerimize ulaşmak için çok boyutlu yaklaşım benimsiyor, 
              teknoloji ve sürdürülebilirliği bir araya getiriyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mb-6">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Net Sıfır Hedefi
              </h3>
              <p className="text-gray-600">
                2053 yılına kadar net sıfır emisyon hedefine ulaşmak için 
                stratejik planlama ve uygulama gerçekleştiriyoruz.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-6">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Küresel İş Birliği
              </h3>
              <p className="text-gray-600">
                Uluslararası standartlarla uyumlu projeler geliştirerek 
                küresel iklim hedeflerine katkıda bulunuyoruz.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-6">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Paydaş Katılımı
              </h3>
              <p className="text-gray-600">
                Kamu, özel sektör ve akademi iş birliğiyle 
                sürdürülebilir çözümler üretiyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Projelerimizin Etkisi
            </h2>
            <p className="text-lg text-gray-600">
              IDEC-TT projesi kapsamında hedeflenen çıktılar ve beklenen etkiler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">400+</div>
              <p className="text-gray-600">Sektör Çalışanına Eğitim</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">30+</div>
              <p className="text-gray-600">Firmaya Özel Mentorluk</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">4</div>
              <p className="text-gray-600">Hedef Sektör</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">5</div>
              <p className="text-gray-600">Ana Faaliyet Alanı</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Sürdürülebilir Geleceğe Katılın
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            IDEC-TT projelerimiz hakkında daha fazla bilgi almak ve 
            karbonsuzlaştırma sürecine dahil olmak için bizimle iletişime geçin.
          </p>
          <Link 
            to="/contact"
            className="bg-white text-emerald-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            İletişime Geçin
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
