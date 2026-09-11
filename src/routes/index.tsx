import { Suspense, lazy, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';

// Hemen yuklenenler: ana sayfa (ilk giris) ve kucuk giris/kayit sayfalari.
// Giris sayfalari header'siz (AuthShell); sonradan yuklenseler, beklerken gosterilen
// header'li iskelet bir an gorunup kaybolurdu.
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

// Digerleri ilk ziyaret edildiklerinde iner; boylece ilk acilista indirilen
// JavaScript kuculur. Sik gidilenler asagida tarayici bosta kalinca onceden indirilir.
const loadAbout = () => import('../pages/AboutPage');
const loadCourses = () => import('../pages/CoursesPage');
const loadProjects = () => import('../pages/ProjectsPage');
const loadContact = () => import('../pages/ContactPage');
const loadAnnouncements = () => import('../pages/AnnouncementsPage');

const AboutPage = lazy(loadAbout);
const CoursesPage = lazy(loadCourses);
const ProjectsPage = lazy(loadProjects);
const ContactPage = lazy(loadContact);
const AnnouncementsPage = lazy(loadAnnouncements);
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage'));
const CourseDetailPage = lazy(() => import('../pages/CourseDetailPage'));
const CertificatePage = lazy(() => import('../pages/CertificatePage'));
const SeminarCertificatesPage = lazy(() => import('../pages/SeminarCertificatesPage'));
const AnnouncementDetailPage = lazy(() => import('../pages/AnnouncementDetailPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const FavoritesPage = lazy(() => import('../pages/FavoritesPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const PREFETCH = [loadAbout, loadCourses, loadProjects, loadContact, loadAnnouncements];

/** Sayfa dosyasi inerken: header/footer yerinde, ortada yukleniyor gostergesi. */
const PageFallback = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center" aria-busy="true">
        <Loader className="w-8 h-8 text-accent-deep animate-spin" aria-label={t('common.loading')} />
      </div>
    </Layout>
  );
};

// Admin Components
// Lazy-loaded: Tiptap (ManageAnnouncementsPage'in zengin metin editörü) ve diğer admin
// sayfaları sadece /admin altına girildiğinde indirilsin, public bundle'ı şişirmesin.
import ProtectedRoute from '../components/ProtectedRoute';
const AdminLayout = lazy(() => import('../components/AdminLayout'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const ManageProjectsPage = lazy(() => import('../pages/admin/ManageProjectsPage'));
const ManageCoursesPage = lazy(() => import('../pages/admin/ManageCoursesPage'));
const ManageCourseLessonsPage = lazy(() => import('../pages/admin/ManageCourseLessonsPage'));
const ManageInstructorsPage = lazy(() => import('../pages/admin/ManageInstructorsPage'));
const ManageUsersPage = lazy(() => import('../pages/admin/ManageUsersPage'));
const ManageAnnouncementsPage = lazy(() => import('../pages/admin/ManageAnnouncementsPage'));
const ManageSeminarCertificatesPage = lazy(() => import('../pages/admin/ManageSeminarCertificatesPage'));

export const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/contact', element: <ContactPage /> },
    { path: '/projects', element: <ProjectsPage /> },
    { path: '/projects/:projectId', element: <ProjectDetailPage /> },
    { path: '/courses', element: <CoursesPage /> },
    { path: '/courses/:courseId', element: <CourseDetailPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/verify-email', element: <VerifyEmailPage /> },
    { path: '/forgot-password', element: <ForgotPasswordPage /> },
    { path: '/reset-password', element: <ResetPasswordPage /> },
    { path: '/certificate', element: <CertificatePage /> },
    { path: '/announcements', element: <AnnouncementsPage /> },
    { path: '/announcements/:id', element: <AnnouncementDetailPage /> },

    // Protected User Routes (Any logged in user)
    {
        element: <ProtectedRoute />,
        children: [
            { path: '/profile', element: <ProfilePage /> },
            { path: '/favorites', element: <FavoritesPage /> },
            { path: '/seminar-certificates', element: <SeminarCertificatesPage /> }
        ]
    },
    
    // Admin Routes
    {
      path: '/admin',
      element: <ProtectedRoute requiredRoles={['ROLE_ADMIN']} />,
      children: [
        {
          element: (
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-screen">
                  <Loader className="animate-spin h-10 w-10 text-emerald-600" />
                </div>
              }
            >
              <AdminLayout />
            </Suspense>
          ),
          children: [
            { path: '', element: <AdminDashboardPage /> },
            { path: 'projects', element: <ManageProjectsPage /> },
            { path: 'courses', element: <ManageCoursesPage /> },
            { path: 'courses/:courseId/lessons', element: <ManageCourseLessonsPage /> },
            { path: 'instructors', element: <ManageInstructorsPage /> },
            { path: 'users', element: <ManageUsersPage /> },
            { path: 'announcements', element: <ManageAnnouncementsPage /> },
            { path: 'seminar-certificates', element: <ManageSeminarCertificatesPage /> },
          ],
        },
      ],
    },

    // Yukaridakilerden hicbiriyle eslesmeyen her adres (yanlis yazilmis link vb.)
    { path: '*', element: <NotFoundPage /> },
  ]);

  // Ilk sayfa acildiktan sonra, tarayici bosta kalinca sik gidilen sayfalari onceden
  // indir: kullanici menuden tikladiginda beklemeden acilsin.
  useEffect(() => {
    const prefetch = () => PREFETCH.forEach((load) => load().catch(() => { /* ag hatasi: tiklaninca yeniden denenir */ }));
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(prefetch, 2500);
    return () => clearTimeout(timer);
  }, []);

  return <Suspense fallback={<PageFallback />}>{routes}</Suspense>;
};
