import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ItemsScreen from '../screens/ItemsScreen';
import PreviewScreen from '../screens/PreviewScreen';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Items') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Preview') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }
          return (
            <View style={focused ? styles.activeIconContainer : styles.iconContainer}>
              <Ionicons name={iconName} size={22} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      })}
    >
      <Tab.Screen
        name="Items"
        component={ItemsScreen}
        options={{ tabBarLabel: 'Items' }}
      />
      <Tab.Screen
        name="Preview"
        component={PreviewScreen}
        options={{ tabBarLabel: 'Preview & Print' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.card,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: SPACING.sm,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxl : SPACING.sm,
    ...SHADOWS.md,
  },
  tabLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
    marginTop: SPACING.xs,
  },
  tabItem: {
    paddingTop: SPACING.xs,
  },
  activeIconContainer: {
    width: 44,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 44,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabNavigator;
