export const formatPriceBDT = (value: number) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  const formatted = new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(safeValue);

  return `\u09F3${formatted}`;
};
