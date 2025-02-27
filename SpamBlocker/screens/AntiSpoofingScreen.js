import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';

const AntiSpoofingScreen = () => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [callerInfo, setCallerInfo] = useState(null);

    useEffect(() => {
        const callDetector = new CallDetectorManager(
            (event, phone) => {
                if (event === 'Incoming') {
                    console.log(`📞 Incoming Call from: ${phone}`);
                    checkCallerStatus(phone);
                }
            },
            true, // Enable callback on all call states
            () => console.error('❌ Call detection failed')
        );

        return () => callDetector && callDetector.dispose();
    }, []);

    const checkCallerStatus = async (phone) => {
        try {
            const response = await axios.post('http://192.168.1.108:3000/api/calls/check', { phone: phone });
            const status = response.data.status;

            setCallerInfo({ phone: phone, status });

            Alert.alert(
                'Incoming Call',
                `📞 ${phone} - ${status.toUpperCase()}`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('❌ Error fetching caller status:', error);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Anti-Spoofing System</Text>
            {callerInfo && (
                <Text style={[styles.status, getStatusStyle(callerInfo.status)]}>
                    {callerInfo.phone} - {callerInfo.status.toUpperCase()}
                </Text>
            )}
        </View>
    );
};


const getStatusStyle = (status) => {
    switch (status) {
        case 'white': return { color: 'green' };
        case 'black': return { color: 'red' };
        default: return { color: 'gray' };
    }
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    status: { fontSize: 18, marginTop: 10, fontWeight: 'bold' }
});

export default AntiSpoofingScreen;
