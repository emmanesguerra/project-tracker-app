import { addReceipt } from '@/src/database/receipts';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewReceiptPage() {
    const { projectId, projectName } = useLocalSearchParams();
    const db = useSQLiteContext();
    const router = useRouter();

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [issuedAt, setIssuedAt] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD

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
                issuedAt
            );
            Alert.alert('Success', 'Receipt added');
            router.back();
        } catch (err) {
            console.error('Failed to save receipt', err);
            Alert.alert('Error', 'Could not save receipt.');
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

            <Text>Issued At (YYYY-MM-DD)</Text>
            <TextInput
                value={issuedAt}
                onChangeText={setIssuedAt}
                placeholder="e.g. 2025-08-03"
                style={styles.input}
            />

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
