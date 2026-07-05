import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useInvoice } from '../context/InvoiceContext';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { generateInvoiceHTML } from '../utils/pdfTemplate';
import { lineTotal, formatCurrency, calcSubtotal, calcTax, calcDiscount, calcGrandTotal, calcTotalQuantity, numberToWords } from '../utils/calculations';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const PreviewScreen = () => {
  const insets = useSafeAreaInsets();
  const { state } = useInvoice();
  const { items, invoiceSettings } = state;
  const [loading, setLoading] = useState(false);

  const subtotal = calcSubtotal(items);
  const tax = calcTax(subtotal, invoiceSettings.taxRate);
  const discount = calcDiscount(subtotal, invoiceSettings.discountType, invoiceSettings.discountValue);
  const grandTotal = calcGrandTotal(items, invoiceSettings.taxRate, invoiceSettings.discountType, invoiceSettings.discountValue);
  const totalQty = calcTotalQuantity(items);
  const received = parseFloat(invoiceSettings.receivedAmount) || 0;
  const balance = grandTotal - received;

  const handlePrint = useCallback(async () => {
    if (items.length === 0) {
      if (Platform.OS === 'web') window.alert('Please add items before printing.');
      else Alert.alert('No Items', 'Please add at least one item to print.');
      return;
    }
    try {
      setLoading(true);
      const html = generateInvoiceHTML(items, invoiceSettings);
      await Print.printAsync({ html });
    } catch (err) {
      console.error('Print error:', err);
    } finally {
      setLoading(false);
    }
  }, [items, invoiceSettings]);

  const handleExportPDF = useCallback(async () => {
    if (items.length === 0) {
      if (Platform.OS === 'web') window.alert('Please add items before exporting.');
      else Alert.alert('No Items', 'Please add at least one item to export.');
      return;
    }
    try {
      setLoading(true);
      const html = generateInvoiceHTML(items, invoiceSettings);
      const { uri } = await Print.printToFileAsync({ html });
      if (Platform.OS === 'web') {
        window.open(uri, '_blank');
      } else {
        await shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: `Share Invoice ${invoiceSettings.invoiceNumber}`,
        });
      }
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setLoading(false);
    }
  }, [items, invoiceSettings]);

  const handleShare = useCallback(async () => {
    if (items.length === 0) {
      if (Platform.OS === 'web') window.alert('Please add items before sharing.');
      else Alert.alert('No Items', 'Please add at least one item to share.');
      return;
    }
    try {
      setLoading(true);
      const html = generateInvoiceHTML(items, invoiceSettings);
      const { uri } = await Print.printToFileAsync({ html });
      await shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: `Share Invoice ${invoiceSettings.invoiceNumber}`,
      });
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setLoading(false);
    }
  }, [items, invoiceSettings]);

  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.screenHeader}>
          <Text style={styles.screenTitle}>Preview</Text>
          <Text style={styles.screenSubtitle}>Bill of Supply preview & export</Text>
        </View>
        <EmptyState
          icon="document-text-outline"
          title="Nothing to preview"
          subtitle="Add items in the Items tab to see your invoice preview here"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Generating...</Text>
        </View>
      )}

      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Preview</Text>
        <Text style={styles.screenSubtitle}>Bill of Supply preview & export</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ============= INVOICE PREVIEW CARD ============= */}
        <View style={styles.invoiceCard}>

          {/* HEADER BANNER */}
          <View style={styles.headerBanner}>
            <Text style={styles.bannerTitle}>
              {(invoiceSettings.businessName || 'MY BUSINESS').toUpperCase()}
            </Text>
            {invoiceSettings.businessAddress ? (
              <Text style={styles.bannerSub}>
                Address: {invoiceSettings.businessAddress}
                {invoiceSettings.businessPhone ? `, Ph. no.: ${invoiceSettings.businessPhone}` : ''}
              </Text>
            ) : null}
            {invoiceSettings.businessState ? (
              <Text style={styles.bannerSub}>State: {invoiceSettings.businessState}</Text>
            ) : null}
          </View>

          {/* BILL TITLE */}
          <Text style={styles.billTitle}>{invoiceSettings.invoiceTitle || 'Bill of Supply'}</Text>

          {/* BILL TO / INVOICE DETAILS */}
          <View style={styles.infoSection}>
            {/* Label Row */}
            <View style={styles.infoLabelRow}>
              <Text style={[styles.infoLabelText, { flex: 1 }]}>Bill To</Text>
              <Text style={[styles.infoLabelText, { width: 150, textAlign: 'right' }]}>Invoice Details</Text>
            </View>
            {/* Content Row */}
            <View style={styles.infoContentRow}>
              <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#999', paddingRight: 8 }}>
                <Text style={styles.customerNameText}>{invoiceSettings.customerName || '—'}</Text>
                {invoiceSettings.customerAddress ? (
                  <Text style={styles.customerDetailText}>{invoiceSettings.customerAddress}</Text>
                ) : null}
              </View>
              <View style={{ width: 150, alignItems: 'flex-end' }}>
                <Text style={styles.invoiceMetaText}>Invoice No.: {invoiceSettings.invoiceNumber}</Text>
                <Text style={styles.invoiceMetaText}>Date: {invoiceSettings.invoiceDate}</Text>
              </View>
            </View>
          </View>

          {/* ITEMS TABLE */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.thText, { width: 30 }]}>#</Text>
              <Text style={[styles.thText, { flex: 1 }]}>Item Name</Text>
              <Text style={[styles.thText, { width: 60 }]}>HSN/SAC</Text>
              <Text style={[styles.thText, { width: 55 }]}>Qty</Text>
              <Text style={[styles.thText, { width: 40 }]}>Unit</Text>
              <Text style={[styles.thText, { width: 72 }]}>Price/Unit</Text>
              <Text style={[styles.thText, { width: 80, textAlign: 'right' }]}>Amount</Text>
            </View>

            {/* Table Body */}
            {items.map((item, index) => (
              <View key={item.id} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
                <Text style={[styles.tdText, { width: 30, textAlign: 'center' }]}>{index + 1}</Text>
                <Text style={[styles.tdText, { flex: 1, fontWeight: '600' }]}>{item.name.toUpperCase()}</Text>
                <Text style={[styles.tdText, { width: 60, textAlign: 'center' }]}>{item.hsnSac || ''}</Text>
                <Text style={[styles.tdText, { width: 55, textAlign: 'right' }]}>{item.quantity}</Text>
                <Text style={[styles.tdText, { width: 40, textAlign: 'center' }]}>{item.unit}</Text>
                <Text style={[styles.tdText, { width: 72, textAlign: 'right' }]}>{formatCurrency(item.price)}</Text>
                <Text style={[styles.tdText, styles.amountCell, { width: 80, textAlign: 'right' }]}>
                  {formatCurrency(lineTotal(item))}
                </Text>
              </View>
            ))}

            {/* Total Row */}
            <View style={styles.totalRow}>
              <Text style={[styles.totalText, { width: 30 }]}></Text>
              <Text style={[styles.totalText, { flex: 1, fontWeight: '700' }]}>Total</Text>
              <Text style={[styles.totalText, { width: 60 }]}></Text>
              <Text style={[styles.totalText, { width: 55, textAlign: 'right' }]}>
                {totalQty % 1 === 0 ? totalQty : totalQty.toFixed(1)}
              </Text>
              <Text style={[styles.totalText, { width: 40 }]}></Text>
              <Text style={[styles.totalText, { width: 72 }]}></Text>
              <Text style={[styles.totalText, { width: 80, textAlign: 'right', fontWeight: '700' }]}>
                {formatCurrency(subtotal)}
              </Text>
            </View>
          </View>

          {/* BOTTOM SECTION: Amount in words + Amounts */}
          <View style={styles.bottomSection}>
            {/* Left: Words + Terms */}
            <View style={styles.bottomLeft}>
              <View style={styles.grayLabelBar}>
                <Text style={styles.grayLabelText}>Invoice Amount In Words</Text>
              </View>
              <View style={styles.wordsContent}>
                <Text style={styles.wordsText}>{numberToWords(grandTotal)}</Text>
              </View>
              <View style={styles.grayLabelBar}>
                <Text style={styles.grayLabelText}>Terms and conditions</Text>
              </View>
              <View style={styles.termsContent}>
                <Text style={styles.termsText}>
                  {invoiceSettings.termsAndConditions || 'Thank you for doing business with us.'}
                </Text>
              </View>
            </View>

            {/* Right: Amounts */}
            <View style={styles.bottomRight}>
              <View style={styles.grayLabelBar}>
                <Text style={styles.grayLabelText}>Amounts</Text>
              </View>
              <View style={styles.amountsRow}>
                <Text style={styles.amountsLabel}>Sub Total</Text>
                <Text style={styles.amountsValue}>{formatCurrency(subtotal)}</Text>
              </View>
              {parseFloat(invoiceSettings.taxRate) > 0 && (
                <View style={styles.amountsRow}>
                  <Text style={styles.amountsLabel}>Tax ({invoiceSettings.taxRate}%)</Text>
                  <Text style={styles.amountsValue}>{formatCurrency(tax)}</Text>
                </View>
              )}
              {parseFloat(invoiceSettings.discountValue) > 0 && (
                <View style={styles.amountsRow}>
                  <Text style={styles.amountsLabel}>
                    Discount {invoiceSettings.discountType === 'percentage' ? `(${invoiceSettings.discountValue}%)` : ''}
                  </Text>
                  <Text style={[styles.amountsValue, { color: '#c0392b' }]}>-{formatCurrency(discount)}</Text>
                </View>
              )}
              <View style={[styles.amountsRow, styles.amountsTotalRow]}>
                <Text style={[styles.amountsLabel, { fontWeight: '700', fontSize: 14 }]}>Total</Text>
                <Text style={[styles.amountsValue, { fontWeight: '700', fontSize: 14 }]}>{formatCurrency(grandTotal)}</Text>
              </View>
              <View style={styles.amountsRow}>
                <Text style={styles.amountsLabel}>Received</Text>
                <Text style={styles.amountsValue}>{formatCurrency(received)}</Text>
              </View>
              <View style={[styles.amountsRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.amountsLabel}>Balance</Text>
                <Text style={styles.amountsValue}>{formatCurrency(balance)}</Text>
              </View>
            </View>
          </View>

          {/* SIGNATURE */}
          <View style={styles.signatureSection}>
            <Text style={styles.forText}>For: {(invoiceSettings.businessName || 'MY BUSINESS').toUpperCase()}</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.sigLabel}>Authorized Signatory</Text>
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionSection}>
          <Text style={styles.actionsLabel}>EXPORT OPTIONS</Text>
          <View style={styles.actionButtons}>
            <Button title="Print" icon="🖨️" variant="secondary" onPress={handlePrint} style={styles.actionBtn} disabled={loading} />
            <Button title="Export PDF" icon="📄" variant="primary" onPress={handleExportPDF} style={styles.actionBtn} disabled={loading} />
            <Button title="Share" icon="📤" variant="secondary" onPress={handleShare} style={styles.actionBtn} disabled={loading} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  screenHeader: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  screenTitle: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.huge,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: COLORS.overlay,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginTop: SPACING.md,
  },

  // ====== INVOICE CARD ======
  invoiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },

  // Header Banner
  headerBanner: {
    backgroundColor: '#8a8a8a',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },
  bannerSub: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 2,
    textAlign: 'center',
  },

  // Bill Title
  billTitle: {
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12,
    color: '#333',
  },

  // Info Section (Bill To / Invoice Details)
  infoSection: {
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 10,
  },
  infoLabelRow: {
    flexDirection: 'row',
    backgroundColor: '#b0b0b0',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  infoLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  infoContentRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#999',
    minHeight: 44,
  },
  customerNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  customerDetailText: {
    fontSize: 11,
    color: '#555',
    marginTop: 1,
  },
  invoiceMetaText: {
    fontSize: 12,
    color: '#333',
    marginTop: 1,
  },

  // Items Table
  tableContainer: {
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#b0b0b0',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  thText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tableRowAlt: {
    backgroundColor: '#f8f8f8',
  },
  tdText: {
    fontSize: 11,
    color: '#333',
  },
  amountCell: {
    fontWeight: '600',
    color: '#222',
  },
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderTopWidth: 2,
    borderTopColor: '#999',
    backgroundColor: '#f0f0f0',
  },
  totalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  // Bottom Section
  bottomSection: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 6,
  },
  bottomLeft: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#999',
    borderRightWidth: 0,
  },
  bottomRight: {
    width: 200,
    borderWidth: 1,
    borderColor: '#999',
  },
  grayLabelBar: {
    backgroundColor: '#b0b0b0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
  },
  grayLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
  wordsContent: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    minHeight: 30,
  },
  wordsText: {
    fontSize: 11,
    color: '#333',
  },
  termsContent: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    minHeight: 30,
  },
  termsText: {
    fontSize: 11,
    color: '#333',
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  amountsTotalRow: {
    borderBottomWidth: 2,
    borderBottomColor: '#999',
    backgroundColor: '#f5f5f5',
  },
  amountsLabel: {
    fontSize: 11,
    color: '#333',
  },
  amountsValue: {
    fontSize: 11,
    color: '#333',
    fontWeight: '500',
  },

  // Signature
  signatureSection: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  forText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 30,
  },
  signatureLine: {
    width: 120,
    height: 1,
    backgroundColor: '#999',
    marginBottom: 4,
  },
  sigLabel: {
    fontSize: 11,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#333',
  },

  // Action Section
  actionSection: {
    marginTop: SPACING.xxl,
  },
  actionsLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textTertiary,
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionBtn: {
    flex: 1,
  },
});

export default PreviewScreen;
