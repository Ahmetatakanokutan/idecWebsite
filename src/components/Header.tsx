import { Link } from "react-router-dom";
import { Leaf, LogIn, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Menu } from "@headlessui/react";
import { Fragment } from "react";

const Header = () => {
  const { isLoggedIn, logout, roles } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-600 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">IDEC-TT</h1>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link to="/about" className="text-gray-700 hover:text-emerald-600 transition-colors">Hakkında</Link>
            <Link to="/projects" className="text-gray-700 hover:text-emerald-600 transition-colors">Projeler</Link>
            <Link to="/courses" className="text-gray-700 hover:text-emerald-600 transition-colors">IDEC Akademi</Link>
            <Link to="/contact" className="text-gray-700 hover:text-emerald-600 transition-colors">İletişim</Link>
            {isLoggedIn && roles.includes('ROLE_ADMIN') && (
              <Link to="/admin" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">Yönetim Paneli</Link>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                    <UserCircle className="w-6 h-6 text-gray-700" />
                  </Menu.Button>
                </div>
                <Menu.Items
                  as="div"
                  className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="px-1 py-1 ">
                    {roles && roles.length > 0 && (
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            className={`${
                              active ? 'bg-emerald-500 text-white' : 'text-gray-900'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm font-semibold`}
                          >
                            {roles.join(', ')}
                          </span>
                        )}
                      </Menu.Item>
                    )}
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`${
                            active ? 'bg-emerald-500 text-white' : 'text-gray-900'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        >
                          <LogOut className="w-5 h-5 mr-2" aria-hidden="true" />
                          Çıkış Yap
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
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
