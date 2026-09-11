/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palet: canli lacivert -> mavi -> yesil. Koyu bolumlerde gradyan tuval,
        // acik bolumlerde ink.deep baslik + accent.deep vurgu olarak kullanilir.
        ink: {
          deep: '#0B2E7A', // gradyanin baslangici (sol ust) + acik zeminde baslik rengi
          mid: '#0F63B5',  // gradyanin ortasi
          teal: '#0F9B62', // gradyanin bitisi (sag alt)
          night: '#071C4D', // gradyanin altina giren en koyu ton (video overlay, footer bandi)
        },
        accent: {
          DEFAULT: '#4ADE80', // koyu zeminde parlak vurgu
          bright: '#22C55E',  // acik zeminde ikon/dolgu (metin degil)
          deep: '#0D8A47',    // acik zeminde METIN icin (beyazda AA gecer)
        },
        sky: {
          bright: '#38BDF8', // dijital/ikiz donusum tarafinin ikincil vurgusu
        },
        paper: '#F4F8FC', // acik bolum zemini (hafif soguk)

        // Eski palet — artik kullanilmiyor, geriye donuk uyumluluk icin duruyor.
        'brand-dark': '#063005',
        brand: '#1E8A1B',
        'brand-light': '#40BF39',
        'brand-navy': '#1B3A6B',
      },
      backgroundImage: {
        // 135°, sol ustten sag alta: lacivert -> mavi -> yesil
        'ink-gradient': 'linear-gradient(135deg, #0B2E7A 0%, #0F63B5 48%, #0F9B62 100%)',
        // Hero videosunun uzerine binen, altta koyulasan ayni gradyan
        'ink-veil':
          'linear-gradient(135deg, rgba(11,46,122,0.94) 0%, rgba(15,99,181,0.86) 48%, rgba(15,155,98,0.88) 100%)',
        // Genis, yavas kayan versiyon (animate-drift ile birlikte)
        'ink-drift': 'linear-gradient(115deg, #0B2E7A 0%, #0F63B5 30%, #0F9B62 55%, #0F63B5 80%, #0B2E7A 100%)',
        'accent-gradient': 'linear-gradient(135deg, #22C55E 0%, #0F9B62 100%)',
      },
      fontFamily: {
        archivo: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'source-serif': ['"Source Serif 4"', 'ui-serif', 'Georgia', 'serif'],
      },
      keyframes: {
        // Gradyanin cok yavas saga kaymasi — hero ve CTA bantlarinda "canli" his.
        drift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        // Serbest yuzen isik lekeleri (blur'lu daireler).
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(0, -22px, 0) scale(1.06)' },
        },
        // Vurgu noktalarinin etrafinda genisleyip sonen halka.
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '70%': { transform: 'scale(1.9)', opacity: '0' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        // Kesikli bag cizgisinin akmasi (Nasil Calisir / Karbonun yolculugu).
        'dash-flow': {
          to: { strokeDashoffset: '-24' },
        },
        // KarbonBot yazma noktalari.
        typing: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-4px)', opacity: '1' },
        },
        // Hero gorselinin uzerinden gecen ince tarama cizgisi (HUD hissi).
        scan: {
          '0%': { transform: 'translateY(-120%)' },
          '100%': { transform: 'translateY(620%)' },
        },
        // Kesintisiz akan serit: icerik iki kez basilir, %50'de basa doner.
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        // "Nasil Calisir" zincirinde soldan saga ilerleyen isik darbesi.
        travel: {
          '0%': { left: '0%', opacity: '0' },
          '10%, 90%': { opacity: '1' },
          '100%': { left: '100%', opacity: '0' },
        },
        // Cerceve kenarinda dolasan hafif parlama.
        glow: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.9' },
        },
      },
      animation: {
        drift: 'drift 18s ease-in-out infinite',
        float: 'float 9s ease-in-out infinite',
        'float-slow': 'float 14s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'dash-flow': 'dash-flow 1.2s linear infinite',
        typing: 'typing 1.2s ease-in-out infinite',
        scan: 'scan 5.5s ease-in-out infinite',
        marquee: 'marquee 42s linear infinite',
        travel: 'travel 7s ease-in-out infinite',
        glow: 'glow 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
