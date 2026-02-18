import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FolderKanban, Library, LayoutDashboard, Users, Shield, Bell } from 'lucide-react';
import Layout from './Layout';

const AdminLayout = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-emerald-100 hover:text-emerald-800 transition-colors ${
      isActive ? 'bg-emerald-200 text-emerald-900 font-semibold' : ''
    }`;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Admin Menüsü</h2>
            <nav className="space-y-2">
              <NavLink to="/admin" end className={navLinkClasses}>
                <LayoutDashboard className="mr-3 h-5 w-5" />
                <span>Panel</span>
              </NavLink>
              <NavLink to="/admin/projects" className={navLinkClasses}>
                <FolderKanban className="mr-3 h-5 w-5" />
                <span>Paydaşlarımız ve İştiraklerimiz</span>
              </NavLink>
              <NavLink to="/admin/announcements" className={navLinkClasses}>
                <Bell className="mr-3 h-5 w-5" />
                <span>Duyuruları Yönet</span>
              </NavLink>
              <NavLink to="/admin/courses" className={navLinkClasses}>
                <Library className="mr-3 h-5 w-5" />
                <span>Kursları Yönet</span>
              </NavLink>
              <NavLink to="/admin/instructors" className={navLinkClasses}>
                <Users className="mr-3 h-5 w-5" />
                <span>Eğitmenleri Yönet</span>
              </NavLink>
              <NavLink to="/admin/users" className={navLinkClasses}>
                <Shield className="mr-3 h-5 w-5" />
                <span>Kullanıcıları Yönet</span>
              </NavLink>
            </nav>
          </aside>
          <main className="md:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLayout;