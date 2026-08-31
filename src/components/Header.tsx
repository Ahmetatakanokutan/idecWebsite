import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Award,
  ChevronDown,
  Globe2,
  Heart,
  Leaf,
  LogIn,
  LogOut,
  Menu as MenuIcon,
  Settings,
  UserCircle,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

interface SubNavItem {
  key: string;
  labelKey?: string;
  label?: string;
  to?: string;
  href?: string;
  disabled?: boolean;
}

interface NavLink {
  key: string;
  labelKey: string;
  to: string;
  onClick?: () => void;
}

interface DropdownNav {
  key: string;
  labelKey?: string;
  label?: string;
  items: SubNavItem[];
}

type MainNavEntry =
  | { type: 'link'; data: NavLink }
  | { type: 'dropdown'; data: DropdownNav };

const Header = () => {
  const { isLoggedIn, logout, roles, fullName } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sayfa değişince açık kalan mobil menüyü kapat.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

  // Düz linkler: yeni bir başlık eklemek buraya bir satır eklemek kadar basit.
  const navLinks: NavLink[] = [
    { key: 'about', labelKey: 'header.about', to: '/about', onClick: handleAboutClick },
    { key: 'projects', labelKey: 'header.projects', to: '/projects' },
    { key: 'contact', labelKey: 'header.contact', to: '/contact', onClick: handleContactClick },
  ];

  // Açılır menüler: yeni bir başlık ya da alt öğe eklemek yine diziye bir satır eklemek kadar kolay.
  const dropdownMenus: DropdownNav[] = [
    {
      key: 'academy',
      labelKey: 'header.academy',
      items: [
        { key: 'academy-courses', labelKey: 'header.academy_courses', to: '/courses' },
        { key: 'academy-webinars', labelKey: 'header.academy_webinars', to: '/courses?tab=webinars' },
      ],
    },
    {
      key: 'workshops',
      label: 'Çalıştaylarımız',
      items: [
        { key: 'kydd-2025', label: 'KYDD 2025', href: 'https://kyddtr.wixsite.com/ulusal-karbon-yakala' },
        { key: 'karbon-azaltim', label: 'Karbon Azaltım Sempozyumunu', disabled: true },
        { key: 'zemin-istanbul', label: 'Zemin İstanbul', disabled: true },
      ],
    },
  ];

  // Ana satırdaki görünüm sırası: Hakkımızda, Ortaklarımız, Akademi, Çalıştaylarımız, İletişim.
  // Yeni bir başlık eklemek: navLinks/dropdownMenus'a satırı ekle + anahtarını burada istediğin yere koy.
  const mainNavOrder = ['about', 'projects', 'academy', 'workshops', 'contact'];
  const mainNavEntries: MainNavEntry[] = mainNavOrder
    .map((key): MainNavEntry | null => {
      const link = navLinks.find((l) => l.key === key);
      if (link) return { type: 'link', data: link };
      const dropdown = dropdownMenus.find((d) => d.key === key);
      if (dropdown) return { type: 'dropdown', data: dropdown };
      return null;
    })
    .filter((entry): entry is MainNavEntry => entry !== null);

  const renderNavLink = (item: NavLink, variant: 'desktop' | 'mobile') => (
    <Link
      key={item.key}
      to={item.to}
      onClick={item.onClick}
      className={
        variant === 'desktop'
          ? 'text-gray-600 hover:text-brand font-medium transition-colors whitespace-nowrap flex-shrink-0'
          : 'block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-brand'
      }
    >
      {t(item.labelKey)}
    </Link>
  );

  const renderDropdown = (menu: DropdownNav) => (
    <Menu key={menu.key} as="div" className="relative inline-block text-left flex-shrink-0">
      <Menu.Button className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-brand-light/10 hover:text-brand focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand whitespace-nowrap">
        {menu.labelKey ? t(menu.labelKey) : menu.label}
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
            {menu.items.map((sub) => {
              const label = sub.labelKey ? t(sub.labelKey) : sub.label;

              if (sub.disabled) {
                return (
                  <Menu.Item key={sub.key} disabled>
                    {({ active }) => (
                      <button
                        type="button"
                        disabled
                        className={`${active ? 'bg-gray-50' : ''} block w-full text-left px-4 py-2 text-sm text-gray-500 cursor-not-allowed`}
                      >
                        {label}
                      </button>
                    )}
                  </Menu.Item>
                );
              }

              if (sub.href) {
                return (
                  <Menu.Item key={sub.key}>
                    {({ active }) => (
                      <a
                        href={sub.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${active ? 'bg-brand-light/10 text-brand' : 'text-gray-700'} block px-4 py-2 text-sm`}
                      >
                        {label}
                      </a>
                    )}
                  </Menu.Item>
                );
              }

              return (
                <Menu.Item key={sub.key}>
                  {({ active }) => (
                    <Link
                      to={sub.to!}
                      className={`${active ? 'bg-brand-light/10 text-brand' : 'text-gray-700'} block px-4 py-2 text-sm`}
                    >
                      {label}
                    </Link>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );

  const carbonButton = (variant: 'desktop' | 'mobile') => (
    <a
      href="https://greentim.com/"
      target="_blank"
      rel="noopener noreferrer"
      className={
        variant === 'desktop'
          ? 'flex items-center space-x-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors shadow-sm hover:shadow-md flex-shrink-0 whitespace-nowrap'
          : 'flex items-center justify-center space-x-2 bg-brand text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors shadow-sm'
      }
    >
      <Globe2 className="w-4 h-4" />
      <span>{t('header.carbon_calc_button')}</span>
    </a>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 font-archivo">
      {/* Üst şerit: ince, koyu marka yeşili, sağa hizalı yönetim/dil/giriş */}
      <div className="bg-brand-dark">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="flex items-center justify-between h-9">
            <div />
            <div className="flex items-center gap-4 flex-shrink-0 whitespace-nowrap">
              {isLoggedIn && roles.includes('ROLE_ADMIN') && (
                <Link
                  to="/admin"
                  className="text-white font-semibold hover:text-brand-light transition-colors bg-brand-light/20 px-2.5 py-0.5 rounded-md text-xs"
                >
                  {t('header.admin_panel')}
                </Link>
              )}
              <button
                onClick={() => i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}
                className="text-xs font-medium text-white/80 hover:text-brand-light transition-colors"
              >
                {i18n.language === 'tr' ? 'EN' : 'TR'}
              </button>
              {isLoggedIn ? (
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="flex items-center justify-center w-7 h-7 bg-white/10 text-white rounded-full hover:bg-white/20 hover:text-brand-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-light transition-all">
                      <UserCircle className="w-4 h-4" />
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
                                active ? 'bg-brand text-white' : 'text-gray-700'
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
                                active ? 'bg-brand text-white' : 'text-gray-700'
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors`}
                            >
                              <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
                              {t('header.profile_settings')}
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/certificate"
                              className={`${
                                active ? 'bg-brand text-white' : 'text-gray-700'
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors`}
                            >
                              <Award className="w-4 h-4 mr-2" aria-hidden="true" />
                              {t('header.certificate')}
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
                  className="text-white/80 hover:text-brand-light transition-colors"
                  title={t('header.login')}
                  aria-label={t('header.login')}
                >
                  <LogIn className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ana satır: logo + ana menü / hamburger */}
      <div className="border-b border-brand-light/30">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 bg-brand rounded-lg shadow-sm">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight whitespace-nowrap">IDEC-TT</h1>
            </Link>

            {/* Masaüstü ana menü */}
            <nav className="hidden xl:flex flex-wrap items-center justify-end gap-x-8 gap-y-2">
              {mainNavEntries.map((entry) =>
                entry.type === 'link' ? renderNavLink(entry.data, 'desktop') : renderDropdown(entry.data)
              )}
              {carbonButton('desktop')}
            </nav>

            {/* Hamburger: sadece dar ekranlarda */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="xl:hidden flex-shrink-0 p-2 rounded-lg text-gray-600 hover:bg-brand-light/10 hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand transition-colors"
              aria-label={mobileMenuOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobil menü paneli: ana satırdaki tüm öğeler burada toplanıyor */}
          {mobileMenuOpen && (
            <div className="xl:hidden pb-4 space-y-1 border-t border-gray-100 pt-3">
              {mainNavEntries.map((entry) =>
                entry.type === 'link' ? (
                  renderNavLink(entry.data, 'mobile')
                ) : (
                  <div key={entry.data.key} className="px-3 py-1">
                    {renderDropdown(entry.data)}
                  </div>
                )
              )}
              <div className="px-3 pt-2">{carbonButton('mobile')}</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
