import { useCategories } from '@/src/database/categories';
import { addReceipt } from '@/src/database/receipts';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, Button, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewReceiptPage() {
    const { projectId, projectName } = useLocalSearchParams();
    const db = useSQLiteContext();
    const router = useRouter();

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [issuedAt, setIssuedAt] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [categoryId, setCategoryId] = useState<number | null>(null);

    const { categories } = useCategories();

    const handleSave = async () => {
        if (!name || !amount || isNaN(Number(amount))) {
            Alert.alert('Validation Error', 'Please enter valid name and amount.');
            return;
        }

        try {
            await addReceipt(
                db,
                Number(projectId),
                categoryId,
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

    const onDateChange = (event: any, date?: Date) => {
        setShowDatePicker(false);
        if (date) {
            setIssuedAt(date);
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

            <Text>Category</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={categoryId}
                    onValueChange={(itemValue) => setCategoryId(itemValue)}
                >
                    <Picker.Item label="Select Category" value={null} />
                    {categories.map((category) => (
                        <Picker.Item key={category.id} label={category.name} value={category.id} />
                    ))}
                </Picker>
            </View>

            <View style={styles.row}>
                <View style={styles.halfInputContainer}>
                    <Text>Amount (₱)</Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter amount"
                        keyboardType="numeric"
                        style={styles.input}
                    />
                </View>

                <View style={styles.halfInputContainer}>
                    <Text>Issued At</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                        <Text>{issuedAt.toISOString().slice(0, 10)}</Text>
                    </TouchableOpacity>
                </View>
            </View>

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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    halfInputContainer: {
        flex: 1,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginBottom: 12,
        overflow: 'hidden',
    },
});
