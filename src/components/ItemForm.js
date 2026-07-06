import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS, UNITS, ITEM_TYPES } from '../constants/theme';
import Button from './Button';

const ItemForm = ({ visible, onClose, onSubmit, editItem = null }) => {
  const [name, setName] = useState('');
  const [hsnSac, setHsnSac] = useState('');
  const [unit, setUnit] = useState('Pcs');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('product');
  const [errors, setErrors] = useState({});

  const isEditing = !!editItem;

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setHsnSac(editItem.hsnSac || '');
      setUnit(editItem.unit);
      setQuantity(String(editItem.quantity));
      setPrice(String(editItem.price));
      setType(editItem.type);
    } else {
      resetForm();
    }
    setErrors({});
  }, [editItem, visible]);

  const resetForm = () => {
    setName('');
    setHsnSac('');
    setUnit('Pcs');
    setQuantity('');
    setPrice('');
    setType('product');
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!quantity || parseFloat(quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    if (!price || parseFloat(price) < 0) {
      newErrors.price = 'Price must be 0 or more';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const item = {
      ...(editItem && { id: editItem.id }),
      name: name.trim(),
      hsnSac: hsnSac.trim(),
      unit,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      type,
    };

    onSubmit(item);
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
            {/* Handle bar */}
            <View style={styles.handleBar} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{isEditing ? 'Edit Item' : 'Add New Item'}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.6}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
              {/* Item Name */}
              <View style={styles.field}>
                <Text style={styles.label}>Item Name *</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g., Web Development"
                  placeholderTextColor={COLORS.textTertiary}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              {/* HSN/SAC Code */}
              <View style={styles.field}>
                <Text style={styles.label}>HSN / SAC Code</Text>
                <TextInput
                  style={styles.input}
                  value={hsnSac}
                  onChangeText={setHsnSac}
                  placeholder="e.g., 9983 (optional)"
                  placeholderTextColor={COLORS.textTertiary}
                />
              </View>

              {/* Type Toggle */}
              <View style={styles.field}>
                <Text style={styles.label}>Type *</Text>
                <View style={styles.toggleRow}>
                  {ITEM_TYPES.map((t) => (
                    <TouchableOpacity
                      key={t.value}
                      onPress={() => setType(t.value)}
                      style={[styles.toggleBtn, type === t.value && styles.toggleActive]}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={t.value === 'product' ? 'cube-outline' : 'construct-outline'}
                        size={18}
                        color={type === t.value ? COLORS.white : COLORS.textTertiary}
                      />
                      <Text style={[styles.toggleText, type === t.value && styles.toggleTextActive]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Unit Selector */}
              <View style={styles.field}>
                <Text style={styles.label}>Unit *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitScroll}>
                  <View style={styles.unitRow}>
                    {UNITS.map((u) => (
                      <TouchableOpacity
                        key={u.value}
                        onPress={() => setUnit(u.value)}
                        style={[styles.unitChip, unit === u.value && styles.unitChipActive]}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.unitChipText, unit === u.value && styles.unitChipTextActive]}>
                          {u.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Quantity & Price Row */}
              <View style={styles.row}>
                <View style={[styles.field, { flex: 1, marginRight: SPACING.md }]}>
                  <Text style={styles.label}>Quantity *</Text>
                  <TextInput
                    style={[styles.input, errors.quantity && styles.inputError]}
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="0"
                    placeholderTextColor={COLORS.textTertiary}
                    keyboardType="decimal-pad"
                  />
                  {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
                </View>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Price per unit (₹) *</Text>
                  <TextInput
                    style={[styles.input, errors.price && styles.inputError]}
                    value={price}
                    onChangeText={setPrice}
                    placeholder="0.00"
                    placeholderTextColor={COLORS.textTertiary}
                    keyboardType="decimal-pad"
                  />
                  {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
                </View>
              </View>

              {/* Line total preview */}
              {quantity && price && parseFloat(quantity) > 0 && parseFloat(price) >= 0 && (
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Line Total</Text>
                  <Text style={styles.previewValue}>
                    ₹ {(parseFloat(quantity) * parseFloat(price)).toFixed(2)}
                  </Text>
                </View>
              )}

              {/* Submit Button */}
              <View style={styles.submitRow}>
                <Button
                  title="Cancel"
                  variant="ghost"
                  onPress={onClose}
                  style={{ flex: 1, marginRight: SPACING.md }}
                />
                <Button
                  title={isEditing ? 'Update Item' : 'Add Item'}
                  variant="primary"
                  icon={isEditing ? '✓' : '+'}
                  onPress={handleSubmit}
                  style={{ flex: 2 }}
                />
              </View>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.bgSecondary,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
    maxHeight: '90%',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.textTertiary,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 0,
  },
  field: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md + 2,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.danger,
    marginTop: SPACING.xs,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.glow,
  },
  toggleText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textTertiary,
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  unitScroll: {
    marginHorizontal: -SPACING.xxl,
    paddingHorizontal: SPACING.xxl,
  },
  unitRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  unitChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  unitChipActive: {
    backgroundColor: COLORS.primaryGlow,
    borderColor: COLORS.primary,
  },
  unitChipText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textTertiary,
  },
  unitChipTextActive: {
    color: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primaryGlow,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  previewLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primaryLight,
    fontWeight: FONT_WEIGHT.medium,
  },
  previewValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  submitRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    paddingBottom: SPACING.lg,
  },
});

export default ItemForm;
