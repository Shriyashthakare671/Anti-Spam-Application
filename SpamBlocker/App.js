import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, StyleSheet, Alert, Share } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Import Screens
import AntiSpoofingScreen from './screens/AntiSpoofingScreen';
import CallBlockScreen from './screens/CallBlockScreen';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingScreen';
import SpamDetectionScreen from './screens/SpamDetectionScreen';
import WhitelistSettingScreen from './screens/WhitelistSettingScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import UserProfileScreen from './screens/UserProfileScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// 🚀 Home Stack with Animated Text
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
    outputRange: [200, -200],
  });

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerStyle: { backgroundColor: '#007AFF' },
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
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
}

// 🚀 Auth Stack for Login & Signup
function AuthStack({ setIsLoggedIn }) {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        options={{ headerShown: false }}
      >
        {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// 🚀 Main App Component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ Default is logged out

  // ✅ Handle Logout
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => setIsLoggedIn(false) } // ✅ Logout user properly
    ]);
  };

  // ✅ Handle Share App
  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing app! Download now from Play Store / App Store.'
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  // ✅ Handle Rate Us
  const handleRateUs = () => {
    Alert.alert('Rate Us', 'Thank you for using our app!');
  };

  // 🚀 Custom Drawer Content
  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label="Home"
          icon={({ color, size }) => <MaterialIcons name="home" color={color} size={size} />}
          onPress={() => props.navigation.navigate('Home')}
        />
        <DrawerItem
          label="User Profile"
          icon={({ color, size }) => <MaterialIcons name="person" color={color} size={size} />}
          onPress={() => props.navigation.navigate('UserProfile')}
        />
        <DrawerItem
          label="Share App"
          icon={({ color, size }) => <MaterialIcons name="share" color={color} size={size} />}
          onPress={handleShareApp}
        />
        <DrawerItem
          label="Rate Us"
          icon={({ color, size }) => <MaterialIcons name="star" color={color} size={size} />}
          onPress={handleRateUs}
        />
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => <MaterialIcons name="logout" color={color} size={size} />}
          onPress={handleLogout}
        />
      </DrawerContentScrollView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {isLoggedIn ? (
          <Drawer.Navigator
            initialRouteName="HomeDrawer"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen
              name="HomeDrawer"
              component={HomeStack}
              options={{
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="home" size={size} color={color} />
                )
              }}
            />
            <Drawer.Screen
              name="UserProfile"
              component={UserProfileScreen}
              options={{
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="person" size={size} color={color} />
                )
              }}
            />
            <Drawer.Screen
              name="Rate Us"
              component={SettingsScreen}
              options={{
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="star-rate" size={size} color={color} />
                )
              }}
              listeners={{ focus: handleRateUs }}
            />
            <Drawer.Screen
              name="Share App"
              component={SettingsScreen}
              options={{
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="share" size={size} color={color} />
                )
              }}
              listeners={{ focus: handleShareApp }}
            />
            <Drawer.Screen
              name="Logout"
              component={SettingsScreen}
              options={{
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="logout" size={size} color={color} />
                )
              }}
              listeners={{ focus: handleLogout }}
            />
          </Drawer.Navigator>
        ) : (
          <AuthStack setIsLoggedIn={setIsLoggedIn} />
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

// 🚀 Styles
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default App;
