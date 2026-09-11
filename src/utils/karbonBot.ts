// KarbonBot (knowhy-bot) sag altta sabit duran bir web component. "KarbonBot"
// yazan butonlar/etiketler sohbet penceresini dogrudan acsin diye bilesenin
// kendi yuvarlak butonuna tikliyoruz — kullanicinin yaptiginin aynisi.
// (Bilesenin toggleChatWindow() metodu disaridan cagrilinca ic referanslari
// hazir olmadigi icin hata veriyor; o yuzden kullanilmiyor.)
// Pencere zaten aciksa buton "closed" sinifini tasimaz; o durumda tekrar
// tiklayip kapatmiyoruz.

/** Pencereyi acar; bot henuz yuklenmemisse false doner. */
export const openKarbonBot = (): boolean => {
  const chatButton = document
    .querySelector('knowhy-bot')
    ?.shadowRoot?.querySelector<HTMLElement>('.chat-button');
  if (!chatButton) return false;

  if (chatButton.classList.contains('closed')) {
    chatButton.click();
  }
  return true;
};
