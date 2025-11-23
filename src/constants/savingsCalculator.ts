export const SAVINGS_CALCULATOR_TABS = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

export type SavingsCalculatorTabType = (typeof SAVINGS_CALCULATOR_TABS)[keyof typeof SAVINGS_CALCULATOR_TABS];
