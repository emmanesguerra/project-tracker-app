import { addReceipt } from '@/src/database/receipts';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, Button, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewReceiptPage() {
    const { projectId, projectName } = useLocalSearchParams();
    const db = useSQLiteContext();
    const router = useRouter();

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [issuedAt, setIssuedAt] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSave = async () => {
        if (!name || !amount || isNaN(Number(amount))) {
            Alert.alert('Validation Error', 'Please enter valid name and amount.');
            return;
        }

        try {
            await addReceipt(
                db,
                Number(projectId),
                null, // categoryId is optional/null for now
                name,
                parseFloat(amount),
                issuedAt.toISOString().slice(0, 10)
            );
            Alert.alert('Success', 'Receipt added');
            router.back();
        } catch (err) {
            console.error('Failed to save receipt', err);
            Alert.alert('Error', 'Could not save receipt.');
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setIssuedAt(selectedDate);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>{projectName ? `Receipt for ${projectName}` : 'New Receipt'}</Text>

            <Text>Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter receipt name"
                style={styles.input}
            />

            <Text>Amount (₱)</Text>
            <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                keyboardType="numeric"
                style={styles.input}
            />

            <Text>Issued At</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                <Text>{issuedAt.toISOString().slice(0, 10)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={issuedAt}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                />
            )}

            <Button title="Save Receipt" onPress={handleSave} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 12,
        borderRadius: 6,
    },
});
