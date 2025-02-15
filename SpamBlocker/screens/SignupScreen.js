import React, { useState } from 'react';
import PushNotification from 'react-native-push-notification'; 
import { View, TextInput,button, Alert, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from '../utils/responsive';
import LoginScreen from './LoginScreen';

const SignupScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [phone, setphone] = useState('');
    const [qrData, setQrData] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSignup = async () => {
        if (!username || !phone) {
            Alert.alert('Error', 'Username and Phone Number are required');
            return;
        }

        try {
            const response = await axios.post('http://192.168.1.108:3000/api/users/register', {
                username,
                phone
            });

            console.log('API Response:', response.data);

            if (response.data.secret && response.data.totpToken) {
                Alert.alert('Success', `Registration Successful!\nYour TOTP Token: ${response.data.totpToken}`);


                // ✅ Store QR Code & Secret (Limit QR Data)
                setQrData(response.data.qrCode?.substring(0, 500)); // Ensures QR data is not too big
                setIsRegistered(true);

                // // ✅ Send Push Notification with TOTP Token
                // PushNotification.localNotification({
                //     channelId: 'totp-channel',
                //     title: 'Your TOTP Code',
                //     message: TOTP: ${response.data.totpToken},  // ✅ Corrected message to show actual TOTP token
                //     playSound: true,
                //     soundName: 'default',
                //     timeoutAfter: 60000, // Notification disappears after 1 min
                // });

                // ✅ Delay Navigation to Login Screen for 1 Minute
                setTimeout(() => {
                    navigation.navigate('LoginScreen'); // ✅ Use replace to prevent going back
                }, 60000); // 60000ms = 1 minute
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
                        onChangeText={setphone}
                        keyboardType="phone-pad"
                    />
                    {/* <Button title="Signup" onPress={handleSignup} /> */}
                    <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                        <Text style={styles.buttonText}>Signup</Text>
                    </TouchableOpacity>



                </>
            ) : (
                <View style={styles.qrContainer}>
                    <Text style={styles.text}>Scan this QR Code to complete registration:</Text>
                    <View style={styles.qrWrapper}>
                        <QRCode value={qrData} size={responsiveWidth(10)} />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginScreen')}>
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
        backgroundColor: '#F8F9FA', // ✅ Light background for contrast
        paddingHorizontal: responsiveWidth(2),
    },
    text: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: responsiveHeight(1),
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
        marginBottom: responsiveHeight(4),
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