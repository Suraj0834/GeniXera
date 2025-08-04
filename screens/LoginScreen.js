import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, useColorScheme, Linking } from 'react-native';
import React from 'react';

const LoginScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';
  const enterTextColor = colorScheme === 'dark' ? '#fff' : '#000';

  const handleLearnMore = () => {
    Linking.openURL('https://metamask.io/en-GB');
  };

  const handleConnectLogin = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}> 
      <View style={styles.logoContainer}>
        <Image source={require('../assets/spalshicon.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.middleContainer}>
        <Text style={styles.slogan}>Create. Grow. Earn. Own.</Text>
      </View>
      <View style={styles.bottomContent}>
        <Text style={[styles.enter, { color: enterTextColor }]}>Enter to GeniXera</Text>
        <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleConnectLogin}>
          <Image source={require('../assets/wallet.png')} style={{width: 20, height: 20, marginRight: 8}} resizeMode="contain" />
          <Text style={styles.buttonText}>Connect / login</Text>
        </TouchableOpacity>
        <Text style={styles.recommended}>Recommended Web3 Wallet</Text>
        <Text style={styles.learnMore} onPress={handleLearnMore}>learn more</Text>
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
  },
  slogan: {
    color: '#D2BD00',
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
    backgroundColor: '#D2BD00',
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
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  recommended: {
    color: 'gray',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  learnMore: {
    color: '#D2BD00',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 2,
  },
});

export default LoginScreen;