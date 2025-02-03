import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';

const CallBlockScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [blockedNumbers, setBlockedNumbers] = useState([]);

    const handleBlockNumber = async () => {
        // Reset error and success messages
        setError('');
        setSuccess('');

        // Input validation
        if (!phoneNumber) {
            setError('Phone number is required.');
            return;
        }

        setLoading(true);
        try {
            // Simulate an API call to block the number
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

            // Add the blocked number to the list
            setBlockedNumbers((prev) => [...prev, phoneNumber]);
            setSuccess('Number blocked successfully!');
            setPhoneNumber(''); // Clear input after successful block
        } catch (err) {
            setError('Failed to block the number. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const clearBlockedNumbers = () => {
        setBlockedNumbers([]);
        setSuccess('Blocked numbers cleared successfully!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Call Block Feature</Text>
            <Text style={styles.description}>
                Instantly block nuisance callers and manage your call preferences effectively.
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Phone Number to Block"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>{success}</Text> : null}
            <Button title="Block Number" onPress={handleBlockNumber} />
            {loading && <ActivityIndicator size="small" color="#0000ff" />}
            <FlatList
                data={blockedNumbers}
                keyExtractor={(item) => item}
                renderItem={({ item }) => <Text style={styles.blockedNumber}>{item}</Text>}
                style={styles.list}
                ListHeaderComponent={<Text style={styles.listHeader}>Blocked Numbers:</Text>}
                ListEmptyComponent={<Text style={styles.emptyList}>No blocked numbers.</Text>}
            />
            <Button title="Clear Blocked Numbers" onPress={clearBlockedNumbers} />
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
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        width: '100%',
    },
    error: {
        color: 'red',
        marginBottom: 12,
    },
    success: {
        color: 'green',
        marginBottom: 12,
    },
    list: {
        marginTop: 20,
        width: '100%',
    },
    listHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    blockedNumber: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    emptyList: {
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
});

export default CallBlockScreen;
``