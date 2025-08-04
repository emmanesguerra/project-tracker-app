import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GalleryPage = () => {
    const { projectId, receiptId } = useLocalSearchParams();
    const [imageUris, setImageUris] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const loadImages = async () => {
            try {
                const folderPath = `${FileSystem.documentDirectory}${projectId}/${receiptId}/`;
                const files = await FileSystem.readDirectoryAsync(folderPath);

                const imagePaths = files
                    .filter(file => file.endsWith('.jpg') || file.endsWith('.png'))
                    .map(file => folderPath + file);

                setImageUris(imagePaths);
            } catch (error) {
                console.error('Failed to load images:', error);
            }
        };

        loadImages();
    }, [projectId, receiptId]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {imageUris.map((uri, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedImage(uri)}>
                    <Image source={{ uri }} style={styles.image} />
                </TouchableOpacity>
            ))}

            <Modal visible={!!selectedImage} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.closeButton}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                    {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullImage} />}
                </View>
            </Modal>
        </ScrollView>
    );
};

export default GalleryPage;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
        borderRadius: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#000000cc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '90%',
        height: '70%',
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 30,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    closeText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
