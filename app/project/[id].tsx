import { updateProject as saveProjectChanges } from '@/src/database/project'; // ✅ Fix import name
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Button, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProjectPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const db = useSQLiteContext();
    const [project, setProject] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');

    const fetchProject = async () => {
        try {
            const result = await db.getFirstAsync('SELECT * FROM projects WHERE id = ?', [id]);
            setProject(result);
            setDescription(result?.description || '');
            setBudget(result?.budget?.toString() || '');
        } catch (error) {
            console.error('Error loading project:', error);
        }
    };

    const handleSave = async () => {
        try {
            await saveProjectChanges(db, project.id, description, parseFloat(budget));
            await fetchProject(); // refresh the data
            setModalVisible(false);
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    if (!project) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading project...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{project.name}</Text>

            <View style={styles.box}>
                <Pressable
                    onPress={() => setModalVisible(true)}
                    hitSlop={10}
                    style={{ position: 'absolute', top: 8, right: 8 }}
                >
                    <Feather name="edit" size={24} color="#333" />
                </Pressable>
                <Text style={styles.label}>Description: {project.description}</Text>
                <Text style={styles.label}>Budget: ₱{project.budget}</Text>
                <Text style={styles.label}>Created At: {project.created_at}</Text>
                <Text style={styles.label}>Updated At: {project.updated_at}</Text>
            </View>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Edit Project</Text>

                        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Description</Text>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 8,
                                padding: 8,
                                minHeight: 80,
                                textAlignVertical: 'top',
                                marginBottom: 16,
                            }}
                            placeholder="Enter project description"
                        />

                        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Budget</Text>
                        <TextInput
                            placeholder="Budget"
                            value={budget}
                            onChangeText={setBudget}
                            keyboardType="numeric"
                            style={styles.input}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                            <Button title="Save" onPress={handleSave} />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: '#e0f0ff',
        padding: 12,
        borderRadius: 12,
        position: 'relative',
        marginTop: 10,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
    },
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
        borderRadius: 6,
    },
});
