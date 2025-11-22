import { Leaf, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold">IDEC-TT</h3>
            </div>
            <p className="text-gray-400 text-sm">
              İstanbul Kalkınma Ajansı desteğiyle yürütülen, endüstriyel dekarbonizasyon ve ikiz dönüşüm projesi.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase mb-4">Faaliyet Alanları</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/projects" className="hover:text-white transition-colors">Endüstriyel Dekarbonizasyon</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">KarbonBot Yapay Zeka</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Dijital Kütüphane</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Eğitim ve Mentorluk</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase mb-4">Hızlı Erişim</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">Hakkında</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">IDEC Akademi</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Projelerimiz</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">İletişim</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase mb-4">İletişim</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-emerald-500 flex-shrink-0" />
                <span>İnönü Mah. Kayışdağı Cad. 326A, 26 Ağustos Yerleşimi, 34755 Ataşehir - İstanbul</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-emerald-500 flex-shrink-0" />
                <span>(0216) 578 00 00</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-emerald-500 flex-shrink-0" />
                <span>info@idec-tt.org</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} IDEC-TT. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
