import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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
        setTranslations(updatedTranslations); // Update list after deletion
        setTotalWords(updatedTranslations.length); // Update total words count
    };

    useEffect(() => {
        loadTranslations();
    }, []);

    return (
        <View style={styles.container}>
            {/* Display total words count */}
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
                        
                        {/* Delete Button */}
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
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
    buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});
