import { styles } from '@/src/styles/global';
import { FC } from 'react';
import { Button, Modal, Text, TextInput, View } from 'react-native';

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
                    <Text style={styles.pageTitle}>Edit Project</Text>

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
                        <Button title="Cancel" color="gray" onPress={onCancel} />
                        <Button title="Save" onPress={onSave} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default EditProjectModal;

