/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ESKİ palet — sadece Header.tsx hâlâ kullanıyor (henüz dokunulmadı). Yeni
        // tasarım (ink/accent/paper) bunları kullanmıyor; Header'a geçince silinebilir.
        'brand-dark': '#063005',
        brand: '#1E8A1B',
        'brand-light': '#40BF39',
        'brand-navy': '#1B3A6B',

        // YENİ palet: koyu gradyan tuval + tek parlak vurgu rengi.
        ink: {
          deep: '#0A1F3D', // gradyanın başlangıcı (sol üst)
          mid: '#0E3A5C',  // gradyanın ortası
          teal: '#0F5F52', // gradyanın bitişi (sağ alt)
        },
        accent: {
          DEFAULT: '#4ADE80', // TEK vurgu rengi — sadece koyu zeminde, cimri kullan
          deep: '#16A34A',    // açık zeminde vurgu gerektiğinde (kontrast için)
        },
        paper: '#F8FAFC', // açık bölüm zemini
      },
      backgroundImage: {
        // 135°, sol üstten sağ alta: ink-deep -> ink-mid -> ink-teal
        'ink-gradient': 'linear-gradient(135deg, #0A1F3D 0%, #0E3A5C 50%, #0F5F52 100%)',
      },
      fontFamily: {
        // Mevcut varsayılan sans/serif ailelerine dokunmuyoruz (diğer sayfalar etkilenmesin);
        // bunlar sadece uygulandıkları yerde (font-archivo / font-source-serif) devreye girer.
        archivo: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'source-serif': ['"Source Serif 4"', 'ui-serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
