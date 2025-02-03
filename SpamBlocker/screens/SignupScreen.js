import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ActivityIndicator, Text, Image } from 'react-native';
import axios from 'axios';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../utils/responsive';

const SignupScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState(''); // Added state for username
    const [token, setToken] = useState(''); // Added state for token
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!username || !phoneNumber || !token) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        // Basic phone number validation (e.g., length check)
        if (phoneNumber.length < 10) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://your-backend-url/auth/generate', {
                username,
                phoneNumber,
                token, // Send the token with the signup request
            });
            if (response.data.secret) {
                Alert.alert('Success', `Your secret is: ${response.data.secret}`);
                navigation.navigate('Login'); // Navigate to Login after successful signup
            } else {
                Alert.alert('Error', 'Something went wrong');
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/logo.png')} // Ensure this path is correct
                    style={styles.logo}
                    resizeMode="contain" // Ensure the logo maintains its aspect ratio
                />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
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
            <Button title="Signup" onPress={handleSignup} disabled={loading} />
            {loading && <ActivityIndicator size="small" color="#0000ff" style={styles.loader} />}
            <View style={styles.navigationContainer}>
                <Button title="Go to Login" onPress={() => navigation.navigate('Login')} disabled={loading} />
            </View>
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
        height: responsiveHeight(6), // Adjust input height for better spacing
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(3),
        fontSize: responsiveFontSize(10), // Adjust font size for better readability
        borderRadius: 8,
    },
    loader: {
        marginVertical: responsiveHeight(2), // Adds space above the loader
    },
    navigationContainer: {
        marginTop: responsiveHeight(2),
    },
});

export default SignupScreen;
