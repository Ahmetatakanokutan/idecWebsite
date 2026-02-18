import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Bell, Calendar } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useTranslation } from 'react-i18next';

interface Announcement {
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
}

const AnnouncementsSection = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await apiService.get('/announcements/active');
                setAnnouncements(data);
            } catch (error) {
                console.error("Failed to fetch announcements", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    useEffect(() => {
        if (announcements.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [announcements.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
    };

    if (loading || announcements.length === 0) {
        return null;
    }

    const current = announcements[currentIndex];

    return (
        <section className="py-16 bg-gray-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                            <Bell className="w-6 h-6 text-emerald-600 animate-bounce" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            {t('common.announcements')}
                        </h2>
                    </div>
                    {announcements.length > 1 && (
                        <div className="flex space-x-2">
                            <button 
                                onClick={prevSlide}
                                className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="relative group bg-white rounded-3xl shadow-xl overflow-hidden min-h-[400px] flex flex-col md:flex-row transition-all duration-500 hover:shadow-2xl">
                    {/* Image Area */}
                    <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                        <img 
                            src={current.imageUrl || "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
                            alt={current.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
                    </div>

                    {/* Content Area */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center text-emerald-600 text-sm font-semibold mb-4 uppercase tracking-widest">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(current.createdAt).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            {current.title}
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8 line-clamp-4">
                            {current.content}
                        </p>
                        {/* Read more removed */}
                    </div>

                    {/* Indicator Dots */}
                    {announcements.length > 1 && (
                        <div className="absolute bottom-6 right-12 hidden md:flex space-x-2">
                            {announcements.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1.5 transition-all duration-300 rounded-full ${
                                        idx === currentIndex ? 'w-8 bg-emerald-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AnnouncementsSection;