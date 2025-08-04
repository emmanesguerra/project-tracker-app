import { FC } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';

interface CreateProjectModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    newProjectName: string;
    setNewProjectName: (name: string) => void;
}

const CreateProjectModal: FC<CreateProjectModalProps> = ({
    visible,
    onClose,
    onSave,
    newProjectName,
    setNewProjectName,
}) => {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    justifyContent: 'center',
                    padding: 20,
                }}
            >
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        padding: 20,
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>New Project Name</Text>
                    <TextInput
                        placeholder="Enter project name"
                        value={newProjectName}
                        onChangeText={setNewProjectName}
                        style={{
                            borderColor: '#ccc',
                            borderWidth: 1,
                            padding: 8,
                            borderRadius: 6,
                            marginBottom: 12,
                        }}
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Pressable
                            onPress={onClose}
                            style={{ marginRight: 10, paddingVertical: 6, paddingHorizontal: 12 }}
                        >
                            <Text style={{ color: 'gray' }}>Cancel</Text>
                        </Pressable>

                        <Pressable
                            onPress={onSave}
                            style={{
                                backgroundColor: '#007bff',
                                paddingVertical: 6,
                                paddingHorizontal: 12,
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ color: '#fff' }}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CreateProjectModal;
