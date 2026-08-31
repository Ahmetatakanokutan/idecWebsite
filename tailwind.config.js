/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sertifika şablonuyla uyumlu marka paleti. brand-dark: koyu zeminler/footer/ana
        // başlıklar, brand: birincil butonlar/aktif durumlar, brand-light: SADECE küçük
        // vurgular (ikon, hover, altı çizgi, ayraç) — beyaz metinli buton zemini olarak kullanma.
        'brand-dark': '#063005',
        brand: '#1E8A1B',
        'brand-light': '#40BF39',
        // İkincil marka rengi (Yeditepe Üniversitesi lacivertinden): bölüm zeminleri,
        // kart ikonları, alternatif vurgular. Yeşil birincil, bu ikincil kalır.
        'brand-navy': '#1B3A6B',
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
