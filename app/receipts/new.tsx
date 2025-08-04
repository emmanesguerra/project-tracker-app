import CategoryModal from '@/src/components/modal/CategoryModal';
import { addCategory, useCategories } from '@/src/database/categories';
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

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const { categories, refreshCategories } = useCategories();

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

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            Alert.alert('Validation Error', 'Category name cannot be empty.');
            return;
        }

        try {
            await addCategory(db, newCategoryName.trim());
            setNewCategoryName('');
            setShowCategoryModal(false);
            await refreshCategories();
        } catch (error) {
            Alert.alert('Error', 'Failed to add category.');
        }
    };

    const onDateChange = (_: any, date?: Date) => {
        setShowDatePicker(false);
        if (date) {
            setIssuedAt(date);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>{projectName ? `Receipt for ${projectName}` : 'New Receipt'}</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter receipt name"
                style={styles.input}
            />

            <View style={styles.categoryHeader}>
                <Text style={styles.label}>Category</Text>
                <TouchableOpacity onPress={() => setShowCategoryModal(true)}>
                    <Text style={styles.addCategory}>+ Add New Category</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.pickerWrapper}>
                <Picker selectedValue={categoryId} onValueChange={(itemValue) => setCategoryId(itemValue)}>
                    <Picker.Item label="Select Category" value={null} />
                    {categories.map((category) => (
                        <Picker.Item key={category.id} label={category.name} value={category.id} />
                    ))}
                </Picker>
            </View>

            <View style={styles.row}>
                <View style={styles.halfInputContainer}>
                    <Text style={styles.label}>Amount (₱)</Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter amount"
                        keyboardType="numeric"
                        style={styles.input}
                    />
                </View>

                <View style={styles.halfInputContainer}>
                    <Text style={styles.label}>Issued At</Text>
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

            <CategoryModal
                visible={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                onSave={handleAddCategory}
                categoryName={newCategoryName}
                setCategoryName={setNewCategoryName}
            />
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
        marginBottom: 8,
        overflow: 'hidden',
    },
    addButton: {
        marginBottom: 12,
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 4,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    addCategory: {
        fontSize: 12,
        color: '#007bff',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
});
