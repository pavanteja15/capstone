import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getStoredUser } from '../../utils/authUtils';
import { useAppDispatch } from '../../store/hooks';
import { setUser } from '../../store/userSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const storedUser = getStoredUser();
        if (storedUser) {
          dispatch(setUser(storedUser));
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } else {
        setIsAuth(false);
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [dispatch]);

  // Show nothing while checking authentication
  if (isChecking) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
