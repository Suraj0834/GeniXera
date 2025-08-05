import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, useColorScheme, Platform, ScrollView, Animated, StatusBar } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import SideNav from '../components/SideNav';
import BottomNavigation from '../components/BottomNavigation';
import TextPost from '../components/TextPost';
import ImagePost from '../components/ImagePost';
import VideoPost from '../components/VideoPost';

const HomeScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#000' : '#FFFEF3';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  const [activeTab, setActiveTab] = useState('forYou');
  const [isSideNavVisible, setIsSideNavVisible] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState('home');
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
    } 
    // Hide header when scrolling down and past 50px
    else if (isScrollingDown && currentScrollY > 50) {
      setIsHeaderVisible(false);
    }
    
    lastScrollY.current = currentScrollY;
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
    
    // Add 10 sample posts for each tab
    for (let i = 0; i < 10; i++) {
      if (i % 3 === 0) {
        posts.push(<TextPost key={`text-${i}`} isFirstPost={i === 0} />);
      } else if (i % 3 === 1) {
        posts.push(<ImagePost key={`image-${i}`} isFirstPost={i === 0} />);
      } else {
        posts.push(<VideoPost key={`video-${i}`} isFirstPost={i === 0} />);
      }
    }
    
    return posts;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={backgroundColor} />
      
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
    </View>
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
    paddingVertical: 12,
    minHeight: 56,
  },
  profileIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(210, 189, 0, 0.1)',
  },
  iconImage: {
    width: 28,
    height: 28,
  },
  centerLogo: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mailIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mailImage: {
    width: 28,
    height: 28,
  },
  navContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8, // Reduced from 16 to 8
    gap: 12,
    // Removed borderTopWidth and borderTopColor
  },
  navButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
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
    paddingTop: 170, // Increased space for header to prevent first post cutoff
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