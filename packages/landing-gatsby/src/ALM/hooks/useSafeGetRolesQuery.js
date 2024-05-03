import { useGetRolesQuery } from '../store/api';

export const useSafeGetRolesQuery = () => {
  const shouldSkip = typeof window === 'undefined';
  const result = useGetRolesQuery(undefined, {
    skip: shouldSkip,
  });
  
  if (shouldSkip) {
    return { data: null, error: null, isLoading: false };
  }

  return result;
};
