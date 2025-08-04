import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Image, Linking, useColorScheme } from 'react-native';
import React, { useState } from 'react';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';

  const handleTermsPress = () => {
    // Add your terms URL here
    Linking.openURL('https://your-terms-url.com');
  };

  const handlePrivacyPress = () => {
    // Add your privacy policy URL here
    Linking.openURL('https://your-privacy-url.com');
  };

  const handleSignUp = () => {
    // Handle sign up logic here
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/spalshicon.png')} style={styles.logo} resizeMode="contain" />
      </View>
      
      <View style={styles.middleContainer}>
        <Text style={[styles.title, { color: '#D2BD00' }]}>Sign Up</Text>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: '#333' }]}>Username</Text>
          <TextInput
            style={[styles.input, { color: '#000' }]}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: '#333' }]}>Password</Text>
          <TextInput
            style={[styles.input, { color: '#000' }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#666"
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.bottomContent}>
        <View style={styles.signUpButtonContainer}>
          <TouchableOpacity style={styles.signUpButton} activeOpacity={0.85} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.legalContainer}>
          <Text style={[styles.legalText, { color: '#333' }]}>
            By Signing up you agree to our{' '}
            <Text style={styles.linkText} onPress={handleTermsPress}>
              Terms
            </Text>
            {' '}and{' '}
            <Text style={styles.linkText} onPress={handlePrivacyPress}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: 'center',
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal:64
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'left',
    marginStart: 30,
    alignSelf: 'flex-start',
   
  },
  inputContainer: {
    marginBottom: 24,
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'left',
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  signUpButton: {
    backgroundColor: '#D2BD00',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 310,
    height: 40,
    shadowColor: '#D2BD00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  signUpButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
  bottomContent: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 36,
  },
  legalContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  legalText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    color: '#D2BD00',
    fontWeight: '300',
  },
  signUpButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
});

export default SignUpScreen;