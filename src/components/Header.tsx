import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Award,
  ChevronDown,
  ExternalLink,
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
import { Fragment, type ReactNode } from "react";
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

// Ust seritteki dil segmenti — yeni bir dil eklemek buraya bir kod eklemek kadar basit.
const LANGUAGES = ['tr', 'en'] as const;

type MainNavEntry =
  | { type: 'link'; data: NavLink }
  | { type: 'dropdown'; data: DropdownNav };

const Header = () => {
  const { isLoggedIn, logout, roles, fullName } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // Sayfa değişince açık kalan mobil menüyü kapat.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Kaydirinca: ana satir incelir + cam efekti alir, altindaki ince cizgi okuma
  // ilerlemesini gosterir. Ilerleme cizgisi her karede React render'i tetiklemesin
  // diye dogrudan ref uzerinden transform ile guncelleniyor; `scrolled` sadece
  // esik gecildiginde degisir.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      // Histerezis: header incelince sayfa ~20px kisaliyor; tek esik olsaydi
      // zar zor kayan sayfalarda ince/kalin arasinda gidip gelirdi.
      setScrolled((prev) => (prev ? y > 8 : y > 40));
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  const isActivePath = (to?: string) => {
    if (!to) return false;
    const path = to.split('?')[0];
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

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
    if (location.pathname === '/contact') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      labelKey: 'header.workshops',
      items: [
        { key: 'kydd-2025', label: 'KYDD 2025', href: 'https://kyddtr.wixsite.com/ulusal-karbon-yakala' },
        { key: 'karbon-azaltim', labelKey: 'header.workshop_carbon_symposium', disabled: true },
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

  // Masaustu menu ogelerinin ortak gorunumu: duz metin + altta yesil cizgi.
  // Aktif sayfada cizgi kalici, digerlerinde hover'da soldan saga dolar.
  const desktopItemClass = (active: boolean) =>
    `relative inline-flex items-center font-medium whitespace-nowrap flex-shrink-0 transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:rounded-full after:bg-accent-bright after:transition-all after:duration-300 after:ease-out-expo ${
      active ? 'text-ink-deep after:w-full' : 'text-gray-600 hover:text-ink-deep after:w-0 hover:after:w-full'
    }`;

  const renderNavLink = (item: NavLink) => (
    <Link
      key={item.key}
      to={item.to}
      onClick={item.onClick}
      aria-current={isActivePath(item.to) ? 'page' : undefined}
      className={desktopItemClass(isActivePath(item.to))}
    >
      {t(item.labelKey)}
    </Link>
  );

  const subLabel = (sub: SubNavItem) => (sub.labelKey ? t(sub.labelKey) : sub.label);

  const renderDropdown = (menu: DropdownNav) => {
    const groupActive = menu.items.some((sub) => isActivePath(sub.to));
    return (
      <Menu key={menu.key} as="div" className="relative inline-block text-left flex-shrink-0">
        {({ open }) => (
          <>
            <Menu.Button
              className={`${desktopItemClass(groupActive || open)} gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-deep focus-visible:ring-offset-4 rounded-sm`}
            >
              {menu.labelKey ? t(menu.labelKey) : menu.label}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 -translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-1"
            >
              <Menu.Items className="absolute right-0 mt-4 w-72 origin-top-right rounded-xl bg-white p-1.5 shadow-xl shadow-ink-deep/10 ring-1 ring-black/5 focus:outline-none z-50">
                {menu.items.map((sub) => {
                  const label = subLabel(sub);

                  if (sub.disabled) {
                    return (
                      <Menu.Item key={sub.key} disabled>
                        <span className="flex items-center justify-between gap-3 w-full px-3 py-2 text-sm text-gray-400 cursor-not-allowed">
                          {label}
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
                            {t('header.coming_soon')}
                          </span>
                        </span>
                      </Menu.Item>
                    );
                  }

                  const itemClass = (active: boolean) =>
                    `${active ? 'bg-accent-bright/10 text-ink-deep' : 'text-gray-700'} flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm transition-colors`;

                  if (sub.href) {
                    return (
                      <Menu.Item key={sub.key}>
                        {({ active }) => (
                          <a href={sub.href} target="_blank" rel="noopener noreferrer" className={itemClass(active)}>
                            {label}
                            <ExternalLink className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
                          </a>
                        )}
                      </Menu.Item>
                    );
                  }

                  return (
                    <Menu.Item key={sub.key}>
                      {({ active }) => (
                        <Link to={sub.to!} className={itemClass(active)}>
                          {label}
                        </Link>
                      )}
                    </Menu.Item>
                  );
                })}
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    );
  };

  const carbonButton = (variant: 'desktop' | 'mobile') => (
    <a
      href="https://greentim.com/"
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-2 bg-cta-gradient text-white rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-md shadow-accent-deep/25 hover:shadow-lg ${
        variant === 'desktop' ? 'px-4 py-2 flex-shrink-0 whitespace-nowrap' : 'justify-center px-4 py-2.5'
      }`}
    >
      <Globe2 className="w-4 h-4 transition-transform duration-700 ease-out-expo group-hover:rotate-[360deg]" />
      <span>{t('header.carbon_calc_button')}</span>
    </a>
  );

  // Mobil panel: acilir menuler ayri bir katman olarak degil, baslik + alt linkler
  // halinde duz liste. Her satir soldan sirayla kayarak gelir.
  const mobileRows: ReactNode[] =mainNavEntries.flatMap((entry) => {
    if (entry.type === 'link') {
      const active = isActivePath(entry.data.to);
      return [
        <Link
          key={entry.data.key}
          to={entry.data.to}
          onClick={entry.data.onClick}
          aria-current={active ? 'page' : undefined}
          className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
            active ? 'bg-accent-bright/10 text-ink-deep' : 'text-gray-700 hover:bg-accent-bright/10 hover:text-ink-deep'
          }`}
        >
          {t(entry.data.labelKey)}
        </Link>,
      ];
    }
    const menu = entry.data;
    return [
      <p key={`${menu.key}-title`} className="px-3 pt-4 pb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-accent-deep">
        {menu.labelKey ? t(menu.labelKey) : menu.label}
      </p>,
      ...menu.items.map((sub) => {
        const label = subLabel(sub);
        const base = 'flex items-center justify-between gap-3 pl-6 pr-3 py-2 rounded-lg text-[15px]';
        if (sub.disabled) {
          return (
            <span key={sub.key} className={`${base} text-gray-400`}>
              {label}
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
                {t('header.coming_soon')}
              </span>
            </span>
          );
        }
        if (sub.href) {
          return (
            <a key={sub.key} href={sub.href} target="_blank" rel="noopener noreferrer" className={`${base} text-gray-700 hover:bg-accent-bright/10`}>
              {label}
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
            </a>
          );
        }
        const active = isActivePath(sub.to);
        return (
          <Link
            key={sub.key}
            to={sub.to!}
            className={`${base} ${active ? 'bg-accent-bright/10 text-ink-deep' : 'text-gray-700 hover:bg-accent-bright/10'}`}
          >
            {label}
          </Link>
        );
      }),
    ];
  });

  return (
    <header className="shadow-sm sticky top-0 z-50 font-archivo">
      {/* Üst şerit: ince, koyu marka yeşili, sağa hizalı yönetim/dil/giriş */}
      <div className="bg-ink-deep">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="flex items-center justify-between h-10 gap-4">
            {/* Sol: IDEC-TT kisaltmasinin acilimi — ziyaretci daha kaydirmadan
                sitenin ne oldugunu ogrensin. Dar ekranda gizleniyor. */}
            <p className="hidden md:flex items-center gap-2 min-w-0 text-xs text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              <span className="truncate">{t('header.tagline')}</span>
            </p>
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 whitespace-nowrap ml-auto">
              {isLoggedIn && roles.includes('ROLE_ADMIN') && (
                <Link
                  to="/admin"
                  className="text-white font-semibold hover:text-ink-deep hover:bg-accent transition-colors bg-white/15 px-2.5 py-0.5 rounded-md text-xs"
                >
                  {t('header.admin_panel')}
                </Link>
              )}
              {/* Iki secenegi de gosteren segment: aktif olan dolu, digeri tiklanabilir.
                  Tek harflik eski buton fark edilmiyordu. */}
              <div className="flex items-center gap-0.5 rounded-md bg-white/10 p-0.5" role="group" aria-label="Language">
                {LANGUAGES.map((lng) => {
                  const isActive = i18n.language?.startsWith(lng);
                  return (
                    <button
                      key={lng}
                      type="button"
                      onClick={() => i18n.changeLanguage(lng)}
                      aria-pressed={isActive}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide transition-colors ${
                        isActive ? 'bg-accent text-ink-deep' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {lng.toUpperCase()}
                    </button>
                  );
                })}
              </div>
              {isLoggedIn ? (
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="flex items-center justify-center w-7 h-7 bg-white/10 text-white rounded-full hover:bg-white/20 hover:text-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ink-deep focus:ring-accent transition-all">
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
                                active ? 'bg-ink-deep text-white' : 'text-gray-700'
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
                                active ? 'bg-ink-deep text-white' : 'text-gray-700'
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
                                active ? 'bg-ink-deep text-white' : 'text-gray-700'
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
                  className="flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-accent transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('header.login')}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ana satır: logo + ana menü / hamburger. Kaydırınca incelir ve cam efekti alır. */}
      <div
        className={`relative border-b transition-colors duration-500 ${
          scrolled ? 'bg-white/85 backdrop-blur-lg border-gray-200/70' : 'bg-white border-gray-200'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className={`flex items-center justify-between transition-[padding] duration-500 ease-out-expo ${scrolled ? 'py-2.5' : 'py-4'}`}>
            <Link to="/" className="group flex items-center gap-3 flex-shrink-0" aria-label="IDEC-TT">
              <span
                className={`flex items-center justify-center bg-accent-gradient rounded-lg shadow-md shadow-accent-bright/25 transition-all duration-500 ease-out-expo ${
                  scrolled ? 'w-10 h-10' : 'w-12 h-12'
                }`}
              >
                <Leaf className="w-7 h-7 text-white transition-transform duration-700 ease-out-expo group-hover:-rotate-12 group-hover:scale-110" />
              </span>
              {/* Logo metni h1 degil: her sayfanin kendi h1'i var, sayfada tek h1 kalsin. */}
              <span
                className={`font-bold text-ink-deep tracking-tight whitespace-nowrap transition-all duration-500 ease-out-expo ${
                  scrolled ? 'text-2xl' : 'text-3xl'
                }`}
              >
                IDEC-TT
              </span>
            </Link>

            {/* Masaüstü ana menü */}
            {/* 1280-1440px laptoplarda gap-x-8 ile karbon butonu ikinci satira dusuyordu */}
            <nav className="hidden xl:flex flex-wrap items-center justify-end gap-x-6 2xl:gap-x-8 gap-y-2">
              {mainNavEntries.map((entry) =>
                entry.type === 'link' ? renderNavLink(entry.data) : renderDropdown(entry.data)
              )}
              {carbonButton('desktop')}
            </nav>

            {/* Hamburger: sadece dar ekranlarda */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="xl:hidden flex-shrink-0 p-2 rounded-lg text-gray-600 hover:bg-accent-bright/15 hover:text-ink-deep focus:outline-none focus:ring-2 focus:ring-accent-deep transition-colors"
              aria-label={mobileMenuOpen ? t('header.menu_close') : t('header.menu_open')}
              aria-expanded={mobileMenuOpen}
            >
              <span className="relative block w-6 h-6">
                <MenuIcon
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100'}`}
                />
                <X
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 -rotate-90 scale-50'}`}
                />
              </span>
            </button>
          </div>

          {/* Mobil menü paneli: ana satırdaki tüm öğeler burada, soldan sırayla kayarak gelir */}
          {mobileMenuOpen && (
            <div className="xl:hidden pb-4 border-t border-gray-100 pt-3 max-h-[calc(100vh-7rem)] overflow-y-auto">
              {[...mobileRows, <div key="carbon" className="px-3 pt-4">{carbonButton('mobile')}</div>].map((row, i) => (
                <div
                  key={i}
                  className="motion-safe:animate-menu-item-in"
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  {row}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Okuma ilerlemesi: sayfa kaydıkça soldan sağa dolan ince çizgi */}
        <div
          ref={progressRef}
          className="absolute left-0 right-0 -bottom-px h-0.5 origin-left bg-gradient-to-r from-accent-bright via-sky-bright to-accent-bright"
          style={{ transform: 'scaleX(0)' }}
          aria-hidden="true"
        />
      </div>
    </header>
  );
};

export default Header;
