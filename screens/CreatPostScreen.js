import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Platform, 
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  Linking,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MediaPickerModal from '../components/MediaPickerModal'; // New import

const GIPHY_API_KEY = 'jP6unvOG0M9LwVPpYup8CG0iujyXJ5Sp';
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/gifs';

const CustomIcon = ({ source, defaultText, imageStyle, textStyle }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false); // Reset error state when source changes
  }, [source]);

  if (imageError) {
    return <Text style={textStyle}>{defaultText}</Text>;
  }

  return (
    <Image
      source={source}
      style={imageStyle}
      onError={(e) => {
        console.log('Image loading error:', e.nativeEvent.error);
        setImageError(true);
      }}
    />
  );
};

const CreatPostScreen = ({ navigation, route }) => {
    const { theme } = useTheme();
  const styles = getStyles(theme);
  const insets = useSafeAreaInsets();
  const textInputRef = useRef(null);
  
  const [postText, setPostText] = useState('');
  const [isPollModalVisible, setIsPollModalVisible] = useState(false);
  const [isGifModalVisible, setIsGifModalVisible] = useState(false);
  const [isMediaPickerModalVisible, setIsMediaPickerModalVisible] = useState(false); // New state variable
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollQuestion, setPollQuestion] = useState('');
  const [createdPoll, setCreatedPoll] = useState(null);
  const [gifSearchQuery, setGifSearchQuery] = useState('');
  const [searchedGifs, setSearchedGifs] = useState([]);
  const [pollType, setPollType] = useState('poll');
  const [mcqCorrectAnswer, setMcqCorrectAnswer] = useState(0);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const [trendingGifs, setTrendingGifs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMoreGifs, setHasMoreGifs] = useState(true);
  const [isEditingPoll, setIsEditingPoll] = useState(false); // New state variable

  // Add this to get callback from HomeScreen
  const addPostToHome = route.params?.addPostToHome;

  useEffect(() => {
    if (route.params?.editedMedia) {
      setSelectedMedia(route.params.editedMedia);
    }
  }, [route.params?.editedMedia]);

  useEffect(() => {
    textInputRef.current?.focus();
  }, []);

  useEffect(() => {
    fetchTrendingGifs();
  }, []);

  const fetchTrendingGifs = async () => {
    if (!hasMoreGifs || isLoadingGifs) return;

    try {
      setIsLoadingGifs(true);
      const response = await fetch(
        `${GIPHY_BASE_URL}/trending?api_key=${GIPHY_API_KEY}&limit=25&offset=${offset}`
      );
      const data = await response.json();
      
      if (data.data.length === 0) {
        setHasMoreGifs(false);
      } else {
        setTrendingGifs((prevGifs) => {
          const uniqueNewGifs = data.data.filter(
            (newGif) => !prevGifs.some((existingGif) => existingGif.id === newGif.id)
          );
          return [...prevGifs, ...uniqueNewGifs];
        });
        setOffset((prevOffset) => prevOffset + data.data.length);
      }
    } catch (error) {
      
    } finally {
      setIsLoadingGifs(false);
    }
  };

  const searchGifs = async (query) => {
    if (!query.trim()) {
      setSearchedGifs([]);
      return;
    }

    try {
      setIsLoadingGifs(true);
      const response = await fetch(
        `${GIPHY_BASE_URL}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchedGifs(data.data || []);
    } catch (error) {
      
    } finally {
      setIsLoadingGifs(false);
    }
  };

  const handleMediaPress = () => {
    setIsMediaPickerModalVisible(true);
  };

  const pickMedia = async (source) => {
    try {
      let result;
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Camera permission is needed to take photos. Please enable it in your device settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Media library permission is needed to pick photos/videos. Please enable it in your device settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1,
        });
      }

      if (result.canceled) return;

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        // Pass width and height to MediaEditScreen
        navigation.navigate('MediaEdit', { media: { ...asset, width: asset.width, height: asset.height } });
      }
    } catch (error) {
      console.error('Error picking media:', error); // Log the actual error for debugging
      Alert.alert('Error', 'Failed to select media. Please try again.');
    }
  };

  const handlePollPress = () => {
    setIsPollModalVisible(true);
  };

  const handleGifPress = () => {
    setIsGifModalVisible(true);
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const updatePollOption = (index, text) => {
    const newOptions = [...pollOptions];
    newOptions[index] = text;
    setPollOptions(newOptions);
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      const newOptions = pollOptions.filter((_, i) => i !== index);
      setPollOptions(newOptions);
      if (mcqCorrectAnswer === index) {
        setMcqCorrectAnswer(0);
      } else if (mcqCorrectAnswer > index) {
        setMcqCorrectAnswer(mcqCorrectAnswer - 1);
      }
    }
  };

  const createPoll = () => {
    if (!pollQuestion.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }

    const validOptions = pollOptions.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      Alert.alert('Error', 'Please enter at least two options');
      return;
    }

    const poll = {
      question: pollQuestion,
      options: validOptions,
      type: pollType,
      ...(pollType === 'mcq' && { correctAnswer: mcqCorrectAnswer }),
    };

    setCreatedPoll(poll);
    setIsPollModalVisible(false);
  };

  const handlePost = () => {
    // Prepare post data
    const newPost = {
      text: postText,
      media: selectedMedia,
      poll: createdPoll,
      createdAt: new Date().toISOString(),
      // add other fields as needed
    };
    // Add post to HomeScreen if callback exists
    if (typeof addPostToHome === 'function') {
      addPostToHome(newPost);
    }
    // Navigate to HomeScreen
    navigation.navigate('Home');
  };

  const renderGifItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.gifButton}
      onPress={() => {
        setSelectedMedia({ 
          uri: item.images.original.url,
          type: 'gif',
          width: parseInt(item.images.original.width),
          height: parseInt(item.images.original.height),
        });
        setIsGifModalVisible(false);
      }}
    >
      <Image
        source={{ uri: item.images.preview_gif.url }}
        style={styles.gifPreview}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* Replace Cancel text with left arrow icon */}
          <Image
            source={require('../assets/arrow_left.png')} // Use your left arrow icon here
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.postButton, 
            { 
              opacity: (postText.trim() || selectedMedia || createdPoll) ? 1 : 0.5
            }
          ]}
          onPress={handlePost}
          disabled={!postText.trim() && !selectedMedia && !createdPoll}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.inputContainer}>
            <Image
              source={require('../assets/Profile.png')}
              style={styles.profileImage}
            />
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              placeholder="What's happening?"
              placeholderTextColor={theme.placeholder}
              multiline
              value={postText}
              onChangeText={setPostText}
            />
          </View>

          {selectedMedia && (
            <View style={styles.mediaPreview}>
              {selectedMedia.type === 'gif' || selectedMedia.type?.startsWith('image') ? (
                <Image 
                  source={{ uri: selectedMedia.uri }} 
                  style={[styles.mediaImage, { aspectRatio: selectedMedia.width / selectedMedia.height }]} 
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.videoPlaceholder}>
                  <Text style={{ color: theme.text }}>Video Preview</Text>
                </View>
              )}
              <TouchableOpacity 
                style={styles.removeMedia}
                onPress={() => setSelectedMedia(null)}
              >
                <Image
                  source={require('../assets/remove_icon.png')} // Assuming remove_icon.png exists
                  style={styles.removeMediaImage} // New style for this image
                />
              </TouchableOpacity>
            </View>
          )}

          {createdPoll && (
            <View style={styles.pollPreview}>
              <Text style={styles.pollQuestion}>
                {createdPoll.question}
              </Text>
              {createdPoll.options.map((opt, idx) => (
                <View 
                  key={idx}
                  style={[
                    styles.pollOptionPreview,
                    { 
                      backgroundColor: createdPoll.type === 'mcq' && createdPoll.correctAnswer === idx ? 
                        'rgba(210, 189, 0, 0.2)' : 'transparent'
                    }
                  ]}
                >
                  <Text style={{ color: theme.text }}>{opt}</Text>
                </View>
              ))}
              {/* New icons for edit and remove */}
              <View style={styles.pollActionIcons}>
                <TouchableOpacity
                  style={styles.pollEditIcon}
                  onPress={handlePollPress}
                >
                  {/* Conditionally render Image or Text based on whether custom icon loads */}
                  <CustomIcon
                    source={require('../assets/edit_icon.png')}
                    defaultText="✎"
                    imageStyle={styles.pollImage}
                    textStyle={styles.pollIconText}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.pollRemoveIcon}
                  onPress={() => setCreatedPoll(null)}
                >
                  <CustomIcon
                    source={require('../assets/remove_icon.png')}
                    defaultText="×"
                    imageStyle={styles.pollImage}
                    textStyle={styles.pollIconText}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Improved Bottom Toolbar */}
        <SafeAreaView
          edges={[]} // changed from ['bottom'] to [] to avoid extra bottom space
          style={styles.bottomToolbarNatural}
        >
          <View style={styles.mediaIconsNatural}>
            <TouchableOpacity 
              style={styles.mediaButtonNatural}
              onPress={handleMediaPress}
              activeOpacity={0.7}
            >
              <Image 
                source={require('../assets/camera_icon.png')} 
                style={styles.mediaIconNatural}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mediaButtonNatural}
              onPress={handleGifPress}
              activeOpacity={0.7}
            >
              <Image 
                source={require('../assets/gif_icon.png')} 
                style={styles.mediaIconNatural}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mediaButtonNatural}
              onPress={handlePollPress}
              activeOpacity={0.7}
            >
              <Image 
                source={require('../assets/ic_outline-poll.png')} 
                style={styles.mediaIconNatural}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          {/* Character count inside toolbar, right-aligned */}
          {postText.length > 0 && (
            <View style={styles.characterCountNaturalContainer}>
              <Text style={[
                styles.characterCountNatural,
                {
                  color: postText.length > 260 ? '#FF6B6B' : theme.placeholder,
                }
              ]}>
                {postText.length}/280
              </Text>
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* Poll Modal */}
      <Modal
        visible={isPollModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPollModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pollModal}>
            <View style={styles.pollHeader}>
              <TouchableOpacity onPress={() => setIsPollModalVisible(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Create Poll</Text>
              <TouchableOpacity onPress={createPoll}>
                <Text style={styles.createButton}>Create</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.pollInput}
              placeholder="Ask a question..."
              placeholderTextColor={theme.placeholder}
              value={pollQuestion}
              onChangeText={setPollQuestion}
            />

            <View style={styles.pollTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.pollTypeButton, 
                  pollType === 'poll' && { backgroundColor: theme.accent }
                ]}
                onPress={() => setPollType('poll')}
              >
                <Text style={[
                  styles.pollTypeText,
                  pollType === 'poll' && { color: '#000' }
                ]}>
                  Poll
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.pollTypeButton, 
                  pollType === 'mcq' && { backgroundColor: theme.accent }
                ]}
                onPress={() => setPollType('mcq')}
              >
                <Text style={[
                  styles.pollTypeText,
                  pollType === 'mcq' && { color: '#000' }
                ]}>
                  MCQ
                </Text>
              </TouchableOpacity>
            </View>

            {pollOptions.map((option, index) => (
              <View key={index} style={styles.optionContainer}>
                <TextInput
                  style={styles.optionInput}
                  placeholder={`Option ${index + 1}`}
                  placeholderTextColor={theme.placeholder}
                  value={option}
                  onChangeText={(text) => updatePollOption(index, text)}
                />
                {pollType === 'mcq' && (
                  <TouchableOpacity
                    style={[
                      styles.correctAnswerButton,
                      mcqCorrectAnswer === index && { 
                        backgroundColor: theme.accent,
                        borderColor: theme.accent
                      }
                    ]}
                    onPress={() => setMcqCorrectAnswer(index)}
                  >
                    <Text style={[
                      styles.correctAnswerText,
                      mcqCorrectAnswer === index && { color: '#000' }
                    ]}>
                      {mcqCorrectAnswer === index ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                )}
                {pollOptions.length > 2 && (
                  <TouchableOpacity onPress={() => removePollOption(index)}>
                    <Text style={{ color: '#FF0000', marginLeft: 8 }}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {pollOptions.length < 4 && (
              <TouchableOpacity 
                style={styles.addOption} 
                onPress={addPollOption}
              >
                <Text style={styles.addOptionText}>
                  + Add option
                </Text>
              </TouchableOpacity>
            )}

            {pollType === 'mcq' && (
              <Text style={styles.mcqHelper}>
                Select the correct answer by tapping the circle
              </Text>
            )}
          </View>
        </View>
      </Modal>

      {/* GIF Modal */}
      <Modal
        visible={isGifModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsGifModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.gifModal}>
            <View style={styles.pollHeader}>
              <TouchableOpacity onPress={() => setIsGifModalVisible(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Search GIFs</Text>
            </View>

            <View style={styles.gifSearchContainer}>
              <TextInput
                style={styles.gifSearchInput}
                placeholder="Search GIFs..."
                placeholderTextColor={theme.placeholder}
                value={gifSearchQuery}
                onChangeText={(text) => {
                  setGifSearchQuery(text);
                  searchGifs(text);
                }}
              />
            </View>

            {isLoadingGifs ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading GIFs...</Text>
              </View>
            ) : (
              <FlatList
                data={gifSearchQuery ? searchedGifs : trendingGifs}
                keyExtractor={(item) => item.id}
                renderItem={renderGifItem}
                numColumns={2}
                onEndReached={!gifSearchQuery ? fetchTrendingGifs : null}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={
                  !gifSearchQuery && trendingGifs.length > 0 ? (
                    <Text style={styles.sectionTitle}>Trending GIFs</Text>
                  ) : null
                }
                ListFooterComponent={
                  isLoadingGifs && !gifSearchQuery ? (
                    <View style={styles.loadingIndicatorContainer}>
                      <ActivityIndicator size="large" color={theme.accent} />
                    </View>
                  ) : null
                }
                ListEmptyComponent={
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>
                      {gifSearchQuery ? 'No GIFs found' : 'No trending GIFs'}
                    </Text>
                    <Text style={styles.noResultsSubtext}>
                      {gifSearchQuery ? 'Try a different search' : 'Check back later'}
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isVisible={isMediaPickerModalVisible}
        onClose={() => setIsMediaPickerModalVisible(false)}
        onSelectMedia={(source) => {
          pickMedia(source);
          setIsMediaPickerModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerIcon: {
    width: 20,
    height: 20,
    tintColor: theme.icon,
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.button,
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.buttonText,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingTop: 16,
  },
    profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: theme.accent,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  mediaPreview: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: 'rgba(210, 189, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeMedia: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeMediaText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  removeMediaImage: {
    width: 16, // Adjust as needed
    height: 16, // Adjust as needed 
    // Assuming white icons for visibility on dark backgrounds
  },
  pollPreview: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
    position: 'relative', // Added for absolute positioning of icons
  },
  pollQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: theme.text,
  },
  pollOptionPreview: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: theme.border,
  },
  pollActionIcons: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    zIndex: 1, // Ensure icons are on top
  },
  pollEditIcon: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8, // Space between icons
  },
  pollRemoveIcon: {
    backgroundColor: 'rgba(255,0,0,0.5)', // Red background for remove
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pollIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pollImage: {
    width: 25, // Adjust as needed
    height: 25, // Adjust as needed
    // Assuming white icons for visibility on dark backgrounds
  },
  bottomToolbarNatural: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    backgroundColor: theme.background,
  },
  mediaIconsNatural: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaButtonNatural: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mediaIconNatural: {
    width: 26,
    height: 26,
    tintColor: theme.accent,
  },
  mediaIconTextNatural: {
    fontSize: 17,
    fontWeight: 'bold',
    color: theme.accent,
  },
  characterCountNaturalContainer: {
    justifyContent: 'center',
  },
  characterCountNatural: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  pollModal: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  pollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalClose: {
    fontSize: 28,
    color: theme.accent,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  createButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.accent,
  },
  pollInput: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    backgroundColor: theme.inputBackground,
    color: theme.text,
    borderColor: theme.border,
  },
  pollTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pollTypeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 8,
    backgroundColor: theme.inputBackground,
  },
  pollTypeText: {
    fontWeight: 'bold',
    color: theme.text,
  },
  addOption: {
    alignSelf: 'center',
    marginVertical: 12,
  },
  addOptionText: {
    fontWeight: 'bold',
    color: theme.accent,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  optionInput: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    backgroundColor: theme.inputBackground,
    color: theme.text,
  },
  correctAnswerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.accent,
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  mcqHelper: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 8,
    color: theme.placeholder,
  },
  gifModal: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  gifButton: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gifPreview: {
    width: '100%',
    height: 120,
  },
  gifSearchContainer: {
    marginBottom: 16,
  },
  gifSearchInput: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    backgroundColor: theme.inputBackground,
    color: theme.text,
    borderColor: theme.border,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.accent,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: theme.text,
  },
  noResultsSubtext: {
    fontSize: 14,
    marginTop: 4,
    color: theme.placeholder,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: theme.text,
  },
  loadingIndicatorContainer: {
    paddingVertical: 20,
  },
});


export default CreatPostScreen;