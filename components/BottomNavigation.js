import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS = [
  { key: 'home', src: require('../assets/Home.png') },
  { key: 'search', src: require('../assets/Search_icon.png') },
  { key: 'plus', src: require('../assets/Add_post.png') },
  { key: 'market', src: require('../assets/marketplace_two.png') },
  { key: 'bell', src: require('../assets/bell_icon.png') },
];

const BottomNavigation = ({ activeTab, onTabPress }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 12);

  return (
    <View style={[
      styles.floatingBar,
      {
        backgroundColor: theme.card + 'EE', // translucent
        shadowColor: theme.accent,
        bottom: bottomPad + 8,
        borderColor: theme.accent,
      },
    ]}>
      {ICONS.map((icon, idx) => {
        const isActive = activeTab === icon.key;
        return (
          <TouchableOpacity
            key={icon.key}
            style={[
              styles.iconButton,
              isActive && {
                backgroundColor: theme.accent,
                shadowColor: theme.accent,
                shadowOpacity: 0.18,
                shadowRadius: 8,
                elevation: 6,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => onTabPress(icon.key)}
          >
            <Image
              source={icon.src}
              style={[
                styles.icon,
                isActive && { tintColor: theme.buttonText, width: 32, height: 32 },
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  floatingBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 32,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
    paddingHorizontal: 18,
    zIndex: 100,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  icon: {
    width: 26,
    height: 26,
    tintColor: undefined,
  },
});

export default BottomNavigation;