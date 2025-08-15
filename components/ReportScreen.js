import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, Platform, InteractionManager, Image, PanResponder, Easing } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ReportSuccessScreen from './ReportSuccessScreen';

const { width, height } = Dimensions.get('window');

const ReportScreen = ({ isVisible, onClose, postData }) => {
  const { theme } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const [isSuccessScreenVisible, setIsSuccessScreenVisible] = useState(false);

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
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
      dragY.setValue(0);
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
          duration: 250,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      InteractionManager.runAfterInteractions(() => {
        onClose();
      });
    });
  };

  const handleReportOption = (option) => {
    setIsSuccessScreenVisible(true);
  };

  const reportOptions = [
    { icon: require('../assets/Report_icon.png'), text: 'The associated content is not relevant', action: 'not_relevant' },
    { icon: require('../assets/Report_icon.png'), text: 'This trend is spam', action: 'spam' },
    { icon: require('../assets/Report_icon.png'), text: 'This trend is abusive or harmful', action: 'abusive' },
    { icon: require('../assets/Report_icon.png'), text: 'Not interested in this', action: 'not_interested' },
    { icon: require('../assets/Report_icon.png'), text: 'This trend is a duplicate', action: 'duplicate' },
    { icon: require('../assets/Report_icon.png'), text: 'This trend is harmful or spammy', action: 'harmful_spam' },
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
        <TouchableOpacity
          style={styles.touchOverlay}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.modalContainer,
            { 
              backgroundColor: theme.BottomNavigationBackground,
              transform: [{ translateY: Animated.add(slideAnim, dragY) }],
              paddingBottom: insets.bottom > 0 ? 30 : 16,
              borderTopWidth: 1,
              borderTopColor: '#D2BD00',
            },
          ]}
        >
          <SafeAreaView edges={['bottom']} style={{flex: 1}}>
            <View style={styles.dragHandle} />
            <View style={styles.optionsContainer}>
              {reportOptions.map((option, index) => (
                <React.Fragment key={index}>
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => handleReportOption(option.action)}
                    activeOpacity={0.7}
                  >
                    <Image source={option.icon} style={styles.optionIcon} resizeMode="contain" />
                    <Text style={styles.optionText}>
                      {option.text}
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
      <ReportSuccessScreen
        isVisible={isSuccessScreenVisible}
        onClose={() => {
          setIsSuccessScreenVisible(false);
          onClose();
        }}
        theme={theme}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1000,
  },
  dragHandle: {
    width: 45,
    height: 5,
    backgroundColor: '#D2BD00',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
    marginVertical: 2,
  },
});

export default ReportScreen;