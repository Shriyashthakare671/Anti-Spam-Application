import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';

const SpamDetectionScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState('');
    const [spamNumbers, setSpamNumbers] = useState(['123-456-7890', '987-654-3210']); // Example spam numbers

    const handleCheckSpam = async () => {
        // Reset error and result messages
        setError('');
        setResult('');

        // Input validation
        if (!phoneNumber) {
            setError('Phone number is required.');
            return;
        }

        setLoading(true);
        try {
            // Simulate an API call to check if the number is spam
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

            // Check if the number is in the spam list
            if (spamNumbers.includes(phoneNumber)) {
                setResult('This number is identified as spam.');
            } else {
                setResult('This number is not spam.');
            }
        } catch (err) {
            setError('Failed to check the number. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const clearSpamNumbers = () => {
        setSpamNumbers([]);
        setResult('Spam numbers cleared successfully!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Spam Detection</Text>
            <Text style={styles.description}>
                Filter out spam and unwanted calls to ensure a seamless communication experience.
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Phone Number to Check"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {result ? <Text style={styles.result}>{result}</Text> : null}
            <Button title="Check Spam" onPress={handleCheckSpam} />
            {loading && <ActivityIndicator size="small" color="#0000ff" />}
            <FlatList
                data={spamNumbers}
                keyExtractor={(item) => item}
                renderItem={({ item }) => <Text style={styles.spamNumber}>{item}</Text>}
                style={styles.list}
                ListHeaderComponent={<Text style={styles.listHeader}>Known Spam Numbers:</Text>}
                ListEmptyComponent={<Text style={styles.emptyList}>No known spam numbers.</Text>}
            />
            <Button title="Clear Spam Numbers" onPress={clearSpamNumbers} />
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
    result: {
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
    spamNumber: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    emptyList: {
        textAlign: ' center',
        marginTop: 20,
        fontStyle: 'italic',
    },
});

export default SpamDetectionScreen;