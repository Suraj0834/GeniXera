import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const SettingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Setting Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFEF3',
  },
  text: {
    fontSize: 18,
    color: '#D2BD00',
  },
});

export default SettingScreen; 