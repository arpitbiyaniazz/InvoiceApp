// Calculation utility functions for invoice

/**
 * Calculate line total for a single item
 */
export const lineTotal = (item) => {
  const qty = parseFloat(item.quantity) || 0;
  const price = parseFloat(item.price) || 0;
  return qty * price;
};

/**
 * Calculate total quantity
 */
export const calcTotalQuantity = (items) => {
  return items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
};

/**
 * Calculate subtotal of all items
 */
export const calcSubtotal = (items) => {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
};

/**
 * Calculate tax amount
 */
export const calcTax = (subtotal, taxRate) => {
  const rate = parseFloat(taxRate) || 0;
  return subtotal * (rate / 100);
};

/**
 * Calculate discount amount
 */
export const calcDiscount = (subtotal, discountType, discountValue) => {
  const value = parseFloat(discountValue) || 0;
  if (discountType === 'percentage') {
    return subtotal * (value / 100);
  }
  return Math.min(value, subtotal);
};

/**
 * Calculate grand total
 */
export const calcGrandTotal = (items, taxRate, discountType, discountValue) => {
  const subtotal = calcSubtotal(items);
  const tax = calcTax(subtotal, taxRate);
  const discount = calcDiscount(subtotal, discountType, discountValue);
  return Math.max(0, subtotal + tax - discount);
};

/**
 * Format currency value in INR (₹)
 */
export const formatCurrency = (amount) => {
  const num = parseFloat(amount || 0);
  // Indian number formatting: uses commas like 1,00,000.00
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `₹ ${formatted}`;
};

/**
 * Convert number to Indian words (for "Amount In Words")
 */
export const numberToWords = (num) => {
  if (num === 0) return 'Zero Rupees only';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
    'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertBelowHundred = (n) => {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  };

  const convertBelowThousand = (n) => {
    if (n < 100) return convertBelowHundred(n);
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convertBelowHundred(n % 100) : '');
  };

  const integer = Math.floor(Math.abs(num));
  const paise = Math.round((Math.abs(num) - integer) * 100);

  let result = '';

  if (integer === 0) {
    result = 'Zero';
  } else {
    // Indian number system: crore, lakh, thousand, hundred
    const crore = Math.floor(integer / 10000000);
    const lakh = Math.floor((integer % 10000000) / 100000);
    const thousand = Math.floor((integer % 100000) / 1000);
    const hundred = integer % 1000;

    if (crore > 0) result += convertBelowHundred(crore) + ' Crore ';
    if (lakh > 0) result += convertBelowHundred(lakh) + ' Lakh ';
    if (thousand > 0) result += convertBelowHundred(thousand) + ' Thousand ';
    if (hundred > 0) result += convertBelowThousand(hundred);
  }

  result = result.trim() + ' Rupees';

  if (paise > 0) {
    result += ' and ' + convertBelowHundred(paise) + ' Paise';
  }

  return result + ' only';
};
