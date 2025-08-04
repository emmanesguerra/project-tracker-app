import React from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';

interface CategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    categoryName: string;
    setCategoryName: (name: string) => void;
}

export default function CategoryModal({
    visible,
    onClose,
    onSave,
    categoryName,
    setCategoryName,
}: CategoryModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.backdrop}>
                <View style={styles.container}>
                    <Text style={styles.title}>New Category</Text>
                    <TextInput
                        placeholder="Category name"
                        value={categoryName}
                        onChangeText={setCategoryName}
                        style={styles.input}
                    />
                    <View style={styles.actions}>
                        <Button title="Cancel" color="gray" onPress={onClose} />
                        <Button title="Save" onPress={onSave} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 12,
        borderRadius: 6,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
});
