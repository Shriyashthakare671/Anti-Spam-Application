import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Image, FlatList } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000, // Animation duration in milliseconds
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    }, [fadeAnim]);

    // Data for the FlatList
    const cardsData = [
        {
            id: '1',
            title: 'Anti-Spoofing System',
            description: 'Identify Real Callers Effectively',
            navigateTo: 'AntiSpoofing',
            buttonText: 'Get Started',
        },
        {
            id: '2',
            title: 'Spam Detection',
            description: 'Filter Unwanted Calls Seamlessly',
            navigateTo: 'SpamDetection',
            buttonText: 'Activate Now',
        },
        {
            id: '3',
            title: 'Call Block Feature',
            description: 'Block Nuisance Callers Instantly',
            navigateTo: 'CallBlock',
            buttonText: 'Block Now',
        },
        {
            id: '4',
            title: 'Whitelist Setting',
            description: 'Manage allowed callers to ensure important calls always get through.',
            navigateTo: 'WhitelistSetting',
            buttonText: 'Manage Now',
        },
    ];

    const renderCard = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate(item.navigateTo)} // Navigate to the specified screen
            >
                <Text style={styles.buttonText}>{item.buttonText}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.mainContainer}>

            {/* Animated Title */}
            <Animated.Text style={[styles.titleText, { opacity: fadeAnim }]}>
                SPAM BLOCKER
            </Animated.Text>

            {/* FlatList for Cards */}
            <FlatList
                data={cardsData}
                renderItem={renderCard}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.container} // Add padding to the FlatList
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: 20,
    },
    container: {
        padding: 10,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: '#6B6B6B',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#00796B',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        backgroundColor: '#D32F2F',
        padding: 10,
        borderRadius: 5,
    },
    logoutLogo: {
        width: 24 , 
        height: 24,
    },
    titleText: {
        marginTop: 1,
        color: '#ff0000',
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
    },
});

export default HomeScreen;