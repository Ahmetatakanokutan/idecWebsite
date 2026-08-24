import { Suspense, lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import { Loader } from 'lucide-react';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import CoursesPage from '../pages/CoursesPage';
import CourseDetailPage from '../pages/CourseDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import CertificatePage from '../pages/CertificatePage';
import SeminarCertificatesPage from '../pages/SeminarCertificatesPage';
import AnnouncementDetailPage from '../pages/AnnouncementDetailPage';
import ProfilePage from '../pages/ProfilePage';
import FavoritesPage from '../pages/FavoritesPage';

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
    { path: '/contact', element: <AboutPage /> },
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
  ]);

  return routes;
};
