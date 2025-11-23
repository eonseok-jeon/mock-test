/**
 * 숫자를 천의 자리에서 반올림합니다.
 * @param value - 반올림할 숫자
 * @returns 천의 자리에서 반올림된 숫자
 * @example
 * roundToThousands(1234) // 1000
 * roundToThousands(1678) // 2000
 * roundToThousands(12345) // 12000
 * roundToThousands(12678) // 13000
 */
export function roundToThousands(value: number): number {
  return Math.round(value / 1000) * 1000;
}
