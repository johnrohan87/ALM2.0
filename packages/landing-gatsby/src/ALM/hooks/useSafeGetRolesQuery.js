import { useGetRolesQuery } from '../store/api';
import { isBrowser } from '../utils/auth';

export const useSafeGetRolesQuery = () => {
  if (!isBrowser) {

    return { data: null, error: null, isLoading: false };
  }

  return useGetRolesQuery();
};
