import { FC } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';

interface EditProjectModalProps {
    visible: boolean;
    description: string;
    budget: string;
    setDescription: (text: string) => void;
    setBudget: (value: string) => void;
    onCancel: () => void;
    onSave: () => void;
}

const EditProjectModal: FC<EditProjectModalProps> = ({
    visible,
    description,
    budget,
    setDescription,
    setBudget,
    onCancel,
    onSave,
}) => {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Edit Project</Text>

                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        placeholder="Enter project description"
                        style={styles.textArea}
                    />

                    <Text style={styles.label}>Budget</Text>
                    <TextInput
                        value={budget}
                        onChangeText={setBudget}
                        placeholder="Enter budget"
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    <View style={styles.actions}>
                        <Button title="Cancel" onPress={onCancel} />
                        <Button title="Save" onPress={onSave} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default EditProjectModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        width: '90%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
        borderRadius: 6,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
});
