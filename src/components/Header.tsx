import { Link, useLocation } from "react-router-dom";
import { Leaf, LogIn, LogOut, UserCircle, Settings, Heart, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { isLoggedIn, logout, roles, fullName } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const getDisplayName = () => {
    if (roles.includes('ROLE_ADMIN')) {
        return t('header.admin_panel');
    }
    return fullName || t('header.user');
  };

  const handleAboutClick = () => {
    if (location.pathname === '/about') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    if (location.pathname === '/about' || location.pathname === '/contact') {
      setTimeout(() => {
        document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-600 rounded-lg shadow-sm">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">IDEC-TT</h1>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link to="/about" onClick={handleAboutClick} className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">{t('header.about')}</Link>
            <Link to="/projects" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">{t('header.projects')}</Link>
            <Link to="/courses" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">{t('header.academy')}</Link>
            <Link to="/contact" onClick={handleContactClick} className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">{t('header.contact')}</Link>
            {isLoggedIn && roles.includes('ROLE_ADMIN') && (
              <Link to="/admin" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors bg-emerald-50 px-3 py-1 rounded-md">{t('header.admin_panel')}</Link>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                Çalıştaylarımız
                <ChevronDown className="w-4 h-4 ml-1" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="https://kyddtr.wixsite.com/ulusal-karbon-yakala"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'} block px-4 py-2 text-sm`}
                        >
                          KYDD 2025
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          disabled
                          className={`${active ? 'bg-gray-50' : ''} block w-full text-left px-4 py-2 text-sm text-gray-500 cursor-not-allowed`}
                        >
                          Karbon Azaltım Sempozyumunu
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          disabled
                          className={`${active ? 'bg-gray-50' : ''} block w-full text-left px-4 py-2 text-sm text-gray-500 cursor-not-allowed`}
                        >
                          Zemin İstanbul
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            {/* Language Switcher */}
            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                         bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              {i18n.language === 'tr' ? 'EN' : 'TR'}
            </button>
            {isLoggedIn ? (
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all">
                    <UserCircle className="w-6 h-6" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-500">{t('header.welcome')}</p>
                      <p className="text-sm font-bold text-gray-900 truncate capitalize">
                        {getDisplayName()}
                      </p>
                    </div>
                    
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/favorites"
                            className={`${
                              active ? 'bg-emerald-500 text-white' : 'text-gray-700'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors`}
                          >
                            <Heart className="w-4 h-4 mr-2" aria-hidden="true" />
                            {t('header.favorites')}
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${
                              active ? 'bg-emerald-500 text-white' : 'text-gray-700'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors`}
                          >
                            <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
                            {t('header.profile_settings')}
                          </Link>
                        )}
                      </Menu.Item>
                    </div>

                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={`${
                              active ? 'bg-red-50 text-red-700' : 'text-gray-700'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors`}
                          >
                            <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                            {t('header.logout')}
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-emerald-600 text-white px-5 py-2.5 rounded-full hover:bg-emerald-700 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('header.login')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
