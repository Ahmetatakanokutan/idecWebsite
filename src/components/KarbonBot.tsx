import { useEffect, useRef } from 'react';

const KarbonBot = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Bot elementini oluşturan ve özelliklerini atayan yardımcı fonksiyon
  const createAndAppendBotElement = () => {
    if (containerRef.current && !containerRef.current.querySelector('knowhy-bot')) {
      const botElement = document.createElement('knowhy-bot');
      // Tüm parametreleri burada atayabilirsiniz
      botElement.setAttribute('buton_arkaplan_rengi', '#4CAF50');
      botElement.setAttribute('buton_konum', 'sag');
      botElement.setAttribute('buton_sag_bosluk', '20');
      botElement.setAttribute('buton_alt_bosluk', '20');
      botElement.setAttribute('buton_boyut', '70');
      botElement.setAttribute('buton_surumle_birak', 'true');
      botElement.setAttribute('buton_ikon_rengi', '#ffffff');
      botElement.setAttribute('buton_ikon_src', 'https://cdn.knowhy.dev/1755319135802_6394_nazli.png');
      botElement.setAttribute('buton_ikon_boyut', '60');

      botElement.setAttribute('pencere_otomatik_ac', 'true');
      botElement.setAttribute('pencere_otomatik_ac_gecikme', '2');
      botElement.setAttribute('pencere_otomatik_ac_mobil', 'true');

      botElement.setAttribute('tooltip_goster', 'true');
      botElement.setAttribute('tooltip_mesaj', '🌿 KarbonBot burada! Karbon yönetimi hakkında sorularını sorabilirsin.');
      botElement.setAttribute('tooltip_arkaplan', '#2E7D32');
      botElement.setAttribute('tooltip_yazi_rengi', '#ffffff');
      botElement.setAttribute('tooltip_yazi_boyutu', '15');

      botElement.setAttribute('pencere_baslik_goster', 'true');
      botElement.setAttribute('pencere_baslik', 'KarbonBot AI Assistant');
      botElement.setAttribute('pencere_baslik_avatar', 'https://cdn.knowhy.dev/1755319135802_6394_nazli.png');
      botElement.setAttribute('pencere_baslik_avatar_boyut', '28');
      botElement.setAttribute('pencere_agent_mesaj_goster', 'true');
      botElement.setAttribute('pencere_hosgeldin', 'Merhaba! Ben KarbonBot 🌍 Karbon yakalama, depolama, politika ve sürdürülebilirlik konularında sorularınızı yanıtlamak için buradayım.');
      botElement.setAttribute('pencere_hata', 'Bu konuda kesin bilgiye sahip değilim. Lütfen daha açık sorar misiniz?');
      botElement.setAttribute('pencere_bekliyor_mesaji', 'Verileri analiz ediyorum, lütfen bekleyin... 🌱');
      botElement.setAttribute('pencere_rate_limit_mesaji', 'Çok hızlı gidiyoruz. Biraz bekleyelim 🌿');
      botElement.setAttribute('pencere_ag_hatasi_mesaji', 'Bağlantı problemi. İnternetinizi kontrol edin.');
      botElement.setAttribute('pencere_arkaplan', '#ffffff');
      botElement.setAttribute('pencere_yukseklik', '550');
      botElement.setAttribute('pencere_genislik', '440');
      botElement.setAttribute('pencere_yazi_boyutu', '15');
      botElement.setAttribute('pencere_baslangic_istekleri', '["Karbon yakalama teknolojileri hakkında bilgi ver.","Türkiyenin karbon stratejisi nedir?","Metal-organik yapıların karbon giderimindeki rolü?","Karbon emisyonlarını nasıl azaltabilirim?"]');
      botElement.setAttribute('pencere_baslangic_istek_yazi_boyutu', '14');
      botElement.setAttribute('pencere_yenilede_temizle', 'true');

      botElement.setAttribute('pencere_baslangic_istekleri_wrapper_arkaplan', '#ffffff');
      botElement.setAttribute('pencere_baslangic_istekleri_buton_arkaplan', '#E8F5E9');
      botElement.setAttribute('pencere_baslangic_istekleri_buton_yazi_rengi', '#2E7D32');
      botElement.setAttribute('pencere_baslangic_istekleri_buton_hover_arkaplan', '#2E7D32');
      botElement.setAttribute('pencere_baslangic_istekleri_buton_hover_yazi_rengi', '#ffffff');
      botElement.setAttribute('pencere_baslangic_istekleri_buton_kenarlık_rengi', '#A5D6A7');
      botElement.setAttribute('pencere_baslangic_istekleri_buton_kenarlık_kalinlik', '1');
      botElement.setAttribute('pencere_baslangic_istekleri_buton_border_radius', '16');
      botElement.setAttribute('pencere_baslangic_istekleri_baslik_rengi', '#2E7D32');
      botElement.setAttribute('pencere_baslangic_istekleri_golgeli', 'true');
      botElement.setAttribute('pencere_baslangic_istekleri_buton_golge', '0 2px 6px rgba(0,0,0,0.1)');
      botElement.setAttribute('pencere_baslangic_istekleri_buton_hover_golge', '0 4px 8px rgba(0,0,0,0.15)');
      botElement.setAttribute('pencere_baslangic_istekleri_buton_padding', '12px 20px');
      botElement.setAttribute('pencere_baslangic_istekleri_buton_margin', '6px');
      botElement.setAttribute('pencere_baslangic_istekleri_buton_min_genislik', '260px');
      botElement.setAttribute('pencere_baslangic_istekleri_buton_yazi_kalinligi', '500');

      botElement.setAttribute('bot_mesaj_arkaplan', '#E8F5E9');
      botElement.setAttribute('bot_mesaj_yazi_rengi', '#2E7D32');
      botElement.setAttribute('bot_mesaj_avatar_goster', 'true');
      botElement.setAttribute('bot_mesaj_avatar', 'https://cdn.knowhy.dev/1755319135802_6394_nazli.png');
      botElement.setAttribute('bot_mesaj_avatar_boyut', '40');

      botElement.setAttribute('kullanici_mesaj_arkaplan', '#4CAF50');
      botElement.setAttribute('kullanici_mesaj_yazi_rengi', '#ffffff');
      botElement.setAttribute('kullanici_mesaj_avatar_goster', 'true');
      botElement.setAttribute('kullanici_mesaj_avatar', 'https://cdn.knowhy.dev/1755322850035_anonim_1_.png');
      botElement.setAttribute('kullanici_mesaj_avatar_boyut', '40');

      botElement.setAttribute('arama_vurgu_arkaplan_rengi', '#C8E6C9');
      botElement.setAttribute('arama_vurgu_yazi_rengi', '#1B5E20');
      botElement.setAttribute('arama_vurgu_yazi_kalinligi', '600');

      botElement.setAttribute('input_placeholder', 'Karbon yönetimiyle ilgili sorunuzu yazın...');
      botElement.setAttribute('input_arkaplan', '#ffffff');
      botElement.setAttribute('input_alan_arkaplan', '#f9f9f9');
      botElement.setAttribute('input_yazi_rengi', '#2e2e2e');
      botElement.setAttribute('input_gonder_buton_rengi', '#4CAF50');
      botElement.setAttribute('input_max_karakter', '800');
      botElement.setAttribute('input_max_karakter_uyari', '⚠ Lütfen mesajınızı 800 karakterle sınırlandırın.');
      botElement.setAttribute('input_otomatik_fokus', 'true');
      botElement.setAttribute('input_yukseklik', '55px');
      botElement.setAttribute('input_gonder_ses', 'true');
      botElement.setAttribute('input_cevap_ses', 'true');

      botElement.setAttribute('feedback_rengi', '#2E7D32');
      botElement.setAttribute('feedback_goster', 'true');

      botElement.setAttribute('footer_arkaplan', '#f9f9f9');
      botElement.setAttribute('footer_yazi_rengi', '#2E7D32');
      botElement.setAttribute('footer_yazi', 'Geliştirici');
      botElement.setAttribute('footer_sirket', 'Knowhy');
      botElement.setAttribute('footer_sirket_link', 'https://knowhy.co');

      botElement.setAttribute('loading_kart_arkaplan', '#ffffff');
      botElement.setAttribute('loading_kart_gradient_baslangic', '#ffffff');
      botElement.setAttribute('loading_kart_gradient_bitis', '#E8F5E9');
      botElement.setAttribute('loading_kart_border_rengi', '#4CAF50');
      botElement.setAttribute('loading_kart_golge_rengi', 'rgba(0,0,0,0.08)');
      botElement.setAttribute('loading_progress_rengi', '#4CAF50');
      botElement.setAttribute('loading_progress_rengi2', '#2E7D32');
      botElement.setAttribute('loading_dots_arkaplan', 'rgba(0,0,0,0.05)');
      botElement.setAttribute('loading_dots_rengi', '#4CAF50');
      botElement.setAttribute('loading_dots_rengi2', '##2E7D32');
      botElement.setAttribute('loading_status_rengi', '#2E7D32');
      botElement.setAttribute('loading_metin_rengi', '#2c3e50');
      botElement.setAttribute('loading_pulse_rengi', '#4CAF50');
        
      containerRef.current.appendChild(botElement);
    }
  };

  useEffect(() => {
    const scriptId = 'knowhy-bot-script';

    const initializeBot = () => {
      customElements.whenDefined('knowhy-bot').then(() => {
        createAndAppendBotElement();
      }).catch(err => console.error("KarbonBot custom element definition failed:", err));
    };

    // Script zaten DOM'da varsa
    if (document.getElementById(scriptId)) {
      initializeBot();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://karbonbot.knowhy.info/embed/knowhy-bot.js';
    script.defer = true;
    script.onload = initializeBot; // Script yüklendiğinde botu başlat
    script.onerror = (e) => console.error("Failed to load KarbonBot script:", e);

    document.body.appendChild(script);

    return () => {
      // Sadece bot elementini (custom element) temizle, scripti DOM'dan kaldırma
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2147483647 }}>
      {/* Bot bu div içine dinamik olarak eklenecek */}
    </div>
  );
};

export default KarbonBot;