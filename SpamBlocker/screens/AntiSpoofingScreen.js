import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, Alert, PermissionsAndroid } from 'react-native';
import axios from 'axios';
import RNCallKeep from 'react-native-callkeep';
import StatusPopup from '../StatusPopup';

const API_URL = 'http://192.168.1.108:3000/api/calls/logs';

const options = {
    ios: { appName: 'AntiSpoofing' },
    android: {
        alertTitle: 'Permissions Required',
        alertDescription: 'This app needs access to detect incoming calls.',
        cancelButton: 'Cancel',
        okButton: 'OK',
        additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE]
    }
};

const AntiSpoofingScreen = () => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupData, setPopupData] = useState({ phone: '', status: '' });

    // ✅ Setup CallKeep for incoming call detection
    useEffect(() => {
        setupCallKeep();
    }, []);

    const setupCallKeep = async () => {
        try {
            // await RNCallKeep.setup(options);
            // await RNCallKeep.setAvailable(true);

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

    // ✅ Check Caller Status via API and Show Pop-up
    const checkCallerStatus = async (phoneNumber) => {
        try {
            const response = await axios.post('http://192.168.1.108:3000/api/calls/check', { phone: phoneNumber });
            const callerStatus = response.data.status;

            // ✅ Show the pop-up with the detected status color
            setPopupData({ phone: phoneNumber, status: callerStatus });
            setPopupVisible(true); 

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

            {/* ✅ Pop-up for Call Status (Inserted Here) */}
            <StatusPopup
                visible={popupVisible}
                phone={popupData.phone}
                status={popupData.status}
                onClose={() => setPopupVisible(false)}
            />
        </View>
    );
};

// ✅ Function to style call categories
const getStatusStyle = (status) => {
    switch (status) {
        case 'white': return { backgroundColor: 'white', color: 'white' };
        case 'black': return { backgroundColor: 'red', color: 'white' };
        default: return { backgroundColor: 'gray', color: 'white' };
    }
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    input: { height: 45, borderColor: '#ccc', borderWidth: 1, paddingHorizontal: 12, width: '90%', borderRadius: 8, backgroundColor: '#fff' },
    status: { fontSize: 18, marginTop: 10, fontWeight: 'bold' },
    logItem: { padding: 15, marginVertical: 5, borderRadius: 10, backgroundColor: '#222', width: '95%', alignSelf: 'center' },
    phone: { fontSize: 18, fontWeight: 'bold', color: 'black', textAlign: 'center' },
    timestamp: { fontSize: 14, color: 'black', textAlign: 'center' }
});

export default AntiSpoofingScreen;
