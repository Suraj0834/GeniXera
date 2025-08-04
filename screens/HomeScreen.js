import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import SideNav from '../components/SideNav';

const HomeScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#000' : '#FFFEF3';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  const [activeTab, setActiveTab] = useState('forYou');
  const [isSideNavVisible, setIsSideNavVisible] = useState(false);

  const handleProfilePress = () => {
    setIsSideNavVisible(true);
  };

  const handleSideNavClose = () => {
    setIsSideNavVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
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

      {/* Content Area */}
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: textColor }]}>
          {activeTab === 'forYou' ? 'For You Content' : 'Following Content'}
        </Text>
      </View>

      {/* Side Navigation */}
      <SideNav 
        isVisible={isSideNavVisible}
        onClose={handleSideNavClose}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  profileIcon: {
    width: 40,
    height: 40,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  centerLogo: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mailIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mailImage: {
    width: 24,
    height: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
  },
  navContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  navButton: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D2BD00',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HomeScreen;