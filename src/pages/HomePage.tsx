import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Globe, ArrowRight, Leaf, Wind, Zap, BarChart3, Award, Layers } from 'lucide-react';
import Layout from '../components/Layout';

const heroImages = [
  "https://images.pexels.com/photos/9800009/pexels-photo-9800009.jpeg?auto=compress&cs=tinysrgb&w=1920", // Rüzgar Gülleri (Favori)
  "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1920", // Deniz/Okyanus
  "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1920", // Doğa ve Su
  "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1920"  // Yeşil Doğa
];

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 6000); // 6 saniye

    // Initial animation trigger
    setTimeout(() => setIsVisible(true), 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-gray-900">
        
        {/* Background Slider with Ken Burns Effect */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image} 
              alt={`Slide ${index + 1}`} 
              className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${
                index === currentImageIndex ? 'scale-110' : 'scale-100'
              }`}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
          </div>
        ))}

        {/* Content */}
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 mb-6 px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-sm font-semibold tracking-wide uppercase animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Geleceği Şekillendiriyoruz</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
              Yeşil Enerji, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Güçlü Sanayi.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light leading-relaxed border-l-4 border-emerald-500 pl-6">
              IDEC-TT ile endüstriyel dönüşümde karbon ayak izini siliyoruz. 
              Teknoloji ve doğanın kusursuz uyumu için çalışıyoruz.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <Link 
                to="/projects"
                className="group bg-emerald-600 text-white px-8 py-4 rounded-full hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] font-bold flex items-center justify-center sm:justify-start"
              >
                Projeleri İncele 
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/courses"
                className="group bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full hover:bg-white/20 transition-all font-semibold flex items-center justify-center sm:justify-start"
              >
                Eğitimlere Katıl
                <PlayCircleIcon className="ml-2 w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-2 bg-white/50 rounded-full mt-2"></div>
            </div>
        </div>
      </section>

      {/* Stats Strip (Floating) */}
      <div className="relative z-20 -mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 p-8 border border-gray-100/50">
            <StatItem number="400+" label="Eğitim Alan" icon={<Users className="w-5 h-5 text-emerald-600" />} />
            <StatItem number="30+" label="Firma Mentörlüğü" icon={<BarChart3 className="w-5 h-5 text-blue-600" />} />
            <StatItem number="4" label="Pilot Sektör" icon={<Layers className="w-5 h-5 text-purple-600" />} />
            <StatItem number="5" label="Faaliyet Alanı" icon={<Award className="w-5 h-5 text-orange-600" />} />
        </div>
      </div>

      {/* Features Section */}
      <section id="about" className="py-32 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-3">Vizyonumuz</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sürdürülebilirlik İçin <br/> 3 Temel Adım
            </h3>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Karmaşık sorunlara basit ve etkili çözümler üretiyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
                icon={<Target className="w-8 h-8 text-white" />}
                color="bg-emerald-500"
                title="Net Sıfır Stratejisi"
                description="2053 hedefleri doğrultusunda karbon emisyonlarını sıfıra indiren yol haritaları."
            />
            <FeatureCard 
                icon={<Globe className="w-8 h-8 text-white" />}
                color="bg-blue-600"
                title="Global Entegrasyon"
                description="Dünya standartlarında projelerle sınırları aşan iş birlikleri ve teknoloji transferi."
            />
            <FeatureCard 
                icon={<Users className="w-8 h-8 text-white" />}
                color="bg-indigo-600"
                title="Toplumsal Dönüşüm"
                description="Sadece sanayiyi değil, toplumu da eğiten ve dönüştüren sosyal sorumluluk bilinci."
            />
          </div>
        </div>
      </section>

      {/* Image Grid Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">Doğayla Uyumlu Teknoloji</h2>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Sanayi devriminin getirdiği yükleri, Endüstri 4.0 ve yeşil enerji teknolojileriyle hafifletiyoruz. 
                        Güneşten, rüzgardan ve veriden güç alarak geleceği inşa ediyoruz.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <ListItem text="Karbon Yakalama ve Depolama Teknolojileri" />
                        <ListItem text="Yapay Zeka Destekli Enerji Yönetimi" />
                        <ListItem text="Döngüsel Ekonomi Modelleri" />
                    </ul>
                    <Link to="/about" className="text-emerald-600 font-bold hover:text-emerald-700 inline-flex items-center group">
                        Daha fazlasını oku <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="lg:w-1/2 relative">
                    <div className="absolute -top-10 -right-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <img src="https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=600" className="rounded-2xl shadow-lg transform translate-y-8" alt="Nature" />
                        <img src="https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=600" className="rounded-2xl shadow-lg" alt="Tech" />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
            <img src="https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1920" className="w-full h-full object-cover opacity-20" alt="Background" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Gezegenimiz İçin Harekete Geçin
          </h2>
          <p className="text-xl text-gray-300 mb-10 font-light">
            Bugün atacağınız küçük bir adım, yarın büyük bir ormana dönüşebilir.
            Projelerimize katılın, eğitim alın veya destek olun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
                to="/contact"
                className="bg-emerald-500 text-white px-10 py-4 rounded-full hover:bg-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/40 font-bold"
            >
                İletişime Geçin
            </Link>
            <Link 
                to="/register"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-full hover:bg-white/20 transition-all font-bold"
            >
                Üye Olun
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

// Helper Components for cleaner code
const StatItem = ({ number, label, icon }: { number: string, label: string, icon: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center p-4 text-center">
        <div className="mb-3 p-3 bg-gray-50 rounded-full">{icon}</div>
        <span className="text-4xl font-extrabold text-gray-900 mb-1">{number}</span>
        <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">{label}</span>
    </div>
);

const FeatureCard = ({ icon, color, title, description }: { icon: React.ReactNode, color: string, title: string, description: string }) => (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group cursor-default">
        <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
            {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
            {description}
        </p>
    </div>
);

const ListItem = ({ text }: { text: string }) => (
    <li className="flex items-center text-gray-700">
        <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 text-emerald-600 flex-shrink-0">
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