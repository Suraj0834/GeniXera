import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const colorScheme = useColorScheme();
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(logoScale, {
      toValue: 1.2,
      duration: 1200,
      useNativeDriver: true,
    }).start(() => {
      // After animation, check for token
      setTimeout(async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.replace('Login');
        } else {
          navigation.replace('Home'); // Or your main screen
        }
      }, 400); // Small delay for smoothness
    });
  }, []);

  const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';

  return (
    <View style={[styles.container, { backgroundColor }]}> 
      <Animated.Image
        source={require('../assets/spalshicon.png')}
        style={[styles.logo, { transform: [{ scale: logoScale }] }]}
        resizeMode="contain"
      />
      <Text style={styles.motto}>Create. Grow. Earn. Own.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  motto: {
    color: '#D2BD00',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SplashScreen;