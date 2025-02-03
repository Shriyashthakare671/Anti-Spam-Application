import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../utils/responsive';
import axios from 'axios';
import HomeScreen from './HomeScreen';

const LoginScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [token, setToken] = useState('');

    // Hardcoded login data
    // const hardcodedPhoneNumber = '1234567890';
    // const hardcodedToken = '123456'; // Example token

    const handleLogin = async () => {
        // Check hardcoded credentials
        // if (phoneNumber === hardcodedPhoneNumber && token === hardcodedToken) {
        //     navigation.navigate('Home'); // Navigate to Home on successful login
        // } else {
        //     Alert.alert('Error', 'Invalid login credentials');
        // }
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/logo.png')} // Ensure this path is correct
                    style={styles.logo}
                    resizeMode="contain" // Ensure the logo maintains its aspect ratio
                />
            </View>

            {/* Input Fields */}
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="TOTP Token"
                value={token}
                onChangeText={setToken}
                secureTextEntry
            />

            {/* Login Button */}
            <View style={styles.buttonContainer}>
                <Button title="Login" onPress={handleLogin} />
            </View>

            {/* Signup Link */}
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupText}>Go to Signup</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: responsiveWidth(6),
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: responsiveHeight(4), // Space between logo and inputs
        backgroundColor: 'transparent', // Ensure the container background is transparent
    },
    logo: {
        width: responsiveWidth(40), // Adjust logo width
        height: responsiveHeight(20), // Adjust logo height
        backgroundColor: 'transparent', // Ensure the image itself has no background
    },
    input: {
        height: responsiveHeight(6),
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(3),
        fontSize: responsiveFontSize(10),
        borderRadius: 10,
    },
    buttonContainer: {
        marginVertical: responsiveHeight(2),
    },
    signupText: {
        textAlign: 'center',
        marginTop: responsiveHeight(3),
        fontSize: responsiveFontSize(10),
        color: '#007BFF',
    },
});

export default LoginScreen;
