import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-[#E9E9E9] py-12 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Left: Disclaimer Text (Balanced width) */}
          <div className="lg:flex-1">
            <p className="text-[#4A4A4A] text-sm md:text-base leading-relaxed font-medium text-justify">
              {t('footer.istka_disclaimer', { 
                projectName: t('footer.project_name_long'), 
                beneficiaryName: t('footer.beneficiary_name') 
              })}
            </p>
          </div>

          {/* Right: Logos (Balanced width) - Ministry logo larger and equal spacing */}
          <div className="lg:flex-1 flex items-center justify-center lg:justify-end gap-16">
            <a 
              href="https://www.sanayi.gov.tr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img 
                src="https://www.istka.org.tr/media/about/xIdKSy0TeNDJij4yuIhpzwcrQJInIpRd1a7C6OZ20TJdsqsLQ2TR.jpg" 
                alt="T.C. Sanayi ve Teknoloji Bakanlığı" 
                className="h-[90px] md:h-[110px] w-auto border border-black shadow-sm bg-white" 
              />
            </a>
            
            <a 
              href="https://www.istka.org.tr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img 
                src="https://www.istka.org.tr/media/about/gpUnLFoxW9MA3xxifMEKu2ijJfmNJnGsMNzMutuRsrQmFfEVvvEN.png" 
                alt="İstanbul Kalkınma Ajansı" 
                className="h-[75px] md:h-[95px] w-auto" 
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
