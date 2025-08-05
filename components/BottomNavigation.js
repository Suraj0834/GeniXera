import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const BottomNavigation = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', icon: require('../assets/Home.png') },
    { id: 'search', icon: require('../assets/Search_icon.png') },
    { id: 'plus', icon: require('../assets/Add_post.png') },
    { id: 'cube', icon: require('../assets/marketpalce_icon3.png') },
    { id: 'bell', icon: require('../assets/bell_icon.png') },
  ];

  console.log('Loading Add_post1.png image...');

  const getIconStyle = (tabId) => {
    switch (tabId) {
      case 'home':
        return styles.homeIcon;
      case 'search':
        return styles.searchIcon;
      case 'plus':
        return styles.plusIcon;
      case 'cube':
        return styles.cubeIcon;
      case 'bell':
        return styles.bellIcon;
      default:
        return styles.tabIcon;
    }
  };

  const getActiveIconStyle = (tabId) => {
    if (tabId === 'plus') {
      return styles.plusIcon; // Don't apply tintColor to plus icon
    }
    return styles.activeIcon;
  };

  const getTabStyle = (tabId) => {
    switch (tabId) {
      case 'home':
        return styles.homeTab;
      case 'search':
        return styles.searchTab;
      case 'plus':
        return styles.plusTab;
      case 'cube':
        return styles.cubeTab;
      case 'bell':
        return styles.bellTab;
      default:
        return styles.tab;
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            getTabStyle(tab.id),
            activeTab === tab.id && styles.activeTab
          ]}
          onPress={() => onTabPress(tab.id)}
        >
          <View style={styles.iconContainer}>
            <Image 
              source={tab.icon} 
              style={[
                getIconStyle(tab.id),
                activeTab === tab.id && getActiveIconStyle(tab.id)
              ]} 
              resizeMode="contain"
              fadeDuration={0}
            />
            {tab.id === 'bell' && <View style={styles.notificationBadge} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFEF3',
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#D2BD00',
    minHeight: 60,
  },
  
  // Individual Tab Styles
  homeTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  searchTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  plusTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  cubeTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  bellTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  
  // Individual Icon Styles
  homeIcon: {
    width: 24,
    height: 24,
    tintColor: '#D2BD00',
  },
  searchIcon: {
    width: 40,
    height: 40,
    tintColor: '#D2BD00',
  },
  plusIcon: {
    width: 50,
    height: 50,
  },
  cubeIcon: {
    width: 28,
    height: 28,
    tintColor: '#D2BD00',
  },
  bellIcon: {
    width: 38,
    height: 38,
    tintColor: '#D2BD00',
  },
  
  // Common Styles
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  tabIcon: {
    width: 32,
    height: 32,
    tintColor: '#D2BD00',
  },
  activeTab: {
    // Additional styling for active tabs if needed
  },
  activeIcon: {
    tintColor: '#D2BD00',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF0000',
    borderWidth: 2,
    borderColor: '#FFFEF3',
  },
});

export default BottomNavigation; 