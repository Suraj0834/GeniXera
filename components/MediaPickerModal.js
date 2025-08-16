import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext'; // Assuming ThemeContext is available

const MediaPickerModal = ({ isVisible, onClose, onSelectMedia }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleOptionPress = (source) => {
    onSelectMedia(source);
    onClose();
  };

  return (
    <Modal
      animationType="fade" // Changed to fade for a more centered appearance
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
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
      </View>
    </Modal>
  );
};

const getStyles = (theme) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',     // Center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: theme.card,
    borderRadius: 12, // Rectangular box with rounded corners
    padding: 25,
    width: '80%', // Set a fixed width or max width
    maxWidth: 350, // Max width for larger screens
    alignItems: 'center',
    shadowColor: '#000', // Add shadow for better UI
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  modalTitle: {
    fontSize: 20, // Slightly larger title
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 25, // More space below title
  },
  optionButton: {
    width: '100%', // Full width within the modal content
    paddingVertical: 14,
    backgroundColor: theme.button,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12, // Consistent spacing
  },
  optionButtonText: {
    fontSize: 17, // Slightly larger text
    color: theme.buttonText,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: theme.inputBackground, // A more neutral background for cancel
    marginTop: 8, // Consistent spacing
    borderColor: theme.border, // Add a subtle border
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 17,
    color: theme.text,
    fontWeight: '600',
  },
});

export default MediaPickerModal;