import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bell, Calendar, ArrowRight } from 'lucide-react';
import { apiService, resolveAssetUrl } from '../services/apiService';
import { stripHtml, truncate } from '../utils/text';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

interface Announcement {
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
}

const SUMMARY_MAX_LENGTH = 220;
const CAROUSEL_LIMIT = 6;

// Jest ayarlari
const SWIPE_THRESHOLD = 50; // px - bunun altindaki hareket "tiklama", ustu "kaydirma" sayilir
const WHEEL_DELTA_NOISE_THRESHOLD = 10; // px - trackpad'in ufak titremelerini yoksay
const WHEEL_NAV_COOLDOWN_MS = 600; // touchpad inertia'si (parmak kalktiktan sonraki kayma)
                                    // tek jestte birden fazla gecis tetiklemesin diye throttle

const AnnouncementsSection = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    // Son gecisin yonu: yeni slayt ileri gidiliyorsa sagdan, geri gidiliyorsa soldan girer.
    const [direction, setDirection] = useState<1 | -1>(1);
    const [loading, setLoading] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const { t, i18n } = useTranslation();
    const sectionReveal = useScrollReveal<HTMLDivElement>();

    const containerRef = useRef<HTMLDivElement>(null);
    // nextSlide/prevSlide'in her zaman guncel uzunlugu gormesi icin (asagidaki jest
    // dinleyicileri mount'ta bir kere baglaniyor, render'lar arasinda yeniden abone olmuyor).
    const lengthRef = useRef(announcements.length);
    useEffect(() => {
        lengthRef.current = announcements.length;
    }, [announcements.length]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await apiService.get(`/announcements/active?limit=${CAROUSEL_LIMIT}`);
                // JSON olmayan yanitta apiService null doner; dizi degilse bolumu gizle.
                // Eskiden null oldugu gibi state'e giriyor, .length tum ana sayfayi cokertiyordu.
                setAnnouncements(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch announcements", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    useEffect(() => {
        // Reduced motion: otomatik ilerlemeyi durdur, gecis kullanicinin kontrolunde kalsin
        // (ok butonlari / nokta gostergeleri / surukleme hala calisir).
        if (announcements.length <= 1 || sectionReveal.reducedMotion) return;

        const interval = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % announcements.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [announcements.length, sectionReveal.reducedMotion]);

    // useCallback + lengthRef sayesinde bu iki fonksiyonun kimligi hic degismiyor;
    // asagidaki native event listener'lar bunlari guvenle kapatabiliyor (stale closure yok).
    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % lengthRef.current);
    }, []);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? lengthRef.current - 1 : prev - 1));
    }, []);

    const goToSlide = (idx: number) => {
        setDirection(idx >= currentIndex ? 1 : -1);
        setCurrentIndex(idx);
    };

    // Kaydırma jestleri: touchpad'de iki parmakla yatay wheel, dokunmatikte parmakla
    // sürükleme, farede sürükleme. React'ın sentetik onWheel/onTouchMove'u bu event'leri
    // passive olarak bağladığından preventDefault sessizce yok sayılır; bu yüzden native
    // addEventListener + { passive: false } kullanıyoruz.
    useEffect(() => {
        const container = containerRef.current;
        if (!container || announcements.length === 0) return;

        let dragStartX = 0;
        let dragStartY = 0;
        let dragActive = false;
        let horizontalIntent = false; // touch: yatay mi dikey mi henüz karar verilmedi
        let suppressNextClick = false;
        let lastWheelNav = 0;

        const startDrag = (x: number, y: number) => {
            dragStartX = x;
            dragStartY = y;
            dragActive = true;
            horizontalIntent = false;
        };

        const endDrag = (x: number, y: number) => {
            if (!dragActive) return;
            dragActive = false;
            setIsDragging(false);
            const dx = x - dragStartX;
            const dy = y - dragStartY;
            if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
                // Bu sürükleme az önce link/buton içeriyorsa, hemen ardından gelecek
                // "click" event'ini bastır ki yanlışlıkla "Devamını Oku" tetiklenmesin.
                suppressNextClick = true;
                if (dx < 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        };

        const handleWheel = (e: WheelEvent) => {
            if (lengthRef.current <= 1) return;
            // Dikey baskınsa hiç dokunma, sayfa normal kaysın.
            if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
            if (Math.abs(e.deltaX) < WHEEL_DELTA_NOISE_THRESHOLD) return;

            e.preventDefault();

            const now = Date.now();
            if (now - lastWheelNav < WHEEL_NAV_COOLDOWN_MS) return; // inertia: tek jest = tek geçiş
            lastWheelNav = now;

            if (e.deltaX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) return;
            e.preventDefault(); // sürüklerken metin seçimi başlamasın
            startDrag(e.clientX, e.clientY);
            setIsDragging(true);
        };
        const handleMouseUp = (e: MouseEvent) => {
            endDrag(e.clientX, e.clientY);
        };

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (!dragActive) return;
            const touch = e.touches[0];
            const dx = touch.clientX - dragStartX;
            const dy = touch.clientY - dragStartY;
            if (!horizontalIntent && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
                horizontalIntent = true;
            }
            if (horizontalIntent) {
                // Yatay swipe biz yönetiyoruz; sayfanın dikey kaymasını (ve tarayıcının
                // bunu sayfa kaydırma sanmasını) engelle. Dikey baskınsa hiç girmiyoruz,
                // sayfa normal kayabiliyor.
                e.preventDefault();
            }
        };
        const handleTouchEnd = (e: TouchEvent) => {
            const touch = e.changedTouches[0];
            endDrag(touch.clientX, touch.clientY);
        };

        const handleClickCapture = (e: MouseEvent) => {
            if (suppressNextClick) {
                e.preventDefault();
                e.stopPropagation();
                suppressNextClick = false;
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);
        container.addEventListener('click', handleClickCapture, true);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('mousedown', handleMouseDown);
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
            container.removeEventListener('click', handleClickCapture, true);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [announcements.length, nextSlide, prevSlide]);

    if (loading || announcements.length === 0) {
        return null;
    }

    const current = announcements[currentIndex];
    const shown = sectionReveal.isVisible;
    // Ilk giriste: baslik ve gorsel soldan, kontroller ve metin sagdan.
    const enter = (hiddenClass: string, delay: number) => ({
        className: `transition-all duration-1000 ease-out-expo ${shown ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${hiddenClass}`}`,
        style: sectionReveal.reducedMotion ? undefined : { transitionDelay: `${delay}ms` },
    });
    // Slayt degisiminde: ileri gidiliyorsa yeni icerik sagdan, geri gidiliyorsa soldan.
    const slideAnim = sectionReveal.reducedMotion
        ? ''
        : direction === 1 ? 'animate-slide-in-right' : 'animate-slide-in-left';

    return (
        <section className="py-24 bg-paper">
            <div ref={sectionReveal.ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div {...enter('-translate-x-16', 0)}>
                        <div className="flex items-center">
                            <div className="relative p-2 bg-accent-deep/10 rounded-lg mr-3">
                                <Bell className="w-6 h-6 text-accent-deep" />
                                {/* Zil yerine sakin bir "yeni" noktasi: surekli ziplama dikkat dagitiyordu */}
                                <span className="absolute top-1.5 right-1.5 flex w-2 h-2">
                                    <span className="absolute inline-flex w-full h-full rounded-full bg-accent-bright animate-pulse-ring motion-reduce:animate-none" />
                                    <span className="relative inline-flex w-2 h-2 rounded-full bg-accent-bright" />
                                </span>
                            </div>
                            <h2 className="text-3xl font-extrabold text-ink-deep tracking-tight">
                                {t('common.announcements')}
                            </h2>
                        </div>
                    </div>
                    <div {...enter('translate-x-16', 120)}>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/announcements"
                            className="text-sm font-semibold text-accent-deep hover:text-ink-deep transition-colors whitespace-nowrap"
                        >
                            {t('common.view_all_announcements')}
                        </Link>
                        {announcements.length > 1 && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={prevSlide}
                                    aria-label={t('common.previous')}
                                    className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-accent-deep/10 hover:text-accent-deep hover:border-accent-deep/30 transition-all shadow-sm"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    aria-label={t('common.next')}
                                    className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-accent-deep/10 hover:text-accent-deep hover:border-accent-deep/30 transition-all shadow-sm"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                    </div>
                </div>

                <div {...enter('translate-y-10', 200)}>
                <div
                    ref={containerRef}
                    className={`relative group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col md:flex-row transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 touch-pan-y ${
                        isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
                    }`}
                >
                    {/* Image Area — slayt degisince gorsel gidis yonunden kayarak girer */}
                    <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                        <div key={`img-${current.id}`} className={`absolute inset-0 ${slideAnim}`}>
                            <img
                                src={resolveAssetUrl(current.imageUrl) || "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                                alt={current.title}
                                draggable={false}
                                onDragStart={(e) => e.preventDefault()}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
                    </div>

                    {/* Content Area — gorselin hemen ardindan, ayni yonden */}
                    <div
                        key={`text-${current.id}`}
                        className={`w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center ${slideAnim}`}
                        style={slideAnim ? { animationDelay: '90ms' } : undefined}
                    >
                        <div className="flex items-center text-accent-deep text-sm font-semibold mb-4 uppercase tracking-widest">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(current.createdAt).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <h3 className="text-2xl md:text-4xl font-bold text-ink-deep mb-6 leading-tight tracking-tight">
                            {current.title}
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8 line-clamp-4">
                            {truncate(stripHtml(current.content), SUMMARY_MAX_LENGTH)}
                        </p>
                        <Link
                            to={`/announcements/${current.id}`}
                            className="inline-flex items-center gap-2 text-accent-deep font-semibold hover:text-ink-deep transition-colors w-fit"
                        >
                            {t('common.read_more')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Indicator Dots */}
                    {announcements.length > 1 && (
                        <div className="absolute bottom-6 right-12 hidden md:flex space-x-2">
                            {announcements.map((a, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => goToSlide(idx)}
                                    aria-label={a.title}
                                    aria-current={idx === currentIndex ? 'true' : undefined}
                                    className={`h-1.5 transition-all duration-300 rounded-full ${
                                        idx === currentIndex ? 'w-8 bg-accent-deep' : 'w-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
                </div>
            </div>
        </section>
    );
};

export default AnnouncementsSection;
