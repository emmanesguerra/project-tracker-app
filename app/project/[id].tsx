import EditProjectModal from '@/src/components/modal/EditProjectModal';
import { getProjectById, updateProject as saveProjectChanges } from '@/src/database/project';
import { useReceipts } from '@/src/database/receipts';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProjectPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const db = useSQLiteContext();
    const [project, setProject] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const { receipts, refreshReceipts } = useReceipts(project?.id);
    const [receiptImages, setReceiptImages] = useState<Record<number, string[]>>({});

    const fetchProject = async () => {
        try {
            const result = await getProjectById(db, Number(id));
            if (result) {
                setProject(result);
                setDescription(result.description || '');
                setBudget(result.budget?.toString() || '');
            }
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

    const fetchImagesForReceipts = async () => {
        if (!receipts || receipts.length === 0) return;
        const imagesMap: Record<number, string[]> = {};

        for (const receipt of receipts) {
            try {
                const images = await db.getAllAsync<{ image_name: string }>(
                    `SELECT image_name FROM receipt_images WHERE receipt_id = ?`,
                    [receipt.id]
                );
                imagesMap[receipt.id] = images.map((img) => img.image_name);
            } catch (error) {
                console.error(`Error loading images for receipt ${receipt.id}:`, error);
            }
        }

        setReceiptImages(imagesMap);
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    useEffect(() => {
        if (receipts.length > 0) {
            fetchImagesForReceipts();
        }
    }, [receipts]);

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
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                            <Feather name="edit" size={16} color="#FFF" />
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Description: {project.description}</Text>
                <Text style={styles.label}>Budget: ₱{project.budget}</Text>
                <Text style={styles.label}>Created At: {project.created_at}</Text>
                <Text style={styles.label}>Updated At: {project.updated_at}</Text>
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                }}
            >
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 20 }}>
                    Receipts
                </Text>

                <TouchableOpacity
                    style={{
                        backgroundColor: '#007bff',
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderRadius: 6,
                    }}
                    onPress={() =>
                        router.push(
                            `/receipts/new?projectId=${project.id}&projectName=${encodeURIComponent(
                                project.name
                            )}`
                        )
                    }
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                        + Add receipt
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={receipts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.receiptCard}>
                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                        <Text>₱{item.amount.toFixed(2)}</Text>
                        <Text>{item.category_name}</Text>
                        <Text style={{ fontSize: 12, color: 'gray' }}>
                            Issued At: {item.issued_at}
                        </Text>

                        {receiptImages[item.id]?.length > 0 && (
                            <ScrollView horizontal style={{ marginTop: 8 }}>
                                {receiptImages[item.id].map((uri, index) => (
                                    <Image
                                        key={index}
                                        source={{ uri }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                ))}
                            </ScrollView>
                        )}
                        <TouchableOpacity
                            style={styles.viewGalleryButton}
                            onPress={() =>
                                router.push({
                                    pathname: '/gallery',
                                    params: {
                                        projectId: project.id,
                                        receiptId: item.id,
                                    },
                                })
                            }
                        >
                            <Text style={styles.viewGalleryText}>📷 View Gallery</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={{ color: 'gray', fontStyle: 'italic' }}>
                        No receipts found for this project.
                    </Text>
                }
            />

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
    receiptCard: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 8,
    },
    viewGalleryButton: {
        marginTop: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#4682B4',
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    viewGalleryText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
