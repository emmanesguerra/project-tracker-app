import * as ImagePicker from 'expo-image-picker';
import { Alert, Button, Image, ScrollView, StyleSheet, View } from 'react-native';

type Props = {
    imageUris: string[];
    onImageChange: (uris: string[]) => void;
};

export default function ImageCaptureContainer({ imageUris, onImageChange }: Props) {
    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera access is required.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });

        if (!result.canceled) {
            onImageChange([...imageUris, result.assets[0].uri]);
        }
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });

        if (!result.canceled) {
            onImageChange([...imageUris, result.assets[0].uri]);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal style={styles.imageRow}>
                {imageUris.map((uri, index) => (
                    <Image key={index} source={{ uri }} style={styles.preview} />
                ))}
            </ScrollView>
            <View style={styles.buttonRow}>
                <Button title="Take Photo" onPress={handleTakePhoto} />
                <Button title="Pick from Gallery" onPress={handlePickImage} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    imageRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    preview: {
        width: 100,
        height: 100,
        borderRadius: 6,
        marginRight: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
});
