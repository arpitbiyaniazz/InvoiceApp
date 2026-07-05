import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const bgColor = {
    primary: COLORS.primary,
    secondary: COLORS.surface,
    danger: COLORS.danger,
    ghost: 'transparent',
  }[variant];

  const txtColor = {
    primary: COLORS.white,
    secondary: COLORS.textSecondary,
    danger: COLORS.white,
    ghost: COLORS.primary,
  }[variant];

  const paddingV = { sm: SPACING.sm, md: SPACING.md, lg: SPACING.lg }[size];
  const paddingH = { sm: SPACING.lg, md: SPACING.xl, lg: SPACING.xxl }[size];
  const fontSize = { sm: FONT_SIZE.sm, md: FONT_SIZE.md, lg: FONT_SIZE.lg }[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: bgColor,
          paddingVertical: paddingV,
          paddingHorizontal: paddingH,
          opacity: disabled ? 0.5 : 1,
        },
        variant === 'primary' && SHADOWS.glow,
        variant === 'ghost' && styles.ghostBorder,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={txtColor} size="small" />
      ) : (
        <>
          {icon && <Text style={[styles.icon, { color: txtColor }]}>{icon}</Text>}
          <Text style={[styles.text, { color: txtColor, fontSize }, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  text: {
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.3,
  },
  icon: {
    fontSize: FONT_SIZE.lg,
  },
  ghostBorder: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
});

export default Button;
