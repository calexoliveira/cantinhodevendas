export function discountedPrice(price: number, discountPercent: number): number {
  const cents = BigInt(Math.round(price * 100));
  const basisPoints = BigInt(Math.round(discountPercent * 100));
  return Number((cents * (10000n - basisPoints) + 5000n) / 10000n) / 100;
}
