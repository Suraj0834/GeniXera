import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MediaEditScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { media } = route.params || {};
  
  const [editedMedia, setEditedMedia] = useState({
    ...media,
    width: media?.width,
    height: media?.height,
  });
  const [currentRotation, setCurrentRotation] = useState(0);
  const [currentScale, setCurrentScale] = useState(1);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    navigation.navigate('CreatPost', { editedMedia });
  };

  const handleRotate = () => {
    const newRotation = (currentRotation + 90) % 360;
    setCurrentRotation(newRotation);
    setEditedMedia({
      ...editedMedia,
      rotation: newRotation,
    });
  };

  const handleResize = (size) => {
    setCurrentScale(size);
    setEditedMedia({
      ...editedMedia,
      scale: size,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={theme.mode === 'dark' ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border, paddingTop: insets.top > 0 ? 0 : 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={[styles.backArrow, { color: theme.accent }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Media</Text>
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: theme.accent }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: theme.buttonText }]}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Media Preview */}
      <View style={styles.mediaContainer}>
        <Image
          source={{ uri: editedMedia?.uri }}
          style={[
            styles.mediaPreview,
            {
              transform: [
                { rotate: `${currentRotation}deg` },
                { scale: currentScale },
              ],
            },
          ]}
          resizeMode="contain"
        />
      </View>

      {/* Editing Tools */}
      <ScrollView style={styles.toolsContainer} showsVerticalScrollIndicator={false}>
        {/* Basic Tools */}
        <View style={styles.toolSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Basic Tools</Text>
          <View style={styles.toolRow}>
            <TouchableOpacity 
              style={[styles.toolButton, { backgroundColor: theme.inputBackground }]} 
              onPress={handleRotate}
            >
              <Text style={styles.toolIcon}>🔄</Text>
              <Text style={[styles.toolText, { color: theme.text }]}>Rotate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Resize Options */}
        <View style={styles.toolSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Resize</Text>
          <View style={styles.resizeOptions}>
            <TouchableOpacity
              style={[styles.resizeButton, { backgroundColor: theme.inputBackground }, currentScale === 0.5 && styles.activeResizeButton]}
              onPress={() => handleResize(0.5)}
            >
              <Text style={[styles.resizeText, { color: theme.text }]}>Small</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resizeButton, { backgroundColor: theme.inputBackground }, currentScale === 1 && styles.activeResizeButton]}
              onPress={() => handleResize(1)}
            >
              <Text style={[styles.resizeText, { color: theme.text }]}>Original</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resizeButton, { backgroundColor: theme.inputBackground }, currentScale === 1.5 && styles.activeResizeButton]}
              onPress={() => handleResize(1.5)}
            >
              <Text style={[styles.resizeText, { color: theme.text }]}>Large</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  mediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mediaPreview: {
    width: screenWidth - 40,
    height: screenHeight * 0.4,
    borderRadius: 12,
  },
  toolsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  toolSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  toolRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  toolButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  toolIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  toolText: {
    fontSize: 12,
    textAlign: 'center',
  },
  resizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resizeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  activeResizeButton: {
    backgroundColor: '#D2BD00',
  },
  resizeText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default MediaEditScreen;