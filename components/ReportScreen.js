import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, Platform, InteractionManager } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { BlurView } from '@react-native-community/blur';
import { SafeAreaView } from 'react-native-safe-area-context'; // Add this import

const { width, height } = Dimensions.get('window');

// Helper for bottom navigation bar height (Android)
const getBottomSpace = () => {
  if (Platform.OS === 'android') {
    // Typical navigation bar height is 48, but can vary
    return 48;
  }
  // iOS handled by SafeAreaView
  return 0;
};

const ReportScreen = ({ isVisible, onClose, postData }) => {
  const { theme } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isVisible) {
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: Platform.OS === 'android' ? 180 : 250, // Shorter duration for Android
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: Platform.OS === 'android' ? 120 : 200, // Shorter duration for Android
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: Platform.OS === 'android' ? 180 : 250, // Shorter duration for Android
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: Platform.OS === 'android' ? 120 : 200, // Shorter duration for Android
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Defer onClose until after animation for smoother experience
      InteractionManager.runAfterInteractions(() => {
        onClose();
      });
    });
  };

  const handleReportOption = (option) => {
    console.log('Report option selected:', option);
    // Handle report logic here
    handleClose();
  };

  const reportOptions = [
    { emoji: '😞', text: 'The associated content is not relevant', action: 'not_relevant' },
    { emoji: '😞', text: 'This trend is spam', action: 'spam' },
    { emoji: '😞', text: 'This trend is abusive or harmful', action: 'abusive' },
    { emoji: '😞', text: 'Not interested in this', action: 'not_interested' },
    { emoji: '😞', text: 'This trend is a duplicate', action: 'duplicate' },
    { emoji: '😞', text: 'This trend is harmful or spammy', action: 'harmful_spam' },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        <BlurView
          style={styles.blurOverlay}
          blurType={theme.mode === 'dark' ? 'dark' : 'light'}
          blurAmount={16}
          reducedTransparencyFallbackColor={theme.overlay}
        />
        <TouchableOpacity
          style={styles.touchOverlay}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            { 
              backgroundColor: theme.mode === 'dark' ? '#1A1A1A' : '#2A2A2A',
              transform: [{ translateY: slideAnim }],
              // Add extra margin for Android on-screen nav
              marginBottom: Platform.OS === 'android' ? getBottomSpace() : 0,
            },
          ]}
        >
          <SafeAreaView edges={['bottom']} style={{flex: 1}}>
            {/* Drag Handle */}
            <View style={[styles.dragHandle, { backgroundColor: theme.mode === 'dark' ? '#FFFFFF' : '#FFFFFF' }]} />
            
            {/* Header Context (if available) */}
            {postData && (
              <View style={styles.headerContext}>
                <Text style={[styles.contextText, { color: '#FFFFFF' }]}>
                  Trending in India
                </Text>
                <Text style={[styles.trendText, { color: '#FFFFFF' }]}>
                  {postData.title || 'F-35'}
                </Text>
              </View>
            )}
            
            {/* Report Options Container */}
            <View style={styles.optionsContainer}>
              {reportOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionItem}
                  onPress={() => handleReportOption(option.action)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.emoji}>{option.emoji}</Text>
                  <Text style={[styles.optionText, { color: '#FFFFFF' }]}>
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 998,
  },
  touchOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 1000,
    paddingBottom: (Platform.OS === 'ios' ? 34 : 34) + 16, // Added extra bottom padding
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    // marginBottom removed from here, now handled inline above
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  headerContext: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  contextText: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
  trendText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  emoji: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
    lineHeight: 22,
  },
});

export default ReportScreen;