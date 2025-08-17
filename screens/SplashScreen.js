import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useAppKit } from '@reown/appkit-ethers5-react-native';

const SplashScreen = () => {
  const { theme } = useTheme();
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(logoScale, {
      toValue: 1.2,
      duration: 1200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          navigation.replace('Home');
        } else {
          navigation.replace('Login');
        }
      }, 400);
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Animated.Image
        source={require('../assets/spalshicon.png')}
        style={[styles.logo, { transform: [{ scale: logoScale }], backgroundColor: theme.card }]}
        resizeMode="contain"
      />
      <Text style={[styles.motto, { color: theme.accent }]}>Create. Grow. Earn. Own.</Text>
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