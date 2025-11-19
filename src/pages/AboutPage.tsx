import Layout from '../components/Layout';

const AboutPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            IDEC-TT Hakkında
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            İkiz Dönüşüm Yoluyla Endüstriyel Dekarbonizasyon projesi hakkında detaylı bilgiler
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Proje Vizyonu</h2>
            <p className="text-gray-700 mb-4">
              IDEC-TT projesi, Türkiye'nin endüstriyel sektörlerinde dijital ve yeşil dönüşümü 
              bir arada gerçekleştirerek, sürdürülebilir ve rekabetçi bir sanayi yapısı oluşturmayı hedeflemektedir.
            </p>
            <p className="text-gray-700 mb-6">
              Proje kapsamında geliştirilen KarbonBot yapay zeka sistemi, dijital kütüphane ve 
              eğitim modülleri ile sektörel dönüşüm desteklenmektedir.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Temel Problemler</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Firmaların karbon ayak izi ölçümüne dair bilgi ve erişim eksikliği</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Dijital dönüşüm araçlarının sektöre uyumlu ve erişilebilir olmaması</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>KOBİ'lerde dönüşüm kapasitesinin sınırlı olması</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>SKDM gibi uluslararası düzenlemelere hazırlıksız yakalanma riski</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Çözümlerimiz</h2>
            <div className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-2">Düşük Karbonlu Üretim</h4>
                <p className="text-emerald-700 text-sm">
                  Düşük karbonlu üretime geçen firmalar için ihracatta rekabet avantajı sağlanması
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Yeşil Finansman</h4>
                <p className="text-blue-700 text-sm">
                  Yeşil finansman mekanizmalarıyla yatırım ve teşvik erişimi
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Endüstri 4.0</h4>
                <p className="text-purple-700 text-sm">
                  Endüstri 4.0 ve yapay zeka çözümleri ile verimlilik ve maliyet avantajı
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">AB Uyumu</h4>
                <p className="text-orange-700 text-sm">
                  AB ile ticaretin sürdürülebilir şekilde korunması
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">İletişim Bilgileri</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                YEDİTEPE ÜNİVERSİTESİNE NASIL ULAŞIRSINIZ?
              </h3>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900">Üniversite Santral:</h4>
                  <p>Tel: (0216) 578 00 00 (pbx)</p>
                  <p>Fax: (0216) 578 02 99</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Adres:</h4>
                  <p>İnönü Mah. Kayışdağı Cad. 326A</p>
                  <p>26 Ağustos Yerleşimi</p>
                  <p>34755 Ataşehir - İstanbul</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Ulaşım Servisi:</h4>
                  <p>Tel: (0216) 578 01 34 - (0216) 578 01 35</p>
                  <p>E-Posta: istekservis@istek.org.tr</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Ulaşım İmkanları:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• İstanbul genelinde öğrenci taşıma servisi</li>
                  <li>• Kadıköy'den 19 ve 19F numaralı İETT otobüsleri</li>
                  <li>• Küçükbakkalköy minibüsleri</li>
                  <li>• Yerleşim içinde 5 adet ring servisi (08:00-23:00)</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Konum</h3>
              <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.2441!2d29.1234567!3d40.9876543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac82475e6a857%3A0x4346c0c71cb15677!2sYeditepe%20University!5e0!3m2!1sen!2str!4v1640995200000"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '0.5rem' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Yeditepe Üniversitesi Konum"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
