import { IProduct } from 'components/Invoicing/types';

export function calculateTotalAllWithoutDiscount(items: IProduct[]): number {
  if (items && items.length > 0) {
    return items.reduce((sum, item) => {
      if (item) {
        return sum + item.price * item.quantity;
      }
      return 0;
    }, 0);
  } else {
    return 0;
  }
}

export function calculateTotalAllWithoutVat({
  discount,
  items,
}: {
  discount: number;
  items: IProduct[];
}): number {
  const sumTotal = calculateTotalAllWithoutDiscount(items);
  const totalWithoutVat = items.reduce((sumTotalWithoutVat, item) => {
    if (item) {
      const { quantity, price } = item;
      const total = price * quantity;
      const shareOfTotal = total / sumTotal;
      const discountToApply = discount * shareOfTotal;
      const itemTotalWithoutVat = total - discountToApply;
      return sumTotalWithoutVat + itemTotalWithoutVat;
    } else {
      return 0;
    }
  }, 0);
  return totalWithoutVat;
}

export function calculateTotalAllWithVat({
  discount,
  items,
}: {
  discount: number;
  items: IProduct[];
}): number {
  const sumTotal = calculateTotalAllWithoutDiscount(items);
  const totalIncludingVat = items.reduce((sumTotalWithVat, item) => {
    if (item) {
      const { quantity, price, vatRate } = item;
      const total = price * quantity;
      const shareOfTotal = total / sumTotal;
      const discountToApply = discount * shareOfTotal;
      const itemTotalWithoutVat = total - discountToApply;
      const vatAmount = itemTotalWithoutVat * (vatRate / 100);
      return sumTotalWithVat + itemTotalWithoutVat + vatAmount;
    } else {
      return 0;
    }
  }, 0);
  return totalIncludingVat;
}

export function calculateVatAllInPercent({
  items,
}: {
  items: IProduct[];
}): number {
  return items.reduce((totalVat, item) => {
    if (item) {
      return totalVat + item.vatRate;
    } else {
      return 0;
    }
  }, 0);
}

export function calculateTotalItemWithDiscount({
  discount,
  item,
}: {
  discount: number;
  item: IProduct;
}): number {
  if (item) {
    const { quantity, price } = item;
    return quantity * price - discount;
  } else {
    return 0;
  }
}

export function calculateVatItemWithDiscount({
  discount,
  item,
}: {
  discount: number;
  item: IProduct;
}): number {
  if (item) {
    const { quantity, price, vatRate } = item;
    return ((quantity * price - discount) * vatRate) / 100;
  } else {
    return 0;
  }
}
