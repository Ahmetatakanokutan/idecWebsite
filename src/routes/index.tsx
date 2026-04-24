import { useRoutes } from 'react-router-dom';
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
import ProfilePage from '../pages/ProfilePage';
import FavoritesPage from '../pages/FavoritesPage';

// Admin Components
import AdminLayout from '../components/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ManageProjectsPage from '../pages/admin/ManageProjectsPage';
import ManageCoursesPage from '../pages/admin/ManageCoursesPage';
import ManageCourseLessonsPage from '../pages/admin/ManageCourseLessonsPage';
import ManageInstructorsPage from '../pages/admin/ManageInstructorsPage';
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import ManageAnnouncementsPage from '../pages/admin/ManageAnnouncementsPage';

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
    
    // Protected User Routes (Any logged in user)
    {
        element: <ProtectedRoute />, 
        children: [
            { path: '/profile', element: <ProfilePage /> },
            { path: '/favorites', element: <FavoritesPage /> }
        ]
    },
    
    // Admin Routes
    {
      path: '/admin',
      element: <ProtectedRoute requiredRoles={['ROLE_ADMIN']} />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { path: '', element: <AdminDashboardPage /> },
            { path: 'projects', element: <ManageProjectsPage /> },
            { path: 'courses', element: <ManageCoursesPage /> },
            { path: 'courses/:courseId/lessons', element: <ManageCourseLessonsPage /> },
            { path: 'instructors', element: <ManageInstructorsPage /> },
            { path: 'users', element: <ManageUsersPage /> },
            { path: 'announcements', element: <ManageAnnouncementsPage /> },
          ],
        },
      ],
    },
  ]);

  return routes;
};
