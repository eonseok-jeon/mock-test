import { ListRow, Spacing } from 'tosslib';

/** 결과 없음 컴포넌트 */
export function EmptyResults({ message }: { message: string }) {
  return (
    <>
      <Spacing size={40} />
      <ListRow contents={<ListRow.Texts type="1RowTypeA" top={message} />} />
    </>
  );
}
