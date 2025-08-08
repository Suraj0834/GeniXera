import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Platform, ScrollView, Animated, StatusBar } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import SideNav from '../components/SideNav';
import BottomNavigation from '../components/BottomNavigation';
import TextPost from '../components/TextPost';
import ImagePost from '../components/ImagePost';
import VideoPost from '../components/VideoPost';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
  const { mode, theme } = useTheme();
  const backgroundColor = theme.background;
  const textColor = theme.text;
  const [activeTab, setActiveTab] = useState('forYou');
  const [isSideNavVisible, setIsSideNavVisible] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState('home');
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleProfilePress = () => {
    setIsSideNavVisible(true);
  };

  const handleSideNavClose = () => {
    setIsSideNavVisible(false);
  };

  const handleBottomTabPress = (tabId) => {
    setActiveBottomTab(tabId);
  };

  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const isScrollingUp = currentScrollY < lastScrollY.current;
    const isScrollingDown = currentScrollY > lastScrollY.current;

    // Show header immediately when scrolling up
    if (isScrollingUp) {
      setIsHeaderVisible(true);
    } else if (isScrollingDown && currentScrollY > 50) {
      setIsHeaderVisible(false);
    }

    // Close options modal if it's open and user is scrolling
    if (isOptionsModalOpen) {
      setIsOptionsModalOpen(false);
    }

    lastScrollY.current = currentScrollY;
  };

  const handleOptionsModalOpen = () => {
    setIsOptionsModalOpen(true);
  };

  const handleOptionsModalClose = () => {
    setIsOptionsModalOpen(false);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, -120],
    extrapolate: 'clamp',
  });

  const renderPosts = () => {
    const posts = [];
    // Different aspect ratios for testing
    const imageHeights = [120, 180, 220, 300, 400]; // short, square, tall, portrait, very tall
    const videoHeights = [120, 180, 220, 300, 400];
    // Add 10 sample posts for each tab
    for (let i = 0; i < 10; i++) {
      if (i % 3 === 0) {
        posts.push(
          <TextPost 
            key={`text-${i}`} 
            isFirstPost={i === 0}
            onOptionsOpen={handleOptionsModalOpen}
            onOptionsClose={handleOptionsModalClose}
            isModalOpen={isOptionsModalOpen}
          />
        );
      } else if (i % 3 === 1) {
        posts.push(
          <ImagePost 
            key={`image-${i}`} 
            isFirstPost={i === 0}
            onOptionsOpen={handleOptionsModalOpen}
            onOptionsClose={handleOptionsModalClose}
            isModalOpen={isOptionsModalOpen}
            imageHeight={imageHeights[i % imageHeights.length]}
          />
        );
      } else {
        posts.push(
          <VideoPost 
            key={`video-${i}`} 
            isFirstPost={i === 0}
            onOptionsOpen={handleOptionsModalOpen}
            onOptionsClose={handleOptionsModalClose}
            isModalOpen={isOptionsModalOpen}
            videoHeight={videoHeights[i % videoHeights.length]}
          />
        );
      }
    }
    return posts;
  };

  return (
    <RNSafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.text === '#fff' ? 'light-content' : 'dark-content'} backgroundColor={backgroundColor} />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            opacity: isHeaderVisible ? 1 : 0,
            transform: [{ translateY: isHeaderVisible ? 0 : -120 }],
            backgroundColor: backgroundColor,
          }
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            {/* Left Profile Icon */}
            <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
              <View style={[styles.iconCircle, { borderColor: '#D2BD00' }]}>
                <Image source={require('../assets/spalshicon.png')} style={styles.iconImage} resizeMode="contain" />
              </View>
            </TouchableOpacity>

            {/* Center Logo */}
            <View style={styles.centerLogo}>
              <Image source={require('../assets/spalshicon.png')} style={styles.iconImage} resizeMode="contain" />
            </View>

            {/* Right Mail Icon */}
            <TouchableOpacity style={styles.mailIcon}>
              <Image source={require('../assets/Vector.png')} style={styles.mailImage} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          {/* Navigation Tabs */}
          <View style={styles.navContainer}>
            <TouchableOpacity 
              style={[
                styles.navButton, 
                activeTab === 'forYou' && { backgroundColor: '#D2BD00' }
              ]}
              onPress={() => setActiveTab('forYou')}
            >
              <Text style={[
                styles.navButtonText,
                activeTab === 'forYou' ? { color: '#000' } : { color: '#D2BD00' }
              ]}>
                For You
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.navButton, 
                activeTab === 'following' && { backgroundColor: '#D2BD00' }
              ]}
              onPress={() => setActiveTab('following')}
            >
              <Text style={[
                styles.navButtonText,
                activeTab === 'following' ? { color: '#000' } : { color: '#D2BD00' }
              ]}>
                Following
              </Text>
            </TouchableOpacity>
    </View>
        </SafeAreaView>
      </Animated.View>

      {/* Content Area */}
      <Animated.ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {renderPosts()}
      </Animated.ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeBottomTab}
        onTabPress={handleBottomTabPress}
      />

      {/* Side Navigation */}
      <SideNav 
        isVisible={isSideNavVisible}
        onClose={handleSideNavClose}
        navigation={navigation}
      />
    </RNSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  safeArea: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'android' ? 8 : 12, // Reduced padding for Android
    minHeight: Platform.OS === 'android' ? 48 : 56, // Reduced height for Android
  },
  profileIcon: {
    width: Platform.OS === 'android' ? 36 : 44, // Smaller for Android
    height: Platform.OS === 'android' ? 36 : 44, // Smaller for Android
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: Platform.OS === 'android' ? 36 : 44, // Smaller for Android
    height: Platform.OS === 'android' ? 36 : 44, // Smaller for Android
    borderRadius: Platform.OS === 'android' ? 18 : 22, // Adjusted for Android
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(210, 189, 0, 0.1)',
  },
  iconImage: {
    width: Platform.OS === 'android' ? 22 : 28, // Smaller for Android
    height: Platform.OS === 'android' ? 22 : 28, // Smaller for Android
  },
  centerLogo: {
    width: Platform.OS === 'android' ? 36 : 44, // Smaller for Android
    height: Platform.OS === 'android' ? 36 : 44, // Smaller for Android
    justifyContent: 'center',
    alignItems: 'center',
  },
  mailIcon: {
    width: Platform.OS === 'android' ? 36 : 44, // Smaller for Android
    height: Platform.OS === 'android' ? 36 : 44, // Smaller for Android
    justifyContent: 'center',
    alignItems: 'center',
  },
  mailImage: {
    width: Platform.OS === 'android' ? 22 : 28, // Smaller for Android
    height: Platform.OS === 'android' ? 22 : 28, // Smaller for Android
  },
  navContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'android' ? 12 : 8, // Reduced padding for Android
    gap: 12,
  },
  navButton: {
    flex: 1,
    height: Platform.OS === 'android' ? 36 : 44, // Smaller for Android
    borderRadius: Platform.OS === 'android' ? 18 : 22, // Adjusted for Android
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D2BD00',
    backgroundColor: 'rgba(210, 189, 0, 0.05)',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 140 : 170, // Reduced for Android
  },
  contentContainer: {
    paddingBottom: 20,
    paddingTop: 8, // Additional top padding for content container
  },
  contentText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HomeScreen;