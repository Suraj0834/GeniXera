import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ImagePost = ({ isFirstPost = false }) => {
  return (
    <View style={[styles.container, isFirstPost && styles.firstPost]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image 
            source={require('../assets/spalshicon.png')} 
            style={styles.profilePic} 
            resizeMode="cover"
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>GeniXera</Text>
            <Text style={styles.handle}>@genixera</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.headerRightContent}>
            <Text style={styles.timestamp}>4h ago</Text>
            <TouchableOpacity style={styles.optionsButton}>
              <Text style={styles.optionsIcon}>⋮</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>
          Building the future of social media, one block at a time! 🚀{'\n\n'}
          #GeniXera #Web3 #Innovation
        </Text>
      </View>

      {/* Image */}
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <View style={styles.imageOverlay}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Text style={styles.logoText}>GX</Text>
              </View>
              <Text style={styles.brandText}>GeniXera</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Engagement */}
      <View style={styles.engagement}>
        <TouchableOpacity style={styles.engagementItem}>
          <Image source={require('../assets/post_comment.png')} style={styles.engagementIcon} resizeMode="contain" />
          <Text style={styles.engagementText}>18</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.engagementItem}>
          <Image source={require('../assets/post_reshare.png')} style={styles.engagementIcon} resizeMode="contain" />
          <Text style={styles.engagementText}>89</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.engagementItem}>
          <Image source={require('../assets/post_like.png')} style={styles.engagementIcon} resizeMode="contain" />
          <Text style={styles.engagementText}>567</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.engagementItem}>
          <Image source={require('../assets/post_view.png')} style={styles.engagementIcon} resizeMode="contain" />
          <Text style={styles.engagementText}>1.8K</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Image source={require('../assets/post_share.png')} style={styles.shareIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFEF3',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  firstPost: {
    marginTop: 24, // Increased margin for the first post to avoid header overlap
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  handle: {
    fontSize: 14,
    color: '#D2BD00',
    opacity: 0.9,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: 13,
    color: '#666',
    marginRight: 8,
  },
  optionsButton: {
    padding: 4,
  },
  optionsIcon: {
    fontSize: 18,
    color: '#000',
  },
  content: {
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#000',
  },
  hashtags: {
    color: '#007AFF',
    fontWeight: '600',
  },
  imageContainer: {
    marginBottom: 20,
  },
  imagePlaceholder: {
    height: 220,
    backgroundColor: '#8B4513',
    borderRadius: 12,
    position: 'relative',
  },
  imageOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoBackground: {
    width: 64,
    height: 64,
    backgroundColor: '#D2BD00',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
  },
  brandText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  followButton: {
    backgroundColor: '#D2BD00',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
  },
  followText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  engagement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(210, 189, 0, 0.15)',
  },
  engagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engagementIcon: {
    width: 20, // Adjust size as needed
    height: 20, // Adjust size as needed
    marginRight: 6,
  },
  engagementText: {
    fontSize: 15,
    color: '#D2BD00',
    fontWeight: '600',
  },
  shareButton: {
    padding: 6,
  },
  shareIcon: {
    width: 20, // Adjust size as needed
    height: 20, // Adjust size as needed
  },
});

export default ImagePost; 