import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, Image, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

const PostOptionsModal = ({ isVisible, onClose, postData }) => {
  const { theme } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isVisible) {
      // Reset position and fade in
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
      
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
      // Fade out and slide down
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose();
      });
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleOptionPress = (option) => {
    // Handle different options here
    console.log('Selected option:', option);
    handleClose();
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

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View style={[styles.container, { backgroundColor: theme.overlay }]}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.card, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandle} />
          
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
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
    paddingBottom: 30,
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
  optionsContainer: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingStart: 20, // Added left padding
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
    marginVertical: 4, // Reduced from 16 to 4
  },
});

export default PostOptionsModal; 