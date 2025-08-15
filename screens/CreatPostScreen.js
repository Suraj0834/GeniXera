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
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GIPHY_API_KEY = 'jP6unvOG0M9LwVPpYup8CG0iujyXJ5Sp';
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/gifs';

const CreatPostScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const textInputRef = useRef(null);
  
  const [postText, setPostText] = useState('');
  const [isPollModalVisible, setIsPollModalVisible] = useState(false);
  const [isGifModalVisible, setIsGifModalVisible] = useState(false);
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
    try {
      setIsLoadingGifs(true);
      const response = await fetch(
        `${GIPHY_BASE_URL}/trending?api_key=${GIPHY_API_KEY}&limit=20`
      );
      const data = await response.json();
      setTrendingGifs(data.data || []);
    } catch (error) {
      console.error('Failed to fetch trending GIFs:', error);
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
        `${GIPHY_BASE_URL}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20`
      );
      const data = await response.json();
      setSearchedGifs(data.data || []);
    } catch (error) {
      console.error('GIF search error:', error);
    } finally {
      setIsLoadingGifs(false);
    }
  };

  const handleMediaPress = async () => {
    Alert.alert(
      'Add Media',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => pickMedia('camera'),
        },
        {
          text: 'Library',
          onPress: () => pickMedia('library'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const pickMedia = async (source) => {
    try {
      let result;
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1,
        });
      }

      if (result.canceled) return;

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        navigation.navigate('MediaEdit', { media: asset });
      }
    } catch (error) {
      console.error('Media selection error:', error);
      Alert.alert('Error', 'Failed to select media');
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
          type: 'gif'
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* Replace Cancel text with left arrow icon */}
          <Image
            source={require('../assets/arrow_left.png')} // Use your left arrow icon here
            style={[styles.headerIcon, { tintColor: theme.icon }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.postButton, 
            { 
              backgroundColor: theme.button,
              opacity: (postText.trim() || selectedMedia || createdPoll) ? 1 : 0.5
            }
          ]}
          onPress={handlePost}
          disabled={!postText.trim() && !selectedMedia && !createdPoll}
        >
          <Text style={[styles.postButtonText, { color: theme.buttonText }]}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        <ScrollView style={styles.scrollView}>
          <TextInput
            ref={textInputRef}
            style={[styles.textInput, { color: theme.text }]}
            placeholder="What's happening?"
            placeholderTextColor={theme.placeholder}
            multiline
            value={postText}
            onChangeText={setPostText}
          />

          {selectedMedia && (
            <View style={styles.mediaPreview}>
              {selectedMedia.type === 'gif' || selectedMedia.type?.startsWith('image') ? (
                <Image 
                  source={{ uri: selectedMedia.uri }} 
                  style={styles.mediaImage}
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
                <Text style={{ color: '#FF0000' }}>×</Text>
              </TouchableOpacity>
            </View>
          )}

          {createdPoll && (
            <View style={[styles.pollPreview, { backgroundColor: theme.card }]}>
              <Text style={[styles.pollQuestion, { color: theme.text }]}>
                {createdPoll.question}
              </Text>
              {createdPoll.options.map((opt, idx) => (
                <View 
                  key={idx}
                  style={[
                    styles.pollOptionPreview,
                    { 
                      borderColor: theme.border,
                      backgroundColor: createdPoll.type === 'mcq' && createdPoll.correctAnswer === idx ? 
                        'rgba(210, 189, 0, 0.2)' : 'transparent'
                    }
                  ]}
                >
                  <Text style={{ color: theme.text }}>{opt}</Text>
                </View>
              ))}
              <TouchableOpacity 
                style={styles.removePoll}
                onPress={() => setCreatedPoll(null)}
              >
                <Text style={{ color: '#FF0000' }}>Remove Poll</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Improved Bottom Toolbar */}
        <SafeAreaView
          edges={[]} // changed from ['bottom'] to [] to avoid extra bottom space
          style={[
            styles.bottomToolbarNatural, 
            {
              backgroundColor: theme.card,
              borderTopColor: theme.accent,
              borderTopWidth: 1,
              // removed paddingBottom logic
            }
          ]}
        >
          <View style={styles.mediaIconsNatural}>
            <TouchableOpacity 
              style={styles.mediaButtonNatural}
              onPress={handleMediaPress}
              activeOpacity={0.7}
            >
              <Image 
                source={require('../assets/camera_icon.png')} 
                style={[styles.mediaIconNatural, { tintColor: theme.accent }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mediaButtonNatural}
              onPress={handleGifPress}
              activeOpacity={0.7}
            >
              <Text style={[styles.mediaIconTextNatural, { color: theme.accent }]}>GIF</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mediaButtonNatural}
              onPress={handlePollPress}
              activeOpacity={0.7}
            >
              <Image 
                source={require('../assets/ic_outline-poll.png')} 
                style={[styles.mediaIconNatural, { tintColor: theme.accent }]}
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
          <View style={[styles.pollModal, { backgroundColor: theme.card }]}>
            <View style={styles.pollHeader}>
              <TouchableOpacity onPress={() => setIsPollModalVisible(false)}>
                <Text style={[styles.modalClose, { color: theme.accent }]}>×</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Create Poll</Text>
              <TouchableOpacity onPress={createPoll}>
                <Text style={[styles.createButton, { color: theme.accent }]}>Create</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.pollInput, 
                { 
                  backgroundColor: theme.inputBackground,
                  color: theme.text,
                  borderColor: theme.accent
                }
              ]}
              placeholder="Ask a question..."
              placeholderTextColor={theme.placeholder}
              value={pollQuestion}
              onChangeText={setPollQuestion}
            />

            <View style={styles.pollTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.pollTypeButton, 
                  { backgroundColor: theme.inputBackground },
                  pollType === 'poll' && { backgroundColor: theme.accent }
                ]}
                onPress={() => setPollType('poll')}
              >
                <Text style={[
                  styles.pollTypeText,
                  pollType === 'poll' ? { color: '#000' } : { color: theme.text }
                ]}>
                  Poll
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.pollTypeButton, 
                  { backgroundColor: theme.inputBackground },
                  pollType === 'mcq' && { backgroundColor: theme.accent }
                ]}
                onPress={() => setPollType('mcq')}
              >
                <Text style={[
                  styles.pollTypeText,
                  pollType === 'mcq' ? { color: '#000' } : { color: theme.text }
                ]}>
                  MCQ
                </Text>
              </TouchableOpacity>
            </View>

            {pollOptions.map((option, index) => (
              <View key={index} style={styles.optionContainer}>
                <TextInput
                  style={[
                    styles.optionInput, 
                    { 
                      backgroundColor: theme.inputBackground,
                      color: theme.text
                    }
                  ]}
                  placeholder={`Option ${index + 1}`}
                  placeholderTextColor={theme.placeholder}
                  value={option}
                  onChangeText={(text) => updatePollOption(index, text)}
                />
                {pollType === 'mcq' && (
                  <TouchableOpacity
                    style={[
                      styles.correctAnswerButton,
                      { borderColor: theme.accent },
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
                <Text style={[styles.addOptionText, { color: theme.accent }]}>
                  + Add option
                </Text>
              </TouchableOpacity>
            )}

            {pollType === 'mcq' && (
              <Text style={[styles.mcqHelper, { color: theme.placeholder }]}>
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
          <View style={[styles.gifModal, { backgroundColor: theme.card }]}>
            <View style={styles.pollHeader}>
              <TouchableOpacity onPress={() => setIsGifModalVisible(false)}>
                <Text style={[styles.modalClose, { color: theme.accent }]}>×</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Search GIFs</Text>
            </View>

            <View style={styles.gifSearchContainer}>
              <TextInput
                style={[
                  styles.gifSearchInput, 
                  { 
                    backgroundColor: theme.inputBackground,
                    color: theme.text,
                    borderColor: theme.accent
                  }
                ]}
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
                <Text style={[styles.loadingText, { color: theme.accent }]}>Loading GIFs...</Text>
              </View>
            ) : (
              <FlatList
                data={gifSearchQuery ? searchedGifs : trendingGifs}
                keyExtractor={(item) => item.id}
                renderItem={renderGifItem}
                numColumns={2}
                ListHeaderComponent={
                  !gifSearchQuery && trendingGifs.length > 0 ? (
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending GIFs</Text>
                  ) : null
                }
                ListEmptyComponent={
                  <View style={styles.noResultsContainer}>
                    <Text style={[styles.noResultsText, { color: theme.text }]}>
                      {gifSearchQuery ? 'No GIFs found' : 'No trending GIFs'}
                    </Text>
                    <Text style={[styles.noResultsSubtext, { color: theme.placeholder }]}>
                      {gifSearchQuery ? 'Try a different search' : 'Check back later'}
                    </Text>
                  </View>
                }
              />
            )}
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
    borderBottomWidth: 1,
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  headerButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  textInput: {
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  mediaPreview: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
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
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pollPreview: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(210, 189, 0, 0.5)',
  },
  pollQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  pollOptionPreview: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  removePoll: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  bottomToolbarNatural: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4, // no vertical padding
    borderTopWidth: 1,
    paddingStart:16,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    // paddingBottom: 0, // ensure no extra space
  },
  mediaIconsNatural: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  mediaButtonNatural: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaIconNatural: {
    width: 26,
    height: 26,
  },
  mediaIconTextNatural: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  characterCountNaturalContainer: {
    flex: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  characterCountNatural: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pollModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  pollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalClose: {
    fontSize: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pollInput: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
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
  },
  pollTypeText: {
    fontWeight: 'bold',
  },
  addOption: {
    alignSelf: 'center',
    marginVertical: 12,
  },
  addOptionText: {
    fontWeight: 'bold',
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
  },
  correctAnswerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mcqHelper: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 8,
  },
  gifModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
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
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default CreatPostScreen;