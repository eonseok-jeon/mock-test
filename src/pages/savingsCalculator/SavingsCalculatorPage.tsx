import { useState } from 'react';
import { Border, NavigationBar, SelectBottomSheet, Spacing, Tab } from 'tosslib';
import { SavingsProduct } from 'types/savingProducts';
import { SavingProducts } from './SavingProducts';
import { SavingResults } from './SavingResults';
import { SAVINGS_CALCULATOR_TABS, type SavingsCalculatorTabType } from 'constants/savingsCalculator';

export function SavingsCalculatorPage() {
  /** 목표 금액 입력 값 */
  const [enteredGoalAmount, setEnteredGoalAmount] = useState<number | null>(null);
  /** 월 납입액 입력 값 */
  const [enteredMonthlyAmount, setEnteredMonthlyAmount] = useState<number | null>(null);
  /** 저축 기간 입력 값 */
  const [enteredSavingPeriod, setEnteredSavingPeriod] = useState<number | null>(null);
  /** 선택한 탭 */
  const [selectedTab, setSelectedTab] = useState<SavingsCalculatorTabType>(SAVINGS_CALCULATOR_TABS.PRODUCTS);
  /** 선택한 적금 상품 */
  const [selectedSavingProduct, setSelectedSavingProduct] = useState<SavingsProduct | null>(null);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <label htmlFor="목표 금액">목표 금액</label>
      <input
        id="목표 금액"
        type="number"
        placeholder="목표 금액을 입력하세요"
        value={enteredGoalAmount ?? ''}
        onChange={e => setEnteredGoalAmount(Number(e.target.value))}
      />
      <Spacing size={16} />
      <label htmlFor="월 납입액">월 납입액</label>
      <input
        id="월 납입액"
        type="number"
        placeholder="희망 월 납입액을 입력하세요"
        value={enteredMonthlyAmount ?? ''}
        onChange={e => setEnteredMonthlyAmount(Number(e.target.value))}
      />
      <Spacing size={16} />
      <label htmlFor="저축 기간">저축 기간</label>
      <SelectBottomSheet
        title="저축 기간을 선택해주세요"
        value={enteredSavingPeriod}
        onChange={value => setEnteredSavingPeriod(value)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as SavingsCalculatorTabType)}>
        <Tab.Item value={SAVINGS_CALCULATOR_TABS.PRODUCTS} selected={selectedTab === SAVINGS_CALCULATOR_TABS.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={SAVINGS_CALCULATOR_TABS.RESULTS} selected={selectedTab === SAVINGS_CALCULATOR_TABS.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

      {/* 적금 상품 */}
      {selectedTab === SAVINGS_CALCULATOR_TABS.PRODUCTS && (
        <SavingProducts
          enteredMonthlyAmount={enteredMonthlyAmount}
          enteredSavingPeriod={enteredSavingPeriod}
          selectedSavingProduct={selectedSavingProduct}
          onSelectSavingProduct={value => setSelectedSavingProduct(value)}
        />
      )}

      {/* 계산 결과 */}
      {selectedTab === SAVINGS_CALCULATOR_TABS.RESULTS && (
        <SavingResults
          enteredGoalAmount={enteredGoalAmount}
          enteredMonthlyAmount={enteredMonthlyAmount}
          enteredSavingPeriod={enteredSavingPeriod}
          selectedSavingProduct={selectedSavingProduct}
          onSelectSavingProduct={value => setSelectedSavingProduct(value)}
        />
      )}
    </>
  );
}
