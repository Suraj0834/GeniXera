import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import CreatPostScreen from './screens/CreatPostScreen';
import ProfileScreen from './screens/ProfileScreen';
import MarketPlaceScreen from './screens/MarketPlaceScreen';
import ExploreScreen from './screens/ExploreScreen';
import RewardsScreen from './screens/RewardsScreen';
import SettingScreen from './screens/SettingScreen';
import { ThemeProvider } from './theme/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="CreatPost" component={CreatPostScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="MarketPlace" component={MarketPlaceScreen} />
            <Stack.Screen name="Explore" component={ExploreScreen} />
            <Stack.Screen name="Rewards" component={RewardsScreen} />
            <Stack.Screen name="Setting" component={SettingScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}