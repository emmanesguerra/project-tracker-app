import EditProjectModal from '@/src/components/modal/EditProjectModal';
import { updateProject as saveProjectChanges } from '@/src/database/project';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
            await fetchProject();
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

                <View style={{ position: 'absolute', right: 8, top: 8 }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#79b3f1ff',
                            paddingVertical: 3,
                            paddingHorizontal: 3,
                            borderRadius: 2,
                        }}
                        onPress={() => setModalVisible(true)}
                    >

                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}><Feather name="edit" size={16} color="#FFF" /></Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Description: {project.description}</Text>
                <Text style={styles.label}>Budget: ₱{project.budget}</Text>
                <Text style={styles.label}>Created At: {project.created_at}</Text>
                <Text style={styles.label}>Updated At: {project.updated_at}</Text>
            </View>

            <EditProjectModal
                visible={modalVisible}
                description={description}
                setDescription={setDescription}
                budget={budget}
                setBudget={setBudget}
                onCancel={() => setModalVisible(false)}
                onSave={handleSave}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: '#e0f0ff',
        padding: 12,
        borderRadius: 5,
        position: 'relative',
        marginTop: 10,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
    },
});
