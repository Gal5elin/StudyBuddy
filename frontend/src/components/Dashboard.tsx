import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './Auth/UserContext';
import { logout } from '../api/authApi';
import InfoCard from './common/InfoCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, setUser } = useUser();
  const [info, setInfo] = useState<{
    type: 'ok' | 'error' | 'warning';
    title: string;
    description: string;
  } | null>(null);

  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    if (!loading && !user && !loggedOut) {
      navigate('/login');
    }
  }, [user, loading, loggedOut, navigate]);

  const handleLogout = () => {
    setInfo({
      type: 'warning',
      title: 'Logging Out',
      description: 'You have been successfully logged out.',
    });
    logout();
    setLoggedOut(true);
  };

  const handleCloseInfoCard = () => {
    setInfo(null);
    setUser(null);
    navigate('/');
  };

  if (!user && !info) {
    return null;
  }

  return (
    <div>
      {info && (
        <InfoCard
          type={info.type}
          title={info.title}
          description={info.description}
          onClose={handleCloseInfoCard}
        />
      )}
      {!info && user && (
        <div>
          <h1>Dashboard</h1>
          <h4>Hello, {user.username}</h4>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
