import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInvoice } from '../context/InvoiceContext';
import ItemCard from '../components/ItemCard';
import ItemForm from '../components/ItemForm';
import InvoiceSummary from '../components/InvoiceSummary';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const ItemsScreen = () => {
  const insets = useSafeAreaInsets();
  const { state, addItem, updateItem, deleteItem, updateSettings } = useInvoice();
  const { items, invoiceSettings } = state;

  const [formVisible, setFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  const handleAddItem = useCallback((item) => {
    addItem({ ...item, id: uuidv4() });
  }, [addItem]);

  const handleUpdateItem = useCallback((item) => {
    updateItem(item);
  }, [updateItem]);

  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setFormVisible(true);
  }, []);

  const handleDelete = useCallback((id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this item?')) {
        deleteItem(id);
      }
    } else {
      Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteItem(id) },
      ]);
    }
  }, [deleteItem]);

  const handleFormSubmit = useCallback((item) => {
    if (editingItem) {
      handleUpdateItem(item);
    } else {
      handleAddItem(item);
    }
    setEditingItem(null);
  }, [editingItem, handleAddItem, handleUpdateItem]);

  const handleFormClose = useCallback(() => {
    setFormVisible(false);
    setEditingItem(null);
  }, []);

  const renderItem = useCallback(({ item, index }) => (
    <ItemCard
      item={item}
      index={index}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ), [handleEdit, handleDelete]);

  const keyExtractor = useCallback((item) => item.id, []);

  const ListHeader = () => (
    <View>
      {/* Invoice Header Card */}
      <View style={styles.invoiceHeader}>
        <View style={styles.invoiceHeaderTop}>
          <View>
            <Text style={styles.invoiceNumber}>{invoiceSettings.invoiceNumber}</Text>
            <Text style={styles.invoiceDate}>{invoiceSettings.invoiceDate}</Text>
          </View>
          <View style={styles.businessBadge}>
            <Ionicons name="business-outline" size={16} color={COLORS.primary} />
            <Text style={styles.businessName} numberOfLines={1}>{invoiceSettings.businessName}</Text>
          </View>
        </View>
      </View>

      {/* Settings Accordion */}
      <TouchableOpacity
        style={styles.settingsToggle}
        onPress={() => setSettingsExpanded(!settingsExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.settingsToggleLeft}>
          <Ionicons name="settings-outline" size={18} color={COLORS.textSecondary} />
          <Text style={styles.settingsToggleText}>Invoice Settings</Text>
        </View>
        <Ionicons
          name={settingsExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={COLORS.textTertiary}
        />
      </TouchableOpacity>

      {settingsExpanded && (
        <View style={styles.settingsPanel}>
          {/* === BUSINESS DETAILS === */}
          <Text style={styles.settingSectionTitle}>Business Details</Text>

          {/* Business Name */}
          <View style={styles.settingField}>
            <Text style={styles.settingLabel}>Business Name</Text>
            <TextInput
              style={styles.settingInput}
              value={invoiceSettings.businessName}
              onChangeText={(v) => updateSettings({ businessName: v })}
              placeholder="Your Business Name"
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>

          {/* Business Address */}
          <View style={styles.settingField}>
            <Text style={styles.settingLabel}>Business Address</Text>
            <TextInput
              style={styles.settingInput}
              value={invoiceSettings.businessAddress}
              onChangeText={(v) => updateSettings({ businessAddress: v })}
              placeholder="Near XYZ, Road, City"
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>

          {/* Phone & State Row */}
          <View style={styles.settingsRow}>
            <View style={[styles.settingField, { flex: 1, marginRight: SPACING.md }]}>
              <Text style={styles.settingLabel}>Phone Number</Text>
              <TextInput
                style={styles.settingInput}
                value={invoiceSettings.businessPhone}
                onChangeText={(v) => updateSettings({ businessPhone: v })}
                placeholder="9876543210"
                placeholderTextColor={COLORS.textTertiary}
                keyboardType="phone-pad"
              />
            </View>
            <View style={[styles.settingField, { flex: 1 }]}>
              <Text style={styles.settingLabel}>State</Text>
              <TextInput
                style={styles.settingInput}
                value={invoiceSettings.businessState}
                onChangeText={(v) => updateSettings({ businessState: v })}
                placeholder="e.g., Rajasthan"
                placeholderTextColor={COLORS.textTertiary}
              />
            </View>
          </View>

          {/* === INVOICE DETAILS === */}
          <Text style={styles.settingSectionTitle}>Invoice Details</Text>

          {/* Invoice Title */}
          <View style={styles.settingField}>
            <Text style={styles.settingLabel}>Invoice Title</Text>
            <TextInput
              style={styles.settingInput}
              value={invoiceSettings.invoiceTitle}
              onChangeText={(v) => updateSettings({ invoiceTitle: v })}
              placeholder="Bill of Supply"
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>

          {/* === CUSTOMER DETAILS === */}
          <Text style={styles.settingSectionTitle}>Customer Details</Text>

          {/* Customer Name */}
          <View style={styles.settingField}>
            <Text style={styles.settingLabel}>Customer Name</Text>
            <TextInput
              style={styles.settingInput}
              value={invoiceSettings.customerName}
              onChangeText={(v) => updateSettings({ customerName: v })}
              placeholder="Customer Name"
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>

          {/* Customer Email */}
          <View style={styles.settingField}>
            <Text style={styles.settingLabel}>Customer Email</Text>
            <TextInput
              style={styles.settingInput}
              value={invoiceSettings.customerEmail}
              onChangeText={(v) => updateSettings({ customerEmail: v })}
              placeholder="customer@email.com"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="email-address"
            />
          </View>

          {/* Customer Address */}
          <View style={styles.settingField}>
            <Text style={styles.settingLabel}>Customer Address</Text>
            <TextInput
              style={[styles.settingInput, { minHeight: 60 }]}
              value={invoiceSettings.customerAddress}
              onChangeText={(v) => updateSettings({ customerAddress: v })}
              placeholder="123 Main St, City"
              placeholderTextColor={COLORS.textTertiary}
              multiline
            />
          </View>

          {/* === FINANCIALS === */}
          <Text style={styles.settingSectionTitle}>Tax & Discount</Text>

          {/* Tax & Discount Row */}
          <View style={styles.settingsRow}>
            <View style={[styles.settingField, { flex: 1, marginRight: SPACING.md }]}>
              <Text style={styles.settingLabel}>Tax Rate (%)</Text>
              <TextInput
                style={styles.settingInput}
                value={String(invoiceSettings.taxRate || '')}
                onChangeText={(v) => updateSettings({ taxRate: v })}
                placeholder="0"
                placeholderTextColor={COLORS.textTertiary}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.settingField, { flex: 1 }]}>
              <Text style={styles.settingLabel}>Discount ({invoiceSettings.discountType === 'percentage' ? '%' : '₹'})</Text>
              <TextInput
                style={styles.settingInput}
                value={String(invoiceSettings.discountValue || '')}
                onChangeText={(v) => updateSettings({ discountValue: v })}
                placeholder="0"
                placeholderTextColor={COLORS.textTertiary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Discount Type Toggle */}
          <View style={styles.discountTypeRow}>
            <Pressable
              onPress={() => updateSettings({ discountType: 'percentage' })}
              style={[
                styles.discountTypeBtn,
                invoiceSettings.discountType === 'percentage' && styles.discountTypeBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.discountTypeText,
                  invoiceSettings.discountType === 'percentage' && styles.discountTypeTextActive,
                ]}
              >
                % Percentage
              </Text>
            </Pressable>
            <Pressable
              onPress={() => updateSettings({ discountType: 'fixed' })}
              style={[
                styles.discountTypeBtn,
                invoiceSettings.discountType === 'fixed' && styles.discountTypeBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.discountTypeText,
                  invoiceSettings.discountType === 'fixed' && styles.discountTypeTextActive,
                ]}
              >
                ₹ Fixed
              </Text>
            </Pressable>
          </View>

          {/* Received Amount */}
          <View style={[styles.settingField, { marginTop: SPACING.lg }]}>
            <Text style={styles.settingLabel}>Amount Received (₹)</Text>
            <TextInput
              style={styles.settingInput}
              value={String(invoiceSettings.receivedAmount || '')}
              onChangeText={(v) => updateSettings({ receivedAmount: v })}
              placeholder="0"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="decimal-pad"
            />
          </View>

          {/* === TERMS === */}
          <Text style={styles.settingSectionTitle}>Terms</Text>

          <View style={styles.settingField}>
            <Text style={styles.settingLabel}>Terms & Conditions</Text>
            <TextInput
              style={[styles.settingInput, { minHeight: 60 }]}
              value={invoiceSettings.termsAndConditions}
              onChangeText={(v) => updateSettings({ termsAndConditions: v })}
              placeholder="Thank you for doing business with us."
              placeholderTextColor={COLORS.textTertiary}
              multiline
            />
          </View>
        </View>
      )}

      {/* Items Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Items</Text>
        <Text style={styles.itemCount}>{items.length} item{items.length !== 1 ? 's' : ''}</Text>
      </View>
    </View>
  );

  const ListFooter = () => (
    items.length > 0 ? (
      <View style={styles.footerSummary}>
        <InvoiceSummary items={items} settings={invoiceSettings} />
      </View>
    ) : null
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Screen Title */}
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Invoice</Text>
        <Text style={styles.screenSubtitle}>Create & manage items</Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={<EmptyState />}
        ListFooterComponent={ListFooter}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: SPACING.xxl + insets.bottom }]}
        onPress={() => {
          setEditingItem(null);
          setFormVisible(true);
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>

      {/* Item Form Modal */}
      <ItemForm
        visible={formVisible}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editItem={editingItem}
      />
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
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
  },
  // Invoice Header
  invoiceHeader: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  invoiceHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceNumber: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  invoiceDate: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  businessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primaryGlow,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    maxWidth: 180,
  },
  businessName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.primary,
    flexShrink: 1,
  },
  // Settings
  settingsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  settingsToggleText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textSecondary,
  },
  settingsPanel: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingField: {
    marginBottom: SPACING.lg,
  },
  settingSectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
  },
  settingLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  settingInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsRow: {
    flexDirection: 'row',
  },
  discountTypeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  discountTypeBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  discountTypeBtnActive: {
    backgroundColor: COLORS.primaryGlow,
    borderColor: COLORS.primary,
  },
  discountTypeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textTertiary,
  },
  discountTypeTextActive: {
    color: COLORS.primary,
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },
  itemCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  // Footer
  footerSummary: {
    marginTop: SPACING.lg,
  },
  // FAB
  fab: {
    position: 'absolute',
    right: SPACING.xxl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow,
  },
});

export default ItemsScreen;
