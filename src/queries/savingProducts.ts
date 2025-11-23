import { http } from 'tosslib';
import { SavingsProduct } from 'types/savingProducts';

/** 적금 상품 목록 조회 */
export const getSavingProducts = async () => {
  const response = await http.get<SavingsProduct[]>('/api/savings-products');

  return response;
};
