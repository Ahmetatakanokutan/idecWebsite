import { Leaf } from "lucide-react";

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
            <p className="text-gray-400">
              Sürdürülebilir gelecek için karbonsuzlaştırma projesi
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase mb-4">Projeler</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Yenilenebilir Enerji</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Enerji Verimliliği</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Karbon Yakalama</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase mb-4">Kaynaklar</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Raporlar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Araştırmalar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Veri Seti</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase mb-4">İletişim</h4>
            <ul className="space-y-2 text-gray-400">
              <li>info@idec-tt.org</li>
              <li>+90 312 XXX XX XX</li>
              <li>Ankara, Türkiye</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 IDEC-TT. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
