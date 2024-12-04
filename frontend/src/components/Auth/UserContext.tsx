import { createContext, useContext, useEffect, useState } from 'react';
import { IUser } from '../../models/IUser';
import { getUser } from '../../api/authApi';

const UserContext = createContext<{
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  loading: boolean;
}>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (localStorage.getItem('token')) {
          const data = await getUser();
          setUser(data);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
