import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, Image, Platform, InteractionManager, PanResponder } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import ReportScreen from './ReportScreen';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const PostOptionsModal = ({ isVisible, onClose, postData }) => {
  const { theme } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [isReportScreenVisible, setIsReportScreenVisible] = React.useState(false);
  const dragY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets(); // Get device safe area insets

  // PanResponder for downward slide
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          dragY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80) {
          handleClose();
        } else {
          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(dragY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  React.useEffect(() => {
    if (isVisible) {
      // Reset position and fade in
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
      dragY.setValue(0); // <-- Ensure dragY is reset on open
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: Platform.OS === 'android' ? 90 : 200, // Even shorter for Android
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: Platform.OS === 'android' ? 60 : 150, // Even shorter for Android
          useNativeDriver: true,
        }),
      ]).start(() => {
        InteractionManager.runAfterInteractions(() => {
          onClose();
        });
      });
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: Platform.OS === 'android' ? 90 : 200, // Even shorter for Android
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: Platform.OS === 'android' ? 60 : 150, // Even shorter for Android
        useNativeDriver: true,
      }),
    ]).start(() => {
      InteractionManager.runAfterInteractions(() => {
        onClose();
      });
    });
  };

  const handleOptionPress = (option) => {
    // Handle different options here
    console.log('Selected option:', option);
    
    if (option === 'report') {
      setIsReportScreenVisible(true);
      handleClose();
    } else {
      handleClose();
    }
  };

  const options = [
    { icon: require('../assets/emoji_icon.png'), text: 'Not interested in this post', action: 'not_interested' },
    { icon: require('../assets/Follow_icon.png'), text: 'Follow @geni.xera', action: 'follow' },
    { icon: require('../assets/Mute_icon.png'), text: 'Mute @geni.xera', action: 'mute' },
    { icon: require('../assets/Block_icon.png'), text: 'Block @geni.xera', action: 'block' },
    { icon: require('../assets/Metadata_icon.png'), text: 'View Metadata', action: 'metadata' },
    { icon: require('../assets/Transection_icon.png'), text: 'View Transaction', action: 'transaction' },
    { icon: require('../assets/Report_icon.png'), text: 'Report post', action: 'report' },
  ];

  const getBottomSpace = () => {
    if (Platform.OS === 'android') {
      return 24; // Reduced navigation bar height
    }
    return 0;
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View style={styles.absoluteFill}>
        {/* Fallback: Use a transparent overlay for both iOS and Android */}
        <TouchableOpacity
          style={[styles.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.08)' }]}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.container}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.modalContainer,
              { 
                backgroundColor: theme.BottomNavigationBackground,
                transform: [
                  { translateY: Animated.add(slideAnim, dragY) }
                ],
                paddingBottom: insets.bottom,
                borderTopWidth: 1,
                borderTopColor: '#D2BD00',
              },
            ]}
          >
            {/* Drag Handle */}
            <View style={styles.dragHandle} />

            {/* Top Rectangle Design */}
            <View style={styles.topRectangle} />

            {/* Options Container */}
            <View style={styles.optionsContainer}>
              {options.map((option, index) => (
                <React.Fragment key={index}>
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => handleOptionPress(option.action)}
                  >
                    <Image source={option.icon} style={styles.optionIcon} resizeMode="contain" />
                    <Text style={styles.optionText}>{option.text}</Text>
                  </TouchableOpacity>
                  
                  {/* Add divider after specific options */}
                  {(option.action === 'not_interested' || option.action === 'block' || option.action === 'transaction') && (
                    <View style={styles.divider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </Animated.View>
        </View>
      </View>
      {/* Report Screen */}
      <ReportScreen 
        isVisible={isReportScreenVisible}
        onClose={() => setIsReportScreenVisible(false)}
        postData={postData}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFEF3',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1000,
    paddingBottom: 16,
    // borderColor and borderWidth removed
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  topRectangle: {
    width: 60,
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginBottom: 8,
    alignSelf: 'center',
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, // Reduced from 16 to 8
    paddingStart: 20,
  },
  optionIcon: {
    width: 20,
    height: 20,
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#D2BD00',
    fontWeight: '500',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(210, 189, 0, 0.2)',
    marginVertical: 2, // Reduced from 4 to 2
  },
});

export default PostOptionsModal;