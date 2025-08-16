import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext'; // Assuming ThemeContext is available
// import { BlurView } from '@react-native-community/blur'; // Removed BlurView import

const MediaPickerModal = ({ isVisible, onClose, onSelectMedia }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleOptionPress = (source) => {
    onSelectMedia(source);
    onClose();
  };

  // Revert to using a plain View for the background
  const ModalBackground = View;

  return (
    <Modal
      animationType="slide" 
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ModalBackground // Use plain View
        style={styles.modalOverlay}
        // Removed blur props
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Media</Text>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionPress('camera')}
          >
            <Text style={styles.optionButtonText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionPress('library')}
          >
            <Text style={styles.optionButtonText}>Library</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ModalBackground>
    </Modal>
  );
};

const getStyles = (theme) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Re-added background color
  },
  modalContent: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 25,
    width: '80%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
    borderWidth: 1, // Keep border width
    borderColor: theme.accent, // Keep border color
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 25,
  },
  optionButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: theme.button,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  optionButtonText: {
    fontSize: 17,
    color: theme.buttonText,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: theme.inputBackground,
    marginTop: 8,
    borderColor: theme.border,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 17,
    color: theme.text,
    fontWeight: '600',
  },
});

export default MediaPickerModal;