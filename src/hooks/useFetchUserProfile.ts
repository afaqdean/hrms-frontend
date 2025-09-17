// hooks/useUserProfile.ts

import { API } from '@/Interceptors/Interceptor';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useFetchUserProfile = () => {
  const query = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data } = await API.get('/user/profile');
      return data;
    },
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      localStorage.setItem('user', JSON.stringify(query.data));
    }
  }, [query.isSuccess, query.data]);

  return query;
};
