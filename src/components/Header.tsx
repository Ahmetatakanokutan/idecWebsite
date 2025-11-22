import { Link } from "react-router-dom";
import { Leaf, LogIn, LogOut, UserCircle, Settings, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

const Header = () => {
  const { isLoggedIn, logout, roles, fullName } = useAuth();

  const getDisplayName = () => {
    if (roles.includes('ROLE_ADMIN')) {
        return 'Admin';
    }
    return fullName || 'Kullanıcı';
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
            <Link to="/about" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Hakkında</Link>
            <Link to="/projects" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Projeler</Link>
            <Link to="/courses" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">IDEC Akademi</Link>
            <Link to="/contact" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">İletişim</Link>
            {isLoggedIn && roles.includes('ROLE_ADMIN') && (
              <Link to="/admin" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors bg-emerald-50 px-3 py-1 rounded-md">Yönetim Paneli</Link>
            )}
          </nav>
          <div className="flex items-center space-x-4">
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
                      <p className="text-sm text-gray-500">Hoşgeldiniz</p>
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
                            Favorilerim
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
                            Profil Ayarları
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
                            Çıkış Yap
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
                <span>Giriş Yap</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
