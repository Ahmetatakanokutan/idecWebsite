import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, BookOpen, Check, ChevronDown, ChevronRight, Heart, Loader2, Play, Star, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService, progressService, resolveAssetUrl } from '../services/apiService';
import { useTranslation } from 'react-i18next';

// Backend DTO yapılarına göre arayüzleri tanımla
interface Lesson {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
}

interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Instructor {
  name: string;
  title: string;
}

interface CourseDetail {
  id: number;
  title: string;
  description: string;
  rating: number;
  students: number;
  instructor: Instructor;
  sections: Section[];
}

const CourseDetailPage = () => {
  const { isLoggedIn } = useAuth();
  const { courseId } = useParams();
  const { t, i18n } = useTranslation();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  // Kullanici kalbe tikladi mi? Tikladiysa gec gelen favori listesi onun sonucunu ezmesin.
  const favoriteTouchedRef = useRef(false);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  
  // Accordion state: keep track of open sections
  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleSection = (sectionId: number) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId) 
        : [...prev, sectionId]
    );
  };

  const isYouTubeUrl = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');
  const isGoogleDriveUrl = (url: string) => url.includes('drive.google.com');

  const getGoogleDrivePreviewUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);

      if (!parsedUrl.hostname.includes('drive.google.com')) {
        return url;
      }

      const fileIdFromQuery = parsedUrl.searchParams.get('id');
      const fileIdFromPath = parsedUrl.pathname.match(/\/file\/d\/([^/]+)/)?.[1];
      const fileId = fileIdFromQuery || fileIdFromPath;

      if (!fileId) {
        return url;
      }

      return `https://drive.google.com/file/d/${fileId}/preview`;
    } catch {
      return url;
    }
  };

  const getMediaUrl = (url: string) => resolveAssetUrl(url);

  const getEmbedUrl = (url: string) => {
    if (isGoogleDriveUrl(url)) {
      return getGoogleDrivePreviewUrl(url);
    }

    if (url.includes('/embed/') || !isYouTubeUrl(url)) {
      return url;
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  const handleSelectLesson = (lesson: Lesson, courseForProgress = course) => {
    setSelectedLesson(lesson);
    if (isLoggedIn && courseForProgress) {
      progressService.recordWatch(lesson.id, courseForProgress.id).catch(() => {});
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        setIsFavorited(false);
        favoriteTouchedRef.current = false;
        
        // Enroll user
        apiService.post(`/courses/${courseId}/enroll`, {}).catch((err) => console.error("Enrollment failed:", err));

        const data: CourseDetail = await apiService.get(`/courses/${courseId}`);
        setCourse(data);

        // Kursun zaten favoride olup olmadigi. Eskiden kalp her acilista bos geliyordu;
        // backend favoriyi "tersine cevirdigi" icin kullanicinin "ekle" sandigi ilk
        // tiklama, zaten favorideki kursu siliyordu. Kullanici bu sirada kalbe
        // tiklamissa onun sonucu gecerli kalir, bu cevap ustune yazmaz.
        apiService
          .get('/courses/favorites')
          .then((favorites) => {
            if (!favoriteTouchedRef.current && Array.isArray(favorites)) {
              setIsFavorited(favorites.some((fav: { id: number }) => fav.id === Number(courseId)));
            }
          })
          .catch(() => { /* Favori bilgisi gelmezse kalp bos kalir, sayfa calismaya devam eder. */ });

        try {
          const progressData = await progressService.getCourseProgress(Number(courseId));
          if (Array.isArray(progressData)) {
            const completedIds = new Set<number>(
              progressData
                .filter((progress: any) => progress.completed)
                .map((progress: any) => progress.lessonId)
            );
            setCompletedLessons(completedIds);
          }
        } catch {
          /* Progress bilgisi yüklenemezse kurs görüntüleme akışı devam eder. */
        }

        if (data.sections && data.sections.length > 0) {
            setOpenSections([data.sections[0].id]);
            if (data.sections[0].lessons && data.sections[0].lessons.length > 0) {
                handleSelectLesson(data.sections[0].lessons[0], data);
            }
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId, isLoggedIn]);

  const handleToggleFavorite = async () => {
    favoriteTouchedRef.current = true;
    try {
        const response = await apiService.post(`/courses/${courseId}/favorite`, {});
        setIsFavorited(response); // Backend returns true (added) or false (removed)
    } catch (err) {
        console.error("Failed to toggle favorite", err);
    }
  };

  const getLocalizedContent = (course: CourseDetail) => {
    if (i18n.language === 'en') {
      const translated = t(`courses.items.${course.title}`, { returnObjects: true }) as any;
      if (translated && translated.title) {
        return {
          title: translated.title,
          description: translated.description
        };
      }
    }
    return {
      title: course.title,
      description: course.description
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-accent-deep" />
      </div>
    );
  }
  
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper font-archivo">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6"><div className="flex items-center justify-center w-16 h-16 bg-cta-gradient rounded-xl shadow-md shadow-accent-bright/25"><BookOpen className="w-8 h-8 text-white" /></div></div>
            <h2 className="text-2xl font-bold text-ink-deep mb-4">{t('courses.login_required_title')}</h2>
            <p className="text-gray-600 mb-6">{t('courses.login_required_desc')}</p>
            <Link to="/login" className="w-full bg-cta-gradient text-white px-6 py-3 rounded-lg hover:brightness-105 transition-all font-bold mb-4 inline-block shadow-md shadow-accent-bright/25">{t('header.login')}</Link>
            <p className="text-sm text-gray-500">
              {t('courses.no_account')}{' '}
              <Link to="/register" className="text-accent-deep hover:text-accent-deep font-medium">
                {t('courses.register_now')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <p className="mt-4 text-lg text-red-700 font-semibold">{error}</p>
          <Link to="/courses" className="text-accent-deep hover:underline mt-4 inline-block">{t('courses.back_to_all')}</Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">{t('courses.not_found')}</h1>
          <Link to="/courses" className="text-accent-deep hover:underline mt-4 inline-block">{t('courses.back_to_all')}</Link>
        </div>
      </div>
    );
  }

  const localized = getLocalizedContent(course);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Left Side: Video Player */}
      <div className="flex-1 bg-black flex flex-col relative">
        <div className="absolute top-4 left-4 z-10">
             <Link to="/courses" className="text-white/80 hover:text-white bg-black/50 px-3 py-1 rounded-full text-sm flex items-center backdrop-blur-sm">
                <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> {t('courses.back_to_courses')}
             </Link>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-900 overflow-hidden relative">
          {selectedLesson ? (
            (isYouTubeUrl(selectedLesson.videoUrl) || isGoogleDriveUrl(selectedLesson.videoUrl)) ? (
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={getEmbedUrl(getMediaUrl(selectedLesson.videoUrl))}
                    title={selectedLesson.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                    className="w-full h-full absolute inset-0"
                ></iframe>
            ) : (
                <video 
                    controls 
                    autoPlay 
                    className="w-full h-full absolute inset-0 object-contain"
                    key={getMediaUrl(selectedLesson.videoUrl)}
                >
                    <source src={getMediaUrl(selectedLesson.videoUrl)} type="video/mp4" />
                    {t('courses.video_not_supported')}
                </video>
            )
          ) : (
            <div className="text-white text-center z-10">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">{t('courses.start_prompt')}</p>
            </div>
          )}
        </div>
        {selectedLesson && (
          <div className="bg-gray-800 text-white p-6 border-t border-gray-700">
            <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span>{course.instructor.name}</span>
              <span>•</span>
              <span>{selectedLesson.duration}</span>
            </div>
            {completedLessons.has(selectedLesson.id) && (
              <span className="mt-3 inline-flex items-center text-accent text-xs font-medium">
                <Check className="w-4 h-4 mr-1" />
                {t('courses.lesson_completed')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Side: Curriculum Sidebar */}
      <div className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-lg font-bold text-ink-deep leading-tight">{localized.title}</h2>
            <button
                type="button"
                onClick={handleToggleFavorite}
                className={`p-1.5 rounded-full hover:bg-gray-200 transition-colors ${isFavorited ? 'text-red-500' : 'text-gray-400'}`}
                title={isFavorited ? t('courses.remove_from_favorites') : t('courses.add_to_favorites')}
                aria-label={isFavorited ? t('courses.remove_from_favorites') : t('courses.add_to_favorites')}
                aria-pressed={isFavorited}
            >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
             <div className="flex items-center"><Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />{course.rating}</div>
             <div className="flex items-center"><Users className="w-3 h-3 mr-1" />{course.students} {t('courses.students')}</div>
          </div>
        </div>

        {/* Scrollable Curriculum */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {course.sections && course.sections.map((section) => (
                <div key={section.id} className="border-b border-gray-100 last:border-0">
                    {/* Section Header */}
                    <button
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        aria-expanded={openSections.includes(section.id)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-100 transition-colors text-left"
                    >
                        <span className="font-semibold text-gray-800 text-sm">{section.title}</span>
                        {openSections.includes(section.id) ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                    </button>

                    {/* Section Lessons */}
                    {openSections.includes(section.id) && (
                        <div className="bg-white">
                            {section.lessons.map((lesson) => {
                                const isActive = selectedLesson?.id === lesson.id;
                                return (
                                    // Eskiden tiklanabilir bir div'di: klavyeyle (Tab/Enter) secilemiyordu.
                                    <button
                                        type="button"
                                        key={lesson.id}
                                        onClick={() => handleSelectLesson(lesson)}
                                        aria-current={isActive ? 'true' : undefined}
                                        className={`w-full text-left flex items-start p-3 transition-all border-l-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-deep ${isActive ? 'border-accent-bright bg-accent-bright/[0.07]' : 'border-transparent hover:bg-gray-50'}`}
                                    >
                                        <span className="mt-0.5 mr-3">
                                            {isActive ? (
                                                <Play className="w-4 h-4 text-accent-deep fill-current" />
                                            ) : completedLessons.has(lesson.id) ? (
                                                <Check className="w-4 h-4 text-accent-deep" />
                                            ) : (
                                                <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                                </span>
                                            )}
                                        </span>
                                        <span>
                                            <span className={`block text-sm font-medium ${isActive ? 'text-ink-deep font-semibold' : 'text-gray-700'}`}>
                                                {lesson.title}
                                            </span>
                                            <span className="flex items-center mt-1 text-xs text-gray-500">
                                                <Play className="w-3 h-3 mr-1" />
                                                {lesson.duration}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                            {section.lessons.length === 0 && (
                                <p className="p-4 text-xs text-gray-400 text-center italic">{t('courses.no_lessons')}</p>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
