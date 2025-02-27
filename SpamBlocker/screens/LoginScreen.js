import axios from 'axios';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../utils/responsive';

const BASE_URL = 'http://192.168.1.108:3000'; // ✅ Replace with your actual backend URL

const LoginScreen = ({ navigation, setIsLoggedIn }) => {
    const [phone, setPhone] = useState('');
    const [totp, setTotp] = useState('');
    const [showGetCode, setShowGetCode] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [userStatus, setUserStatus] = useState('');

    // ✅ Check if user exists
    const checkUserExists = async () => {
        if (!phone.trim()) {
            Alert.alert('Error', 'Please enter your phone number');
            return;
        }

        try {
            console.log('📤 Checking User:', phone);
            const response = await axios.post(`${BASE_URL}/api/users/check`, { phone });

            console.log('✅ API Response:', response.data);

            if (response.data.exists) {
                setUserStatus('✅ User already exists');
                setShowGetCode(true);
            } else {
                setUserStatus('❌ User not found. Please register.');
                setShowGetCode(false);
            }
        } catch (error) {
            // console.error('❌ API Error:', error?.response?.data || error.message);
            setUserStatus('⚠️ Error checking user. Try again later.');
        }
    };


    // ✅ Get a new TOTP token for existing users
    const getNewTOTP = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/users/generate-totp`, { phone });
            if (response.data.totpToken) {
                Alert.alert('New TOTP Code', `Your new TOTP: ${response.data.totpToken}`);
                setIsCodeSent(true);
            }
        } catch (error) {
            console.error('❌ Get TOTP Error:', error?.response?.data || error.message);
            Alert.alert('Error', 'Failed to generate a new TOTP token.');
        }
    };

    // ✅ Handle Login
    const handleLogin = async () => {
        if (!phone || !totp) {
            Alert.alert('Error', 'Phone Number and TOTP are required');
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/api/users/login`, { phone, totp });

            if (response.data.verified) {
                console.log('✅ Login Successful:', phone);
                setIsLoggedIn(true);
                console.log('Navigating to:', Object.keys(navigation.getState().routes));
                navigation.navigate('HomeDrawer'); // ✅ Navigate to Home
            } else {
                Alert.alert('Error', 'Invalid or Expired TOTP');
            }
        } catch (error) {
            console.error('❌ Login Error:', error?.response?.data || error.message);
            Alert.alert('Error', error?.response?.data?.error || 'Server Error, Try again later.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />

                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />

                <TouchableOpacity style={styles.button} onPress={checkUserExists}>
                    <Text style={styles.buttonText}>Check User</Text>
                </TouchableOpacity>

                {/* ✅ Display status only after clicking "Check User" */}
                {userStatus !== '' && (
                    <Text style={styles.statusText}>{userStatus}</Text>
                )}

                {showGetCode && !isCodeSent && (
                    <TouchableOpacity style={styles.button} onPress={getNewTOTP}>
                        <Text style={styles.buttonText}>Get Code</Text>
                    </TouchableOpacity>
                )}

                {isCodeSent && (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter TOTP"
                            value={totp}
                            onChangeText={setTotp}
                            keyboardType="numeric"
                        />

                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </>
                )}
                <Text style={styles.signupText}>Don't have an account?</Text>
                <TouchableOpacity style={[styles.button, styles.signupButton]} onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// ✅ Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveHeight(5),
        paddingBottom: responsiveHeight(25),
    },
    logo: {
        width: responsiveWidth(30),
        height: responsiveHeight(15),
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: responsiveHeight(10),
        marginBottom: responsiveHeight(3),
    },
    input: {
        width: '75%',
        height: responsiveHeight(6),
        alignSelf: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(4),
        fontSize: responsiveFontSize(8), // ✅ Fixed font size
        borderRadius: 10,
        backgroundColor: 'white',
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 10, // Adds spacing after button
    },
    button: {
        width: '70%',
        backgroundColor: '#007AFF',
        paddingVertical: responsiveHeight(2),
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: responsiveHeight(1),
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    signupButton: {
        backgroundColor: '#4CAF50',
        fontWeight: 'bold',
    },
    buttonText: {
        color: 'white',
        fontSize: responsiveFontSize(8),
        fontWeight: 'bold',
    },
    signupText: {
        marginTop: responsiveHeight(2),
        fontSize: responsiveFontSize(8),
        color: '#333',
    }
});

export default LoginScreen;
