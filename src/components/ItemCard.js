import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { lineTotal, formatCurrency } from '../utils/calculations';

const ItemCard = ({ item, onEdit, onDelete, index }) => {
  const total = lineTotal(item);

  return (
    <View style={styles.card}>
      <View style={styles.indexBadge}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <View style={[styles.typeBadge, item.type === 'service' ? styles.serviceBadge : styles.productBadge]}>
              <Text style={[styles.typeText, item.type === 'service' ? styles.serviceText : styles.productText]}>
                {item.type}
              </Text>
            </View>
          </View>
          <Text style={styles.total}>{formatCurrency(total)}</Text>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.detail}>
            {item.quantity} {item.unit} × {formatCurrency(item.price)}
            {item.hsnSac ? `  ·  HSN: ${item.hsnSac}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(item)} style={styles.actionBtn} activeOpacity={0.6}>
          <Ionicons name="pencil" size={18} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={[styles.actionBtn, styles.deleteBtn]} activeOpacity={0.6}>
          <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  indexBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  indexText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm,
    marginRight: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
    flexShrink: 1,
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  productBadge: {
    backgroundColor: COLORS.primaryGlow,
  },
  serviceBadge: {
    backgroundColor: COLORS.successLight,
  },
  typeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
    textTransform: 'capitalize',
  },
  productText: {
    color: COLORS.primaryLight,
  },
  serviceText: {
    color: COLORS.success,
  },
  total: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detail: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  actions: {
    flexDirection: 'column',
    gap: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: COLORS.dangerLight,
  },
});

export default React.memo(ItemCard);
