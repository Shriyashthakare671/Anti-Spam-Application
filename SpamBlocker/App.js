import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AntiSpoofingScreen from './screens/AntiSpoofingScreen';
import CallBlockScreen from './screens/CallBlockScreen';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingScreen';
import SpamDetectionScreen from './screens/SpamDetectionScreen';
import WhitelistSettingScreen from './screens/WhitelistSettingScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import PushNotification from 'react-native-push-notification';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack() {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [300, -300],
  });

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: '#fff',
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Animated.Text style={[styles.headerText, { transform: [{ translateX }] }]}>
                Know who's calling – Protect yourself from fake identities.
              </Animated.Text>
            </View>
          ),
        }} 
      />
      <Stack.Screen name="AntiSpoofing" component={AntiSpoofingScreen} />
      <Stack.Screen name="SpamDetection" component={SpamDetectionScreen} />
      <Stack.Screen name="CallBlock" component={CallBlockScreen} />
      <Stack.Screen name="WhitelistSetting" component={WhitelistSettingScreen} />
    </Stack.Navigator>
  );
}
// PushNotification.createChannel(
//   {
//       channelId: 'totp-channel', // Unique ID
//       channelName: 'TOTP Notifications',
//       importance: 4, // High importance
//       vibrate: true,
//   },
//   (created) => console.log(`Notification Channel Created: ${created}`)
// );

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default: not logged in

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {isLoggedIn ? (
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomeStack} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
          </Drawer.Navigator>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#ff0000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default App;
