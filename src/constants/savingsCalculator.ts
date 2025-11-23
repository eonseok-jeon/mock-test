/** 소비자 적금 계산기 탭 목록 */
export const SAVINGS_CALCULATOR_TABS = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

export type SavingsCalculatorTabType = (typeof SAVINGS_CALCULATOR_TABS)[keyof typeof SAVINGS_CALCULATOR_TABS];

/** 저축 기간 목록 */
export const SAVING_PERIODS = [
  { value: 6, label: '6개월' },
  { value: 12, label: '12개월' },
  { value: 24, label: '24개월' },
] as const;
