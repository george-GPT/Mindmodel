import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import type { AuthState, LoadingStateType } from '../types/auth';
import type { ApiError } from '../types/error';

export const useAuthState = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isAuthenticated,
    user,
    error,
    loading,
    isMember
  } = useSelector((state: RootState) => state.auth);

  const isLoading = (type: LoadingStateType): boolean => loading[type];

  const isAnyLoading = Object.values(loading).some(Boolean);

  return {
    isAuthenticated,
    user,
    error,
    isLoading,
    isAnyLoading,
    isMember,
    dispatch
  } as const;
}; 