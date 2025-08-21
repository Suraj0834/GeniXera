import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Alert,
  Dimensions,
  Modal,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

// Format time as mm:ss
const formatTime = (time) => {
  if (!time || isNaN(time)) return '00:00';
  const totalSeconds = Math.floor(time);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MediaEditScreen = ({ route, navigation }) => {
  const { media } = route.params;
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isImage = media?.type === 'image';
  const isVideo = media?.type === 'video';
  
  // Video player ref
  const videoRef = useRef(null);
  
  // State variables
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(media?.duration || 10);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoRotation, setVideoRotation] = useState(0);
  const [cropMode, setCropMode] = useState('free');
  const [videoDuration, setVideoDuration] = useState(media?.duration || 0);
  const [videoPosition, setVideoPosition] = useState(0);
  const [isTrimming, setIsTrimming] = useState(false);
  const [editedMedia, setEditedMedia] = useState({
    ...media,
    width: media?.width,
    height: media?.height,
  });
  const [currentRotation, setCurrentRotation] = useState(0);
  const [currentScale, setCurrentScale] = useState(1);
  const [filters, setFilters] = useState([
    { name: 'Normal', value: 1, active: true },
    { name: 'Clarendon', value: 2, active: false },
    { name: 'Juno', value: 3, active: false },
    { name: 'Lark', value: 4, active: false },
    { name: 'Moon', value: 5, active: false },
  ]);
  const [selectedFilter, setSelectedFilter] = useState('Normal');
  const [thumbnailUri, setThumbnailUri] = useState(null);
  const [thumbnailModalVisible, setThumbnailModalVisible] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [isCropping, setIsCropping] = useState(false);

  // Pan responder for free crop
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (isCropping && cropMode === 'free') {
          const { locationX, locationY } = evt.nativeEvent;
          setCropArea(prev => ({
            ...prev,
            x: Math.max(0, Math.min(locationX - prev.width/2, screenWidth - 40 - prev.width)),
            y: Math.max(0, Math.min(locationY - prev.height/2, screenHeight * 0.4 - prev.height))
          }));
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isVideo && media?.duration) {
      setTrimEnd(media.duration);
      setVideoDuration(media.duration);
      setIsPlaying(false);
    }
  }, [media]);

  // Handle video playback status updates
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setVideoPosition(status.positionMillis / 1000);
      setVideoDuration(status.durationMillis / 1000);
      setIsPlaying(status.isPlaying);
      
      // If we reached the end of the trim range, pause
      if (status.positionMillis >= trimEnd * 1000 && status.isPlaying) {
        videoRef.current?.pauseAsync();
        setIsPlaying(false);
      }
    }
  };

  const handleBack = () => navigation.goBack();
  const handleSave = () => {
    navigation.navigate('CreatePost', { 
      editedMedia: {
        ...editedMedia,
        crop: cropArea,
        cropMode,
        trimStart,
        trimEnd
      }
    });
  };
  
  const handleRotate = () => {
    const newRotation = (currentRotation + 90) % 360;
    setCurrentRotation(newRotation);
    setEditedMedia({ ...editedMedia, rotation: newRotation });
  };
  
  const handleVideoRotate = () => {
    const newRotation = (videoRotation + 90) % 360;
    setVideoRotation(newRotation);
    setEditedMedia({ ...editedMedia, rotation: newRotation });
  };
  
  const handleResize = (size) => {
    setCurrentScale(size);
    setEditedMedia({ ...editedMedia, scale: size });
  };
  
  const handleCropMode = (mode) => {
    setCropMode(mode);
    // Set default crop area based on mode
    if (mode === 'free') {
      setCropArea({ x: 0, y: 0, width: 100, height: 100 });
    } else {
      // Set aspect ratio based on mode
      const [widthRatio, heightRatio] = mode.split(':').map(Number);
      const aspectRatio = widthRatio / heightRatio;
      
      const containerWidth = screenWidth - 40;
      const containerHeight = screenHeight * 0.4;
      
      let cropWidth, cropHeight;
      
      if (aspectRatio > 1) {
        // Landscape
        cropWidth = containerWidth;
        cropHeight = containerWidth / aspectRatio;
      } else {
        // Portrait or square
        cropHeight = containerHeight;
        cropWidth = containerHeight * aspectRatio;
      }
      
      setCropArea({
        x: (containerWidth - cropWidth) / 2,
        y: (containerHeight - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      });
    }
  };
  
  const applyFilter = (filterName) => {
    setSelectedFilter(filterName);
    setFilters(filters.map(f => ({ ...f, active: f.name === filterName })));
    setEditedMedia({ ...editedMedia, filter: filterName });
  };
  
  const handleTrimChange = (type, value) => {
    if (type === 'start') {
      const newStart = Math.min(value, trimEnd - 0.1);
      setTrimStart(newStart);
      setEditedMedia({ ...editedMedia, trimStart: newStart });
      if (videoRef.current) {
        videoRef.current.setPositionAsync(newStart * 1000);
      }
    } else {
      const newEnd = Math.max(value, trimStart + 0.1);
      setTrimEnd(newEnd);
      setEditedMedia({ ...editedMedia, trimEnd: newEnd });
    }
    setIsTrimming(true);
  };
  
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    setEditedMedia({ ...editedMedia, muted: !isMuted });
  };
  
  const togglePlayPause = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          // If we're at the end, seek to trim start before playing
          if (videoPosition >= trimEnd) {
            await videoRef.current.setPositionAsync(trimStart * 1000);
          }
          await videoRef.current.playAsync();
        }
      }
    }
  };
  
  const seekVideo = async (position) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(position * 1000);
    }
  };
  
  const captureVideoFrame = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(editedMedia?.uri, {
        time: Math.floor(videoPosition * 1000),
        quality: 1,
      });
      setThumbnailUri(uri);
      setEditedMedia({ ...editedMedia, thumbnail: uri });
      Alert.alert('Success', 'Thumbnail generated successfully!');
    } catch (error) {
      console.log('captureVideoFrame: error generating thumbnail', error);
      Alert.alert('Error', 'Could not generate thumbnail from video.');
    }
  };
  
  const handlePickThumbnailImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to select a thumbnail.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [16, 9],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setThumbnailUri(result.assets[0].uri);
        setEditedMedia({ ...editedMedia, thumbnail: result.assets[0].uri });
      }
    } catch (err) {
      Alert.alert('Error', 'Could not pick thumbnail image.');
    }
  };
  
  const applyTrim = () => {
    setIsTrimming(false);
    if (videoRef.current) {
      videoRef.current.setPositionAsync(trimStart * 1000);
    }
  };
  
  const getVideoPlayerStyle = () => {
    const isPortrait = videoRotation % 180 !== 0;
    return {
      width: isPortrait ? '70%' : '100%',
      height: isPortrait ? '100%' : '100%',
      transform: [{ rotate: `${videoRotation}deg` }],
    };
  };
  
  const getCropButtonStyle = (mode) => [
    styles.cropButton,
    { backgroundColor: theme.inputBackground },
    cropMode === mode && [styles.activeCropButton, { backgroundColor: theme.accent }],
  ];
  
  const getCropTextStyle = (mode) => [
    styles.cropText,
    { color: theme.text },
    cropMode === mode && { color: theme.buttonText },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border, paddingTop: insets.top > 0 ? 0 : 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={[styles.backArrow, { color: theme.accent }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Edit {isImage ? 'Image' : isVideo ? 'Video' : 'Media'}</Text>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.accent }]} onPress={handleSave}>
          <Text style={[styles.saveButtonText, { color: theme.buttonText }]}>Save</Text>
        </TouchableOpacity>
      </View>
      
      {/* Media Preview */}
      <View style={styles.mediaContainer}>
        {isImage && (
          <View style={styles.imageWrapper}>
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
        )}
        
        {isVideo && (
          <View style={[styles.videoPreviewBox, { backgroundColor: theme.card }]}> 
            {editedMedia?.uri ? (
              <Video
                ref={videoRef}
                source={{ uri: editedMedia.uri }}
                style={[styles.videoPlayer, getVideoPlayerStyle()]}
                resizeMode={ResizeMode.CONTAIN}
                isMuted={isMuted}
                isLooping={false}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                shouldPlay={isPlaying}
              />
            ) : (
              <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
                Error: Video URI is missing or invalid.
              </Text>
            )}
            
            {/* Progress Bar */}
            <View style={{ width: '100%', marginTop: 10 }}>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={videoDuration}
                value={videoPosition}
                onSlidingComplete={seekVideo}
                minimumTrackTintColor={theme.accent}
                maximumTrackTintColor={theme.border}
                thumbTintColor={theme.accent}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: theme.text, fontSize: 12 }}>
                  {formatTime(videoPosition)}
                </Text>
                <Text style={{ color: theme.text, fontSize: 12 }}>
                  {formatTime(videoDuration)}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
              <Text style={styles.playIcon}>{isPlaying ? '⏸' : (videoPosition >= videoDuration ? '⟳' : '▶')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Editing Tools */}
      <ScrollView style={styles.toolsContainer} showsVerticalScrollIndicator={false}>
        {isImage && (
          <>
            {/* Image Editing Tools */}
            <View style={styles.toolSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Adjustments</Text>
              <View style={styles.toolRow}>
                <TouchableOpacity style={[styles.toolButton, { backgroundColor: theme.inputBackground }]} onPress={handleRotate}>
                  <Text style={styles.toolIcon}>↻</Text>
                  <Text style={[styles.toolText, { color: theme.text }]}>Rotate</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toolButton, { backgroundColor: theme.inputBackground }]} 
                  onPress={() => setIsCropping(!isCropping)}
                >
                  <Text style={styles.toolIcon}>✂️</Text>
                  <Text style={[styles.toolText, { color: theme.text }]}>Crop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toolButton, { backgroundColor: theme.inputBackground }]} onPress={() => {}}>
                  <Text style={styles.toolIcon}>☀️</Text>
                  <Text style={[styles.toolText, { color: theme.text }]}>Brightness</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {isCropping && (
              <View style={styles.toolSection}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Crop Aspect Ratio</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cropContainer}>
                  <TouchableOpacity style={getCropButtonStyle('free')} onPress={() => handleCropMode('free')}>
                    <Text style={getCropTextStyle('free')}>Free</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={getCropButtonStyle('1:1')} onPress={() => handleCropMode('1:1')}>
                    <Text style={getCropTextStyle('1:1')}>1:1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={getCropButtonStyle('4:3')} onPress={() => handleCropMode('4:3')}>
                    <Text style={getCropTextStyle('4:3')}>4:3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={getCropButtonStyle('16:9')} onPress={() => handleCropMode('16:9')}>
                    <Text style={getCropTextStyle('16:9')}>16:9</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={getCropButtonStyle('9:16')} onPress={() => handleCropMode('9:16')}>
                    <Text style={getCropTextStyle('9:16')}>9:16</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
            
            <View style={styles.toolSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Resize</Text>
              <View style={styles.resizeOptions}>
                <TouchableOpacity style={[styles.resizeButton, { backgroundColor: theme.inputBackground }, currentScale === 0.5 && [styles.activeResizeButton, { backgroundColor: theme.accent }]]} onPress={() => handleResize(0.5)}>
                  <Text style={[styles.resizeText, { color: theme.text }, currentScale === 0.5 && { color: theme.buttonText }]}>Small</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.resizeButton, { backgroundColor: theme.inputBackground }, currentScale === 1 && [styles.activeResizeButton, { backgroundColor: theme.accent }]]} onPress={() => handleResize(1)}>
                  <Text style={[styles.resizeText, { color: theme.text }, currentScale === 1 && { color: theme.buttonText }]}>Original</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.resizeButton, { backgroundColor: theme.inputBackground }, currentScale === 1.5 && [styles.activeResizeButton, { backgroundColor: theme.accent }]]} onPress={() => handleResize(1.5)}>
                  <Text style={[styles.resizeText, { color: theme.text }, currentScale === 1.5 && { color: theme.buttonText }]}>Large</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.toolSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Filters</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
                {filters.map((filter, index) => (
                  <TouchableOpacity key={index} style={[styles.filterItem, { backgroundColor: theme.inputBackground }, filter.active && [styles.activeFilter, { borderColor: theme.accent }]]} onPress={() => applyFilter(filter.name)}>
                    <View style={[styles.filterPreview, { backgroundColor: theme.card }]} />
                    <Text style={[styles.filterText, { color: theme.text }, filter.active && { color: theme.accent, fontWeight: '600' }]}>{filter.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
        
        {isVideo && (
          <>
            {/* Video Editing Tools */}
            <View style={styles.toolSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Video Controls</Text>
              <View style={styles.toolRow}>
                <TouchableOpacity style={[styles.toolButton, { backgroundColor: theme.inputBackground }]} onPress={handleMuteToggle}>
                  <Text style={styles.toolIcon}>{isMuted ? '🔇' : '🔊'}</Text>
                  <Text style={[styles.toolText, { color: theme.text }]}>{isMuted ? 'Muted' : 'Unmuted'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toolButton, { backgroundColor: theme.inputBackground }]} onPress={togglePlayPause}>
                  <Text style={styles.toolIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
                  <Text style={[styles.toolText, { color: theme.text }]}>{isPlaying ? 'Pause' : 'Play'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toolButton, { backgroundColor: theme.inputBackground }]} onPress={handleVideoRotate}>
                  <Text style={styles.toolIcon}>↻</Text>
                  <Text style={[styles.toolText, { color: theme.text }]}>Rotate</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.toolSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Crop Aspect Ratio</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cropContainer}>
                <TouchableOpacity style={getCropButtonStyle('free')} onPress={() => handleCropMode('free')}>
                  <Text style={getCropTextStyle('free')}>Free</Text>
                </TouchableOpacity>
                <TouchableOpacity style={getCropButtonStyle('1:1')} onPress={() => handleCropMode('1:1')}>
                  <Text style={getCropTextStyle('1:1')}>1:1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={getCropButtonStyle('4:3')} onPress={() => handleCropMode('4:3')}>
                  <Text style={getCropTextStyle('4:3')}>4:3</Text>
                </TouchableOpacity>
                <TouchableOpacity style={getCropButtonStyle('16:9')} onPress={() => handleCropMode('16:9')}>
                  <Text style={getCropTextStyle('16:9')}>16:9</Text>
                </TouchableOpacity>
                <TouchableOpacity style={getCropButtonStyle('9:16')} onPress={() => handleCropMode('9:16')}>
                  <Text style={getCropTextStyle('9:16')}>9:16</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            
            <View style={styles.toolSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Trim Video</Text>
              <View style={[styles.timelineContainer, { backgroundColor: theme.inputBackground }]}>
                <View style={styles.trimSliderContainer}>
                  <Text style={[styles.sliderLabel, { color: theme.text }]}>Start: {formatTime(trimStart)}</Text>
                  <View style={styles.sliderWrapper}>
                    <View style={[styles.sliderTrack, { backgroundColor: theme.border }]}>
                      <View style={[styles.sliderFill, {
                        backgroundColor: theme.accent,
                        left: `${(trimStart / videoDuration) * 100}%`,
                        width: `${((trimEnd - trimStart) / videoDuration) * 100}%`
                      }]} />
                    </View>
                    <View style={styles.sliderHandles}>
                      <TouchableOpacity 
                        style={[styles.sliderThumb, { left: `${(trimStart / videoDuration) * 100}%` }]} 
                        onPressIn={() => setIsTrimming(true)}
                      />
                      <TouchableOpacity 
                        style={[styles.sliderThumb, { left: `${(trimEnd / videoDuration) * 100}%` }]} 
                        onPressIn={() => setIsTrimming(true)}
                      />
                    </View>
                  </View>
                  <Text style={[styles.sliderLabel, { color: theme.text }]}>End: {formatTime(trimEnd)}</Text>
                </View>
                
                <View style={styles.trimControlContainer}>
                  <Slider
                    style={{ width: '45%' }}
                    minimumValue={0}
                    maximumValue={videoDuration}
                    value={trimStart}
                    onValueChange={(value) => handleTrimChange('start', value)}
                    minimumTrackTintColor={theme.accent}
                    maximumTrackTintColor="transparent"
                    thumbTintColor={theme.accent}
                  />
                  <Slider
                    style={{ width: '45%' }}
                    minimumValue={0}
                    maximumValue={videoDuration}
                    value={trimEnd}
                    onValueChange={(value) => handleTrimChange('end', value)}
                    minimumTrackTintColor="transparent"
                    maximumTrackTintColor={theme.accent}
                    thumbTintColor={theme.accent}
                  />
                </View>
                
                {isTrimming && (
                  <TouchableOpacity style={[styles.applyTrimButton, { backgroundColor: theme.accent }]} onPress={applyTrim}>
                    <Text style={[styles.applyTrimText, { color: theme.buttonText }]}>Apply Trim</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            <View style={styles.toolSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Thumbnail</Text>
              <View style={styles.coverFrameOptions}>
                <TouchableOpacity style={[styles.toolButton, { backgroundColor: theme.inputBackground }]} onPress={captureVideoFrame}>
                  <Text style={styles.toolIcon}>🎞️</Text>
                  <Text style={[styles.toolText, { color: theme.text }]}>Capture Frame</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toolButton, { backgroundColor: theme.inputBackground }]} onPress={handlePickThumbnailImage}>
                  <Text style={styles.toolIcon}>🖼️</Text>
                  <Text style={[styles.toolText, { color: theme.text }]}>Pick Image</Text>
                </TouchableOpacity>
              </View>
              {thumbnailUri && (
                <TouchableOpacity 
                  style={{ alignItems: 'center', marginTop: 12 }}
                  onPress={() => setThumbnailModalVisible(true)}
                >
                  <Text style={{ color: theme.text, marginBottom: 4, fontSize: 12 }}>Selected Thumbnail:</Text>
                  <Image source={{ uri: thumbnailUri }} style={{ width: 120, height: 120 * (9/16), borderRadius: 8 }} />
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Thumbnail Preview Modal */}
      <Modal
        visible={thumbnailModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setThumbnailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.thumbnailModal, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Thumbnail Preview</Text>
            <Image 
              source={{ uri: thumbnailUri }} 
              style={styles.modalThumbnail}
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: theme.accent }]}
              onPress={() => setThumbnailModalVisible(false)}
            >
              <Text style={[styles.modalCloseText, { color: theme.buttonText }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  imageWrapper: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  mediaPreview: {
    width: screenWidth - 40,
    height: screenHeight * 0.4,
  },
  videoPreviewBox: {
    width: screenWidth - 40,
    height: screenHeight * 0.4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  playIcon: {
    fontSize: 24,
    color: 'white',
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
    marginHorizontal: 4,
  },
  toolIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  toolText: {
    fontSize: 12,
    textAlign: 'center',
  },
  cropContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  cropButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  activeCropButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cropText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resizeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeResizeButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  resizeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filtersContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  filterItem: {
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
  },
  activeFilter: {
    borderWidth: 2,
  },
  filterPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterText: {
    fontSize: 12,
  },
  timelineContainer: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  trimSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderWrapper: {
    flex: 1,
    marginHorizontal: 8,
    position: 'relative',
    height: 20,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  sliderFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 2,
  },
  sliderHandles: {
    position: 'absolute',
    top: -8,
    left: 0,
    right: 0,
    height: 20,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
    top: 0,
    marginLeft: -10,
  },
  sliderLabel: {
    fontSize: 12,
    minWidth: 60,
    textAlign: 'center',
  },
  trimControlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  applyTrimButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  applyTrimText: {
    fontSize: 14,
    fontWeight: '600',
  },
  coverFrameOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailModal: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalThumbnail: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  modalCloseButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MediaEditScreen;