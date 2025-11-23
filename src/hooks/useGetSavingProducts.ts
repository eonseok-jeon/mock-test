import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getSavingProducts } from 'queries/savingProducts';
import { SavingsProduct } from 'types/savingProducts';

/** 적금 상품 목록 조회 hook */
export const useGetSavingProducts = (options?: UseQueryOptions<SavingsProduct[], Error>) => {
  return useQuery({
    queryKey: ['savingProducts'],
    queryFn: getSavingProducts,
    ...options,
  });
};
