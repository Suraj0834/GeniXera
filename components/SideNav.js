import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions, SafeAreaView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SideNav = ({ isVisible, onClose, navigation }) => {
  const { theme } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(-width)).current;
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const menuItems = [
    { icon: require('../assets/Home.png'), label: 'Home', screen: 'Home' },
    { icon: require('../assets/Explore.png'), label: 'Explore', screen: 'Explore' },
    { icon: require('../assets/Marketplace.png'), label: 'Marketplace', screen: 'MarketPlace' },
    { icon: require('../assets/Profile.png'), label: 'Profile', screen: 'Profile' },
    { icon: require('../assets/Rewards.png'), label: 'Rewards', screen: 'Rewards' },
    { icon: require('../assets/Setting.png'), label: 'Setting', screen: 'Setting' },
  ];

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View style={styles.overlayBackground} />
        </TouchableOpacity>
      )}
      
      <Animated.View
        style={[
          styles.sideNav,
          {
            transform: [{ translateX: slideAnim }],
            backgroundColor: theme.sideNavBackground,
            borderColor: theme.accent,
            paddingTop: insets.top + 10,
            paddingBottom: insets.bottom + 10,
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* App Logo - Replace with your custom logo icon */}
          <View style={styles.logoContainer}>
            <Image source={require('../assets/spalshicon.png')} style={styles.logo} resizeMode="contain" />
            {/* TODO: Replace with your custom app logo icon */}
          </View>

          {/* Navigation Menu */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate(item.screen);
                  handleClose();
                }}
              >
                {/* TODO: Replace with your custom icon for each menu item */}
                <View style={styles.iconContainer}>
                  <Image source={item.icon} style={styles.menuIcon} resizeMode="contain" />
                  {/* 
                  Custom Icon Placement Guide:
                  - Home: Place your home icon here
                  - Explore: Place your search/explore icon here  
                  - Marketplace: Place your marketplace/shop icon here
                  - Profile: Place your user/profile icon here
                  - Rewards: Place your rewards/diamond icon here
                  - Setting: Place your settings/gear icon here
                  */}
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* User Profile Section */}
          <View style={styles.profileSection}>
            {/* Profile Picture */}
            <View style={styles.profilePictureContainer}>
              <Image source={require('../assets/Profile.png')} style={styles.profileLogo} resizeMode="contain" />
            </View>
            
            {/* Name and User ID with More Button */}
            <View style={styles.profileTextContainer}>
              <View style={styles.profileInfo}>
                <Text style={styles.username}>GeniXera</Text>
                <Text style={styles.handle}>@geni.xera</Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <Image source={require('../assets/ThreeDot.png')} style={styles.moreIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsContainer}>
              <Text style={styles.statText}>1k Following</Text>
              <Text style={styles.statText}>2.6M Followers</Text>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sideNav: {
    position: 'absolute',
    top: 0, // Changed from 80 to 0 to remove top space
    left: 0,
    width: width * 0.65,
    height: height, // Changed from height - 80 to height to use full height
    backgroundColor: '#FFFEF3',
    zIndex: 1000,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: '#D2BD00',
    borderLeftWidth: 0,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  safeArea: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 25,
    paddingTop: 10, // Reduced from 25 to 10 for minimal top padding
  },
  logo: {
    width: 25,
    height: 25,
  },
  menuContainer: {
    flex: 1,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D2BD00',
  },
  profileSection: {
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(210, 189, 0, 0.3)',
  },
  profilePictureContainer: {
    
    marginBottom: 10,
  },
  profileLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#D2BD00',
  },
  profileTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D2BD00',
    marginBottom: 2,
  },
  handle: {
    fontSize: 14,
    color: '#D2BD00',
    opacity: 0.8,
  },
  moreButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(210, 189, 0, 0.1)',
  },
  moreIcon: {
    width: 20,
    height: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  statText: {
    fontSize: 14,
    color: '#D2BD00',
    fontWeight: '500',
  },
});

export default SideNav; 