import { useRoutes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import CoursesPage from '../pages/CoursesPage';
import CourseDetailPage from '../pages/CourseDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';

// Admin Components
import AdminLayout from '../components/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ManageProjectsPage from '../pages/admin/ManageProjectsPage';
import ManageCoursesPage from '../pages/admin/ManageCoursesPage';
import ManageCourseLessonsPage from '../pages/admin/ManageCourseLessonsPage';

export const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/contact', element: <AboutPage /> }, // "İletişim" also points to AboutPage
    { path: '/projects', element: <ProjectsPage /> },
    { path: '/projects/:projectId', element: <ProjectDetailPage /> },
    { path: '/courses', element: <CoursesPage /> },
    { path: '/courses/:courseId', element: <CourseDetailPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/forgot-password', element: <ForgotPasswordPage /> },
    
    // Admin Routes
    {
      path: '/admin',
      element: <ProtectedRoute requiredRole="ROLE_ADMIN" />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { path: '', element: <AdminDashboardPage /> },
            { path: 'projects', element: <ManageProjectsPage /> },
            { path: 'courses', element: <ManageCoursesPage /> },
            { path: 'courses/:courseId/lessons', element: <ManageCourseLessonsPage /> },
          ],
        },
      ],
    },

    // Add a catch-all route for 404 if needed
    // { path: '*', element: <NotFoundPage /> },
  ]);

  return routes;
};
