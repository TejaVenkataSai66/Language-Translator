import AsyncStorage from '@react-native-async-storage/async-storage';

// Save a new translation with a unique ID
export const saveTranslation = async (fromLang, toLang, original, translated) => {
    try {
        const newTranslation = {
            id: Date.now().toString(), // Unique ID using timestamp
            fromLang,
            toLang,
            original,
            translated
        };

        // Get existing translations
        const existingTranslations = await AsyncStorage.getItem('translations');
        const translationsArray = existingTranslations ? JSON.parse(existingTranslations) : [];

        // Add new translation
        translationsArray.push(newTranslation);

        // Save back to AsyncStorage
        await AsyncStorage.setItem('translations', JSON.stringify(translationsArray));

        console.log("Translation saved successfully!");
    } catch (error) {
        console.error("Error saving translation:", error);
    }
};

// Get all saved translations
export const getTranslations = async () => {
    try {
        const data = await AsyncStorage.getItem('translations');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error fetching translations:", error);
        return [];
    }
};

// Delete a translation by ID
export const deleteTranslation = async (id) => {
    try {
        const savedData = await AsyncStorage.getItem('translations');
        let translations = savedData ? JSON.parse(savedData) : [];

        // Remove the translation with the matching ID
        translations = translations.filter(item => item.id !== id);

        // Save updated translations list
        await AsyncStorage.setItem('translations', JSON.stringify(translations));

        console.log("Translation deleted successfully!");
        return translations; // Return updated list for immediate UI update
    } catch (error) {
        console.error("Error deleting translation:", error);
        return [];
    }
};
