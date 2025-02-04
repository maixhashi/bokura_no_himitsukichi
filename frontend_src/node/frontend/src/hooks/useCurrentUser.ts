import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useCurrentUser = () => {
  return useSelector((state: RootState) => state.auth.currentUser);
};
