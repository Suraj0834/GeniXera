import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, TouchableOpacity, Image, Linking } from 'react-native';
import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';

const LoginScreen = ({ navigation }) => {
  const { mode, theme, toggleTheme } = useTheme();

  const handleLearnMore = () => {
    Linking.openURL('https://metamask.io/en-GB');
  };

  const handleConnectLogin = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}> 
      {/* Theme Toggle Button */}
      <View style={styles.themeToggleContainer}>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleButton}>
          <Icon name={mode === 'dark' ? 'sun' : 'moon'} size={24} color={theme.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/spalshicon.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.middleContainer}>
        <Text style={[styles.slogan, { color: theme.accent }]}>Create. Grow. Earn. Own.</Text>
      </View>
      <View style={styles.bottomContent}>
        <Text style={[styles.enter, { color: theme.text }]}>Enter to GeniXera</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.button }]} activeOpacity={0.85} onPress={handleConnectLogin}>
          <Text style={styles.walletIcon}>💳</Text>
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Connect / login</Text>
        </TouchableOpacity>
        <Text style={[styles.recommended, { color: theme.placeholder }]}>Recommended Web3 Wallet</Text>
        <Text style={[styles.learnMore, { color: theme.accent }]} onPress={handleLearnMore}>learn more</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 0,
    right: 16,
    zIndex: 10,
    marginTop: 24, // Added marginTop for spacing from status bar
  },
  themeToggleButton: {
    backgroundColor: 'rgba(210, 189, 0, 0.12)',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  slogan: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    marginTop: 0,
  },
  bottomContent: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 36,
  },
  enter: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    marginStart: 130,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 30,
    height: 40,
    width: 310,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#D2BD00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  walletIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  recommended: {
    fontSize: 13,
    marginBottom: 2,
  },
  learnMore: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default LoginScreen;