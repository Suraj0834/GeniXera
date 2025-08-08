import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Linking, Image, SafeAreaView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const SignUpScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleTermsPress = () => {
    Linking.openURL('https://example.com/terms');
  };
  const handlePrivacyPress = () => {
    Linking.openURL('https://example.com/privacy');
  };
  const handleSignUp = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={styles.logoContainer}>
        <Image source={require('../assets/spalshicon.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.middleContainer}>
        <Text style={[styles.title, { color: theme.text }]}>Sign Up</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
          placeholder="Username"
          placeholderTextColor={theme.placeholder}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
          placeholder="Password"
          placeholderTextColor={theme.placeholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={[styles.signUpButton, { backgroundColor: theme.button }]} onPress={handleSignUp}>
          <Text style={[styles.signUpButtonText, { color: theme.buttonText }]}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.legalContainer}>
          <Text style={[styles.legalText, { color: theme.placeholder }]}>By signing up, you agree to our </Text>
          <Text style={[styles.legalLink, { color: theme.accent }]} onPress={handleTermsPress}>Terms</Text>
          <Text style={[styles.legalText, { color: theme.placeholder }]}> and </Text>
          <Text style={[styles.legalLink, { color: theme.accent }]} onPress={handlePrivacyPress}>Privacy Policy</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 8,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: 'center',
  },
  middleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: 310,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  signUpButton: {
    width: 310,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#D2BD00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  legalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  legalText: {
    fontSize: 13,
  },
  legalLink: {
    fontSize: 13,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;