import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import { getTranslations, deleteTranslation } from '../utils/storage'; // Import storage functions

export default function DownloadsScreen() {
    const [translations, setTranslations] = useState([]);
    const [totalWords, setTotalWords] = useState(0);

    // Load translations when component mounts
    const loadTranslations = async () => {
        const savedTranslations = await getTranslations();
        setTranslations(savedTranslations);
        setTotalWords(savedTranslations.length);
    };

    // Delete translation and update UI
    const handleDelete = async (id) => {
        const updatedTranslations = await deleteTranslation(id);
        setTranslations(updatedTranslations);
        setTotalWords(updatedTranslations.length);
    };

    // Write translations to SD card
    const saveToSDCard = async () => {
        if (translations.length === 0) {
            Alert.alert('No Data', 'There are no translations to save.');
            return;
        }
    
        // Request permission to write to external storage
        const { status } = await FileSystem.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'You need to grant storage permission.');
            return;
        }
    
        // Define SD card path (change according to device)
        const fileUri = FileSystem.externalStorageDirectory + 'Download/translations.txt';
    
        const fileContent = translations
            .map(item => `${item.fromLang} → ${item.toLang}\n${item.original} → ${item.translated}`)
            .join('\n\n');
    
        try {
            await FileSystem.writeAsStringAsync(fileUri, fileContent);
            showNotification('Saved!', 'Translations saved to SD card.');
        } catch (error) {
            Alert.alert('Error', 'Failed to save file: ' + error.message);
        }
    };
    

    // Show notification
    const showNotification = async (title, body) => {
        await Notifications.scheduleNotificationAsync({
            content: { title, body, sound: 'default' },
            trigger: null,
        });
    };

    useEffect(() => {
        loadTranslations();
        Notifications.requestPermissionsAsync(); // Request notification permissions
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.totalWords}>Total Words: {totalWords}</Text>
            <Text style={styles.title}>Saved Translations</Text>

            <FlatList
                data={translations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.lang}>{item.fromLang} → {item.toLang}</Text>
                        <Text style={styles.original}>{item.original}</Text>
                        <Text style={styles.translated}>{item.translated}</Text>

                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Button to Save to SD Card */}
            <TouchableOpacity style={styles.saveButton} onPress={saveToSDCard}>
                <Text style={styles.buttonText}>Save to SD Card</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#E6E6FA' },
    totalWords: { fontSize: 20, fontWeight: 'bold', color: 'black', textAlign: 'center', marginBottom: 10 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    item: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: '#8A2BE2' },
    lang: { fontSize: 16, fontWeight: 'bold' },
    original: { fontSize: 14, color: 'black' },
    translated: { fontSize: 14, color: 'green' },
    deleteButton: { backgroundColor: 'red', padding: 8, marginTop: 10, borderRadius: 5, alignItems: 'center' },
    saveButton: { backgroundColor: 'blue', padding: 12, marginTop: 20, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});
