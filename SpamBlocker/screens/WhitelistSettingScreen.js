import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, FlatList, ActivityIndicator } from 'react-native';

const Whitelist = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [whitelistedNumbers, setWhitelistedNumbers] = useState([]);

    const handleAddToWhitelist = async () => {
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
            // Simulate an API call to add the number to the whitelist
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

            // Add the number to the whitelist
            setWhitelistedNumbers((prev) => [...prev, phoneNumber]);
            setSuccess('Number added to whitelist successfully!');
            setPhoneNumber(''); // Clear input after successful addition
        } catch (err) {
            setError('Failed to add number to whitelist. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const clearWhitelist = () => {
        setWhitelistedNumbers([]);
        setSuccess('Whitelist cleared successfully!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Whitelist</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>{success}</Text> : null}
            <Button title="Add to Whitelist" onPress={handleAddToWhitelist} />
            {loading && <ActivityIndicator size="small" color="#0000ff" />}
            <FlatList
                data={whitelistedNumbers}
                keyExtractor={(item) => item}
                renderItem={({ item }) => <Text style={styles.whitelistedNumber}>{item}</Text>}
                style={styles.list}
                ListHeaderComponent={<Text style={styles.listHeader}>Whitelisted Numbers:</Text>}
                ListEmptyComponent={<Text style={styles.emptyList}>No numbers in whitelist.</Text>}
            />
            <Button title="Clear Whitelist" onPress={clearWhitelist} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
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
    },
    listHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    whitelistedNumber: {
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

export default Whitelist;