import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useAppKit } from '@reown/appkit-ethers5-react-native';

const ProfileScreen = () => {
  const { theme } = useTheme();
  const { address, isConnected } = useAppKit();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={styles.avatarContainer}>
        <Image
          source={require('../assets/Profile.png')}
          style={[styles.avatar, { backgroundColor: theme.card }]}
        />
        <Text style={[styles.username, { color: theme.text }]}> 
          Username
        </Text>
        {isConnected && address && (
          <Text style={{ color: theme.accent, marginBottom: 8, fontSize: 14 }}>
            Wallet: {address}
          </Text>
        )}
        <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.button }]}> 
          <Text style={[styles.editButtonText, { color: theme.buttonText }]}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.infoContainer, { backgroundColor: theme.card }]}> 
        <Text style={[styles.infoLabel, { color: theme.text }]}>Bio:</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>This is a short bio. You can update it later.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    backgroundColor: '#eee',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#D2BD00',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '90%',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  infoLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoText: {
    color: '#555',
  },
});

export default ProfileScreen;