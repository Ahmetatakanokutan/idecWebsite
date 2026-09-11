import React from 'react';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  children: React.ReactNode;
};

// bg-paper: sayfalarin cogu paper zeminli; icerik kisa kalinca footer'in ustunde
// beyaz serit kalmasin. font-archivo: sayfalar tek tek sarmak zorunda kalmasin
// (footer'daki logo bandi bilincli olarak disarida — o bolum oldugu gibi korunuyor).
// overflow-x-clip: Reveal'in yandan gelen ogeleri baslangicta ekran disinda
// durdugu icin yatay kaydirma cubugu cikmasin. clip (hidden degil) sticky header'i bozmaz.
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Header />
      <main className="flex-grow font-archivo overflow-x-clip">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
