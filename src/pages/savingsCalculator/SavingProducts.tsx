import { useGetSavingProducts } from 'hooks/useGetSavingProducts';
import { Assets, colors, ListRow } from 'tosslib';
import { SavingsProduct } from 'types/savingProducts';
import { EmptyResults } from './EmptyResults';

/** 적금 상품 목록 컴포넌트 */
export function SavingProducts({
  enteredMonthlyAmount,
  enteredSavingPeriod,
  selectedSavingProduct,
  onSelectSavingProduct,
}: {
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

  return (
    <>
      {savingProducts == null || savingProducts?.length === 0 ? (
        <EmptyResults message="조건에 맞는 상품이 없습니다." />
      ) : (
        <>
          {savingProducts.map(product => (
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
              onClick={() => {
                if (selectedSavingProduct?.id === product.id) {
                  onSelectSavingProduct(null);
                } else {
                  onSelectSavingProduct(product);
                }
              }}
            />
          ))}
        </>
      )}
    </>
  );
}
