import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView
} from 'react-native';
import axios from 'axios';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from '../utils/responsive';


const BASE_URL = 'http://192.168.1.108:3000'; // ✅ Replace with your actual backend URL

const LoginScreen = ({ navigation }) => {
    const [phone, setPhone] = useState('');
    const [totp, setTotp] = useState('');
    const [showGetCode, setShowGetCode] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);

    // ✅ Check if user exists before allowing login
    const checkUserExists = async () => {
        if (!phone) {  // ✅ Use correct state variable
            Alert.alert('Error', 'Please enter your phone number');
            return;
        }
        try {
            console.log('📤 Checking User:', phone); // ✅ Debugging log
            const response = await axios.post(`${BASE_URL}/api/users/check`, { phone: phone });
    
            console.log('✅ API Response:', response.data); // ✅ Debugging log
    
            if (response.data.exists) {
                setShowGetCode(true);  // ✅ Show "Get Code" Button
            } else {
                Alert.alert('User Not Found', 'No account found with this phone number.');
            }
        } catch (error) {
            console.error('❌ API Error:', error?.response?.data || error.message);
            Alert.alert('Error', 'Server error, try again later.');
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
            Alert.alert('Error', 'Failed to generate a new TOTP token');
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
                navigation.replace('Home'); // ✅ Navigate to Home on success
            } else if (response.data.requiresTotp) {
                Alert.alert('TOTP Required', 'Click "Get Code" to generate a new token.');
            } else {
                Alert.alert('Error', 'Invalid TOTP');
            }
        }catch (error) {
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

                {!showGetCode ? (
                    <TouchableOpacity style={styles.button} onPress={checkUserExists}>
                        <Text style={styles.buttonText}>Check User</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        {!isCodeSent ? (
                            <TouchableOpacity style={styles.button} onPress={getNewTOTP}>
                                <Text style={styles.buttonText}>Get Code</Text>
                            </TouchableOpacity>
                        ) : (
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
        marginTop: responsiveHeight(15),
        marginBottom: responsiveHeight(3),
    },
    input: {
        width: '65%',
        height: responsiveHeight(6),
        alignSelf: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(4),
        fontSize: responsiveFontSize(10), // ✅ Fixed font size
        borderRadius: 10,
        backgroundColor: 'white',
    },
    button: {
        width: '60%',
        backgroundColor: '#007AFF',
        paddingVertical: responsiveHeight(1),
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
        fontSize: 10,
        fontWeight: 'bold',
    }
});

export default LoginScreen;
