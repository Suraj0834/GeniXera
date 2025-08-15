import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Platform, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

const ICONS = [
  { key: 'home', src: require('../assets/Home.png'), size: { width: 20, height: 20 } },
  { key: 'search', src: require('../assets/Search_icon.png'), size: { width: 20, height: 20 } },
  { key: 'plus', src: require('../assets/sampleicon.png'), size: { width: 60, height: 60 } },
  { key: 'market', src: require('../assets/marketplace_two.png'), size: { width: 38, height: 38 } },
  { key: 'bell', src: require('../assets/bell_icon.png'), size: { width: 20, height: 20} },
];

const BottomNavigation = ({ activeTab, onTabPress, navigation }) => {
  const { theme, mode } = useTheme();
  const insets = useSafeAreaInsets();

  const bottomPadding = Platform.OS === 'ios' ? Math.max(insets.bottom, 8) : Math.max(insets.bottom, 4);

  const handleTabPress = (tabKey) => {
    if (tabKey === 'plus') {
      navigation.navigate('CreatPost');
    } else {
      onTabPress(tabKey);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding, backgroundColor: theme.BottomNavigationBackground }]}>
      <View style={[styles.navigationBar, { backgroundColor: theme.BottomNavigationBackground }]}>
        {ICONS.map((icon) => {
          const isActive = activeTab === icon.key;
          const isPlusButton = icon.key === 'plus';

          return (
            <TouchableOpacity
              key={icon.key}
              style={[
                styles.iconButton,
                isPlusButton && styles.plusButton,
              ]}
              onPress={() => handleTabPress(icon.key)}
            >
              <View style={styles.iconWrapper}>
                <Image
                  source={icon.src}
                  style={[
                    styles.icon,
                    icon.size,
                  ]}
                  resizeMode="contain"
                />
                {isActive && !isPlusButton && <View style={styles.activeDot} />}
                {icon.key === 'bell' && <View style={styles.notificationDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#FFFEF3', // Default light background, overridden by theme
    borderTopWidth: 1,
    borderTopColor: '#D2BD00',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 45,
    paddingHorizontal: 0,
  },
  iconButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: Platform.OS === 'android' ? 8 : 8, // Replaced paddingVertical with paddingTop
  },
  plusButton: {
    flex: 1.2, // Slightly larger for emphasis, no zoom effect
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    // marginBottom: 2, // Removed to eliminate gap below icon
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D2BD00',
    marginTop: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: '#FF4040',

  },
});

export default BottomNavigation;