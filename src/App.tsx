import { AppRoutes } from './routes';
import KarbonBot from './components/KarbonBot';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './context/AuthContext';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
      <KarbonBot isLoggedIn={isLoggedIn} />
    </>
  );
}

export default App;
