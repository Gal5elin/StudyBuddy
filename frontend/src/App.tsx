import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import WelcomePage from './components/WelcomePage';
import { UserProvider } from './components/Auth/UserContext';

function App() {
  const location = useLocation();
  const isRootPath = location.pathname === '/';

  return (
    <UserProvider>
      <Navbar />
      {isRootPath && <WelcomePage />}
      <Outlet />
    </UserProvider>
  );
}

export default App;
