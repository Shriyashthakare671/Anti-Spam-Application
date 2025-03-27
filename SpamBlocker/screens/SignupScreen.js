import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../utils/responsive';

const SignupScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [qrData, setQrData] = useState('');
    const [totpToken, setTotpToken] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSignup = async () => {
        if (!username || !phone || !password || !confirmPassword) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            console.log('📤 Sending Request to Backend:', { username, phone, password });

            const response = await axios.post('http://192.168.1.108:3000/api/users/register', {
                username,
                phone,
                password
            });

            console.log('API Response:', response.data);

            if (response.data.secret && response.data.totpToken) {
                const seedRecord = JSON.stringify({
                    username,
                    phone,
                    secret: response.data.secret,
                    totpToken: response.data.totpToken
                });

                setQrData(seedRecord);
                setTotpToken(response.data.totpToken);
                setIsRegistered(true);

                // ✅ Store Seed Record in Local Storage
                await AsyncStorage.setItem('seedRecord', seedRecord);

                Alert.alert(
                    'Success',
                    'Signup Successful!\nYour TOTP Token Auto Fetch BY QR Code.',
                );

                setTimeout(() => {
                    navigation.navigate('Login');
                }, 5000);
            } else {
                Alert.alert('Error', response.data.message || 'Registration Failed');
            }
        } catch (error) {
            console.error('Registration Error:', error?.response?.data || error.message);
            Alert.alert('Error', error?.response?.data?.message || 'Server Error, Try again later.');
        }
    };

    return (
        <View style={styles.container}>
            {!isRegistered ? (
                <>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../assets/logo.png')} style={styles.logo} />
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
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                    
                    <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                        <Text style={styles.buttonText}>Signup</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <View style={styles.qrContainer}>
                    <Text style={styles.text}>Your Seed Record in QR Code:</Text>
                    <View style={styles.qrWrapper}>
                        <QRCode value={qrData} size={200} />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.replace('LoginScreen')}>
                        <Text style={styles.buttonText}>Proceed to Login</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: responsiveWidth(6),
    },
    logo: {
        width: responsiveWidth(30),
        height: responsiveHeight(15),
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: responsiveHeight(3),
    },
    input: {
        width: '70%',
        height: responsiveHeight(5),
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(3),
        fontSize: responsiveFontSize(10),
        borderRadius: 10,
    },
    qrContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA', 
        paddingHorizontal: responsiveWidth(2),
    },
    text: {
        fontSize: responsiveFontSize(8),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    totpText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
        marginVertical: 10,
    },
    qrWrapper: {
        backgroundColor: 'white', // ✅ Adds contrast
        padding: responsiveWidth(4),
        borderRadius: 10,
        elevation: 5, // ✅ Adds shadow for Android
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        marginBottom: responsiveHeight(2),
    },
    signupButton: {
        width: '60%',
        backgroundColor: '#4CAF50',  // ✅ Elegant green color for signup
        paddingVertical: responsiveHeight(1),
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: responsiveHeight(1),
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,  // ✅ Adds shadow for Android
    },
    button: {
        width: '80%',
        backgroundColor: '#007AFF',  // ✅ Attractive blue
        paddingVertical: responsiveHeight(2),
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',  // ✅ Makes text look premium
        letterSpacing: 1.2,  // ✅ Spacing for a clean look
    }
});

export default SignupScreen;