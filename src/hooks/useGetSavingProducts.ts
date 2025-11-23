import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getSavingProducts } from 'queries/savingProducts';
import { SavingsProduct } from 'types/savingProducts';

/** 적금 상품 목록 조회 hook */
export const useGetSavingProducts = (
  params: { enteredMonthlyAmount: number | null; enteredSavingPeriod: number | null },
  options?: Omit<UseQueryOptions<SavingsProduct[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['savingProducts', params.enteredMonthlyAmount, params.enteredSavingPeriod],
    queryFn: getSavingProducts,
    ...options,
  });
};
