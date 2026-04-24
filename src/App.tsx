import { AppRoutes } from './routes';
import KarbonBot from './components/KarbonBot';
import { useAuth } from './context/AuthContext';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <AppRoutes />
      <KarbonBot isLoggedIn={isLoggedIn} />
    </>
  );
}

export default App;
