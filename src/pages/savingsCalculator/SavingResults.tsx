import { useGetSavingProducts } from 'hooks/useGetSavingProducts';
import { useMemo } from 'react';
import { Assets, Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingsProduct } from 'types/savingProducts';
import { roundToThousands } from 'utils/roundToThousands';

/** 적금 계산 결과 컴포넌트 */
export function SavingResults({
  enteredGoalAmount,
  enteredMonthlyAmount,
  enteredSavingPeriod,
  selectedSavingProduct,
  onSelectSavingProduct,
}: {
  enteredGoalAmount: number | null;
  enteredMonthlyAmount: number | null;
  enteredSavingPeriod: number | null;
  selectedSavingProduct: SavingsProduct | null;
  onSelectSavingProduct: (savingProduct: SavingsProduct | null) => void;
}) {
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

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
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
              onClick={() => onSelectSavingProduct(product)}
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
  );
}
