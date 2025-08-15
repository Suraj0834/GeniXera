import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ReportSuccessScreen = ({ isVisible, onClose, theme }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={[styles.container, { backgroundColor: theme.overlay }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.popupContainer, { backgroundColor: theme.background, borderColor: theme.accent, borderWidth: 1 }]}>
          <Image source={require('../assets/check.png')} style={styles.logo} />
          <Text style={[styles.message, { color: theme.text }]}>Report done</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
  width: 80,
  height: 80,
  marginBottom: 20,
  // tintColor: '#D2BD00', // Correct property
},
  message: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReportSuccessScreen;

