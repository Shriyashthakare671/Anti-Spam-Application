import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const StatusPopup = ({ visible, phone, status, onClose }) => {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={[styles.popup, getStatusStyle(status)]}>
                    <Text style={styles.text}>📞 {phone}</Text>
                    {/* <Text style={styles.status}>{status.toUpperCase()}</Text> */}
                    <Button title="OK" onPress={onClose} color="Black" />
                </View>
            </View>
        </Modal>
    );
};

// ✅ Function to style pop-up box color based on status
const getStatusStyle = (status) => {
    switch (status) {
        case 'white': return { backgroundColor: 'green' };
        case 'black': return { backgroundColor: 'red' };
        default: return { backgroundColor: 'yellow' };
    }
};

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    popup: { width: 300, padding: 20, borderRadius: 10, alignItems: 'center' },
    text: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    status: { fontSize: 16, fontWeight: 'bold', color: 'white', marginVertical: 10 }
});

export default StatusPopup;
