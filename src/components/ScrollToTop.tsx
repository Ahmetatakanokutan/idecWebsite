import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Sayfa degisince en uste doner. BrowserRouter bunu kendisi yapmiyor; footer'dan
 * bir linke tiklayinca yeni sayfa ortasindan aciliyordu.
 *
 * - Sadece yol (pathname) degisince calisir: ayni sayfadaki sekme degisimi
 *   (/courses?tab=webinars gibi) kaydirma konumunu bozmaz.
 * - Geri/ileri tusunda (POP) calismaz: tarayici eski konumu kendisi geri yukler.
 * - Adreste #bolum varsa dokunmaz, tarayici o bolume gider.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP' || hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    // hash/navigationType bilerek bagimlilikta yok: sadece yol degisiminde tetiklensin.
  }, [pathname]);

  return null;
};

export default ScrollToTop;
