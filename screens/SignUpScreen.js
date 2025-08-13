import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/spalshicon.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.middleContainer}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.accent }]}>Sign Up</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Username</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#dad6b0', borderColor: theme.inputBorder, color: theme.text }]}
            placeholderTextColor={theme.placeholder}
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Password</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#dad6b0', borderColor: theme.inputBorder, color: theme.text }]}
            placeholderTextColor={theme.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={[styles.signUpButton, { backgroundColor: theme.button }]} onPress={handleSignUp}>
          <Text style={[styles.signUpButtonText, { color: theme.buttonText }]}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.legalContainer}>
          <Text style={[styles.legalText, { color: theme.placeholder }]}>By signing up, you agree to our </Text>
          <Text style={[styles.legalLink, { color: theme.accent }]} onPress={handleTermsPress}>
            Terms
          </Text>
          <Text style={[styles.legalText, { color: theme.placeholder }]}> and </Text>
          <Text style={[styles.legalLink, { color: theme.accent }]} onPress={handlePrivacyPress}>
            Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  logo: {
    width: 40,
    height: 40,
    tintColor: '#D2BD00',
  },
  middleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 15,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  titleContainer: {
    width: '100%',
    paddingLeft: 78,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: 310,
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    width: 310,
    height: 55,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  signUpButton: {
    width: 310,
    height: 40,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  legalContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
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