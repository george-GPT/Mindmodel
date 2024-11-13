import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { LoadingStateType } from '../store/authSlice';

export const useAuthState = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isAuthenticated,
    user,
    error,
    loading,
    isMember
  } = useSelector((state: RootState) => state.auth);

  const isLoading = (type: LoadingStateType) => loading[type];

  const isAnyLoading = Object.values(loading).some(Boolean);

  return {
    isAuthenticated,
    user,
    error,
    isLoading,
    isAnyLoading,
    isMember,
    dispatch
  };
}; 