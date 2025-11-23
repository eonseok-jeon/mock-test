import { useGetSavingProducts } from 'hooks/useGetSavingProducts';
import { useState } from 'react';
import { Assets, Border, colors, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab } from 'tosslib';
import { SavingsProduct } from 'types/savingProducts';

export function SavingsCalculatorPage() {
  /** 목표 금액 입력 값 */
  const [enteredGoalAmount, setEnteredGoalAmount] = useState<number | null>(null);
  /** 월 납입액 입력 값 */
  const [enteredMonthlyAmount, setEnteredMonthlyAmount] = useState<number | null>(null);
  /** 저축 기간 입력 값 */
  const [enteredSavingPeriod, setEnteredSavingPeriod] = useState<number | null>(null);
  /** 선택한 탭 */
  const [selectedTab, setSelectedTab] = useState<'products' | 'results'>('products');
  /** 선택한 적금 상품 */
  const [selectedSavingProduct, setSelectedSavingProduct] = useState<SavingsProduct | null>(null);

  /** 적금 상품 목록 */
  const { data: savingProducts } = useGetSavingProducts(
    { enteredMonthlyAmount, enteredSavingPeriod },
    {
      select: data =>
        data.filter(
          product =>
            product.minMonthlyAmount <= (enteredMonthlyAmount ?? Infinity) &&
            product.maxMonthlyAmount >= (enteredMonthlyAmount ?? -Infinity) &&
            (enteredSavingPeriod ? product.availableTerms === enteredSavingPeriod : true)
        ),
    }
  );

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

      <Tab onChange={value => setSelectedTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' &&
        savingProducts?.map(product => (
          <ListRow
            key={product.id}
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={product.name}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: ${product.annualRate}%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            right={selectedSavingProduct?.id === product.id && <Assets.Icon name="icon-check-circle-green" />}
            onClick={() => setSelectedSavingProduct(product)}
          />
        ))}

      {/* 아래는 계산 결과 탭 내용이에요. 계산 결과 탭을 구현할 때 주석을 해제해주세요. */}
      {selectedTab === 'results' && (
        <>
          <Spacing size={8} />

          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`1,000,000원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="목표 금액과의 차이"
                topProps={{ color: colors.grey600 }}
                bottom={`-500,000원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="추천 월 납입 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`100,000원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          <ListRow
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={'기본 정기적금'}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: 3.2%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={`100,000원 ~ 500,000원 | 12개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            onClick={() => {}}
          />
          <ListRow
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={'고급 정기적금'}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: 2.8%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={`50,000원 ~ 1,000,000원 | 24개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            onClick={() => {}}
          />

          <Spacing size={40} />

          {/* 아래는 사용자가 적금 상품을 선택하지 않고 계산 결과 탭을 선택했을 때 출력해주세요. */}
          <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
        </>
      )}
    </>
  );
}
