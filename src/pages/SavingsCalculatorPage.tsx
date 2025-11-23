import { useGetSavingProducts } from 'hooks/useGetSavingProducts';
import { useMemo, useState } from 'react';
import { Assets, Border, colors, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab } from 'tosslib';
import { SavingsProduct } from 'types/savingProducts';
import { roundToThousands } from 'utils/roundToThousands';

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

  /** 추천 적금 상품 목록 (2개)) */
  const sortedSavingProducts = useMemo(() => {
    return savingProducts?.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
  }, [savingProducts]);

  /** 예상 수입 금액 (= 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)) */
  const expectedIncomeAmount = useMemo(() => {
    return roundToThousands(
      (enteredMonthlyAmount ?? 0) *
        (selectedSavingProduct?.availableTerms ?? 0) *
        (1 + (selectedSavingProduct?.annualRate ?? 0) * 0.5)
    );
  }, [enteredMonthlyAmount, selectedSavingProduct]);

  /** 목표 금액과의 차이 (= 목표 금액 - 예상 수익 금액) */
  const differenceBetweenGoalAmount = useMemo(() => {
    return roundToThousands((enteredGoalAmount ?? 0) - expectedIncomeAmount);
  }, [enteredGoalAmount, expectedIncomeAmount]);

  /** 추천 월 납입 금액 (= 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))) */
  const recommendedMonthlyAmount = useMemo(() => {
    return roundToThousands(
      (enteredGoalAmount ?? 0) /
        (selectedSavingProduct?.availableTerms ?? 0) /
        (1 + (selectedSavingProduct?.annualRate ?? 0) * 0.5)
    );
  }, [enteredGoalAmount, selectedSavingProduct]);

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
          {selectedSavingProduct ? (
            <>
              <Spacing size={8} />

              <ListRow
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top="예상 수익 금액"
                    topProps={{ color: colors.grey600 }}
                    bottom={`${expectedIncomeAmount.toLocaleString()}원`}
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
                    bottom={`${differenceBetweenGoalAmount.toLocaleString()}원`}
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
                    bottom={`${recommendedMonthlyAmount.toLocaleString()}원`}
                    bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                  />
                }
              />

              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />

              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
              <Spacing size={12} />

              {sortedSavingProducts?.map(product => (
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
            </>
          ) : (
            <>
              <Spacing size={40} />
              <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
            </>
          )}
        </>
      )}
    </>
  );
}
