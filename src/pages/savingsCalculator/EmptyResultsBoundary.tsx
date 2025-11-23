import { ListRow, Spacing } from 'tosslib';

/** 결과 없음 컴포넌트 */
export function EmptyResultsBoundary({
  isEmpty,
  message,
  children,
}: {
  isEmpty: boolean;
  message: string;
  children: React.ReactNode;
}) {
  if (isEmpty) {
    return (
      <>
        <Spacing size={40} />
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top={message} />} />
      </>
    );
  }

  return children;
}
