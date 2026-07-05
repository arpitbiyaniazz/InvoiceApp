import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { calcSubtotal, calcTax, calcDiscount, calcGrandTotal, formatCurrency } from '../utils/calculations';

const InvoiceSummary = ({ items, settings, compact = false }) => {
  const subtotal = calcSubtotal(items);
  const tax = calcTax(subtotal, settings.taxRate);
  const discount = calcDiscount(subtotal, settings.discountType, settings.discountValue);
  const grandTotal = calcGrandTotal(items, settings.taxRate, settings.discountType, settings.discountValue);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactRow}>
          <Text style={styles.compactLabel}>{items.length} item{items.length !== 1 ? 's' : ''}</Text>
          <View style={styles.compactTotalRow}>
            <Text style={styles.compactTotalLabel}>Total: </Text>
            <Text style={styles.compactTotalValue}>{formatCurrency(grandTotal)}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
      </View>

      {settings.taxRate > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Tax ({settings.taxRate}%)</Text>
          <Text style={[styles.value, styles.taxValue]}>+{formatCurrency(tax)}</Text>
        </View>
      )}

      {parseFloat(settings.discountValue) > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>
            Discount {settings.discountType === 'percentage' ? `(${settings.discountValue}%)` : '(Fixed)'}
          </Text>
          <Text style={[styles.value, styles.discountValue]}>-{formatCurrency(discount)}</Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.grandLabel}>Grand Total</Text>
        <Text style={styles.grandValue}>{formatCurrency(grandTotal)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  heading: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text,
  },
  taxValue: {
    color: COLORS.warning,
  },
  discountValue: {
    color: COLORS.danger,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  grandLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },
  grandValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  // Compact styles
  compactContainer: {
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  compactTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactTotalLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  compactTotalValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
});

export default React.memo(InvoiceSummary);
