import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, FlatList, Alert, PermissionsAndroid, Platform } from 'react-native';
import axios from 'axios';
import RNCallKeep from 'react-native-callkeep';

// ✅ Set API URL (Update with your backend IP)
const API_URL = 'http://192.168.1.108:3000/api/calls/logs';

// const options = {
//     ios: {
//         appName: 'AntiSpoofing',
//     },
//     android: {
//         alertTitle: 'Permissions Required',
//         alertDescription: 'This app needs access to detect incoming calls.',
//         cancelButton: 'Cancel',
//         okButton: 'OK',
//         additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE]
//     }
// };

const AntiSpoofingScreen = () => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [callerInfo, setCallerInfo] = useState(null);
    const [logs, setLogs] = useState([]); // ✅ Fix: Initialize logs state

    // ✅ Setup CallKeep for incoming call detection
    useEffect(() => {
        setupCallKeep();
    }, []);

    const setupCallKeep = async () => {
        try {
            await RNCallKeep.setup(options);
            await RNCallKeep.setAvailable(true);

            RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
                console.log(`📞 Incoming Call Detected: ${callUUID}`);
                checkCallerStatus(callUUID);
            });

        } catch (error) {
            console.error('❌ CallKeep Error:', error);
        }
    };

    // ✅ Fetch Call Logs on Mount
    useEffect(() => {
        fetchCallLogs();
    }, []);

    const fetchCallLogs = async () => {
        try {
            const response = await axios.get(API_URL);
            setLogs(response.data);
        } catch (error) {
            console.error('❌ Error fetching call logs:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Check Caller Status via API
    const checkCallerStatus = async (phoneNumber) => {
        try {
            const response = await axios.post('http://192.168.1.108:3000/api/calls/check', { phone: phoneNumber });
            const callerStatus = response.data.status;

            setCallerInfo({ phone: phoneNumber, status: callerStatus });

            Alert.alert(
                'Incoming Call',
                `📞 ${phoneNumber} - ${callerStatus.toUpperCase()}`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('❌ Error fetching caller status:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Anti-Spoofing System</Text>

            {/* ✅ Input for Checking Numbers */}
            <TextInput
                style={styles.input}
                placeholder="Enter Phone Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />
            <Button title="Check Spoofing" onPress={() => checkCallerStatus(phone)} />

            {/* ✅ Display Caller Status */}
            {callerInfo && (
                <Text style={[styles.status, getStatusStyle(callerInfo.status)]}>
                    {callerInfo.phone} - {callerInfo.status.toUpperCase()}
                </Text>
            )}

            {/* ✅ Show Call Logs */}
            <Text style={styles.subtitle}>Call Logs</Text>
            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <FlatList
                    data={logs}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.logItem, getStatusStyle(item.status)]}>
                            <Text style={styles.phone}>{item.phone}</Text>
                            <Text style={styles.status}>{item.status.toUpperCase()}</Text>
                            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

// ✅ Function to style call categories
const getStatusStyle = (status) => {
    switch (status) {
        case 'white': return { color: 'green' };
        case 'black': return { color: 'red' };
        default: return { color: 'gray' };
    }
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 8, width: '90%', marginBottom: 12 },
    status: { fontSize: 18, marginTop: 10, fontWeight: 'bold' },
    logItem: { padding: 15, marginVertical: 5, borderRadius: 10 },
    phone: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    timestamp: { fontSize: 14, color: 'white' }
});

export default AntiSpoofingScreen;
