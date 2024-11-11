// src/components/PrivateRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Box, CircularProgress } from '@mui/material';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiresMember?: boolean;
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiresMember = false,
  redirectTo = '/login',
}) => {
  const location = useLocation();
  const { isAuthenticated, isMember, loading } = useSelector(
    (state: RootState) => state.auth
  );

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiresMember && !isMember) {
    // Redirect to upgrade page for non-members
    return <Navigate to="/upgrade" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
