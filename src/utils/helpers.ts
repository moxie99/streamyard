export const formatTokenAmount = (
  amount: string | number | null | undefined,
  decimals: number = 9
): string => {
  if (!amount) return '0'

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numAmount)) return '0'

  return (numAmount / Math.pow(10, decimals)).toFixed(decimals)
}
