import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, Alert, TouchableOpacity } from 'react-native';

const SettingsScreen = ({ navigation }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [callBlockingEnabled, setCallBlockingEnabled] = useState(false);
    const [spamFilter, setSpamFilter] = useState('');
    const [message, setMessage] = useState('');
    const [isSpam, setIsSpam] = useState(false);

    const handleSaveSettings = () => {
        Alert.alert('Settings Saved', 'Your settings have been saved successfully!');
    };

    const handleResetSettings = () => {
        setNotificationsEnabled(false);
        setCallBlockingEnabled(false);
        setSpamFilter('');
        setMessage('');
        setIsSpam(false);
        Alert.alert('Settings Reset', 'Your settings have been reset to default.');
    };

    const checkForSpam = () => {
        const spamKeywords = spamFilter.split(',').map(keyword => keyword.trim());
        const isMessageSpam = spamKeywords.some(keyword => message.includes(keyword));
        setIsSpam(isMessageSpam);
        Alert.alert(isMessageSpam ? 'Spam Detected' : 'No Spam Detected', `Your message: "${message}" is ${isMessageSpam ? 'considered spam.' : 'not considered spam.'}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.settingItem}>
                <Text>Enable Notifications</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                />
            </View>

            <View style={styles.settingItem}>
                <Text>Enable Call Blocking</Text>
                <Switch
                    value={callBlockingEnabled}
                    onValueChange={setCallBlockingEnabled}
                />
            </View>

            {/* <View style={styles.settingItem}>
                <Text>Custom Spam Filter (comma-separated):</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter spam filter criteria"
                    value={spamFilter}
                    onChangeText={setSpamFilter}
                />
            </View>

            <View style={styles.settingItem}>
                <Text>Message to Check:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter message to check"
                    value={message}
                    onChangeText={setMessage}
                />
            </View> */}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSaveSettings}>
                    <Text style={styles.buttonText}>Save Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleResetSettings}>
                    <Text style={styles.buttonText}>Reset to Default</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.button} onPress={checkForSpam}>
                    <Text style={styles.buttonText}>Check for Spam</Text>
                </TouchableOpacity> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        width: '70%',
    },
    buttonContainer: {
        width: '50%',
        marginTop: 20,
        flexDirection: 'column',
        justifyContent: 'space -between',
    },
    button: {
        backgroundColor: '#007BFF', // Primary color
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 5,
        alignItems: 'center',
    },
    resetButton: {
        backgroundColor: '#FF4136', // Red color for reset
    },
    buttonText: {
        color: '#FFFFFF', // White text color
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SettingsScreen;