import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, Text, Animated, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image 
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location'; // Import expo-location
import Svg, { Rect } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { saveTranslation } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get device screen width
const { width } = Dimensions.get('window');

// Configure notification settings
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen() {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('es');
  const [state, setState] = useState('');
  const [dailySentence, setDailySentence] = useState('');

  // Animation states
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync();
    fetchUserLocation();

    // Smoothly fade and scale in the logo
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => setIsAnimationComplete(true)); // Show UI after animation
  }, []);

  // Function to request push notification permissions
  const registerForPushNotificationsAsync = useCallback(async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('No notification permissions!');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('FCM Token:', token);
  }, []);

  // Function to fetch user location and determine state-level location
  const fetchUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync(location.coords);
  
      if (address.length > 0) {
        const userState = address[0].region; // Fetch state-level location
        console.log("Detected State:", userState); // Debugging log
        setState(userState);
        fetchDailySentence(userState);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };
  ;

  // Function to fetch daily sentence based on the user's state
  const fetchDailySentence = (state) => {
    console.log("Fetching sentence for state:", state); // Debug log
  
    const stateLanguageMap = {
      'Andhra Pradesh': 'te',
      'Telangana': 'te',
      'Karnataka': 'kn',
      'Tamil Nadu': 'ta',
      'Tamilnadu': 'ta', // ✅ Added variation to fix issue
      'TN': 'ta', // ✅ Added variation
      'Kerala': 'ml',
      'Maharashtra': 'mr',
      'West Bengal': 'bn',
      'Uttar Pradesh': 'hi',
      'Madhya Pradesh': 'hi',
      'Gujarat': 'gu',
      'Punjab': 'pa',
      'Odisha': 'or',
      'Rajasthan': 'hi',
      'Bihar': 'hi',
      'Assam': 'as',
    };
  
    const sentences = {
      'te': 'శుభోదయం! మీరు ఎలా ఉన్నారు?',
      'kn': 'ಶುಭೋದಯ! ನೀವು ಹೇಗಿದ್ದೀರಾ?',
      'ta': 'காலை வணக்கம்! நீங்கள் எப்படி இருக்கிறீர்கள்?', // ✅ Tamil Sentence
      'ml': 'സുപ്രഭാതം! നിങ്ങൾക്ക് സുഖമാണോ?',
      'mr': 'शुभ सकाळ! तुम्ही कसे आहात?',
      'bn': 'সুপ্রভাত! তুমি কেমন আছো?',
      'hi': 'सुप्रभात! आप कैसे हैं?',
      'gu': 'સુપ્રભાત! તમે કેમ છો?',
      'pa': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?',
      'or': 'ସୁପ୍ରଭାତ! ତୁମେ କେମିତି ଅଛ?',
      'as': 'সুপ্ৰভাত! আপুনি কেনেকুৱা আছেন?',
    };
  
    const userLanguage = stateLanguageMap[state] || 'en';
    console.log("Detected Language Code:", userLanguage); // Debug log
    setDailySentence(sentences[userLanguage] || 'Good morning! How are you?');
  };
  ;

  const handleTranslate = async () => {
    if (!text.trim()) {
      alert("Please enter a word to translate.");
      return;
    }

    const apiKey = "YOUR_API_KEY"; // Replace with actual API key
    const endpoint = "https://api.cognitive.microsofttranslator.com/translate";
    const location = "centralindia"; // Example: "eastus"

    try {
      const response = await axios.post(
        `${endpoint}?api-version=3.0&from=${fromLang}&to=${toLang}&includeTransliteration=true`,
        [{ Text: text }],
        {
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
            "Ocp-Apim-Subscription-Region": location,
            "Content-Type": "application/json"
          }
        }
      );

      const translations = response.data[0].translations[0];
      const transliterationText = translations?.transliteration?.text || translations.text;

      setTranslatedText(`Translated: ${transliterationText} (${toLang})`);
      triggerNotification();

    } catch (error) {
      console.error("Translation Error:", error.response?.data || error);
      alert("Translation failed. Please check your API key.");
    }
  };

   // Animated value for rotation
   const rotationAnim = useRef(new Animated.Value(0)).current;
  
   const swapLanguages = () => {
     Animated.timing(rotationAnim, {
       toValue: 1,
       duration: 300, 
       useNativeDriver: true,
     }).start(() => {
       setFromLang((prevFromLang) => {
         setToLang(prevToLang => prevFromLang); // Swap toLang with previous fromLang
         return prevToLang; // Swap fromLang with previous toLang
       });
       rotationAnim.setValue(0); // Reset animation
     });
   };
   
   
   
 
   // Interpolating rotation animation
   const rotateInterpolation = rotationAnim.interpolate({
     inputRange: [0, 1],
     outputRange: ['0deg', '180deg'],
   });

  const handleDownload = async () => {
    if (!text.trim() || !translatedText) {
        alert("Translate a word first before downloading.");
        return;
    }

    await saveTranslation(fromLang, toLang, text, translatedText);
    alert("Translation saved successfully!");
  };

  const triggerNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Translation Complete!',
        body: `Your text has been translated to ${toLang}`,
      },
      trigger: null,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Language Translator</Text>

      {/* SVG Rectangle for Daily Sentence */}
      <Svg width={width} height="100">
        <Rect x="0" y="0" width={width} height="80" stroke="blue" strokeWidth="3" fill="white" />
        <Text style={styles.dailySentence}>{dailySentence}</Text>
      </Svg>

      <TextInput 
        style={styles.input} 
        placeholder="Enter word..." 
        placeholderTextColor="#aaa"
        value={text} 
        onChangeText={setText} 
      />
        <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setFromLang(value)}
          items={[
            { label: 'Telugu', value: 'Te' },
            { label: 'Hindi', value: 'Hi' },
            { label: 'Tamil', value: 'Ta' },
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' }
          ]}
          placeholder={{ label: 'From Language', value: null }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
 {/* Animated Swap Button */}
 <TouchableOpacity onPress={swapLanguages} style={styles.swapButton}>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
          <MaterialIcons name="swap-horiz" size={30} color="black" />
        </Animated.View>
      </TouchableOpacity>
        <RNPickerSelect
          onValueChange={(value) => setToLang(value)}
          items={[
            { label: 'Telugu', value: 'Te' },
            { label: 'Hindi', value: 'Hi' },
            { label: 'Tamil', value: 'Ta' },
            { label: 'English', value: 'eng' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' }
          ]}
          placeholder={{ label: 'To Language', value: null }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      <View style={styles.outputBox}>
        <Text style={styles.outputText}>{translatedText}</Text>
      </View>

      <TouchableOpacity style={styles.translateButton} onPress={handleTranslate}>
        <Text style={styles.buttonText}>Translate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Text style={styles.buttonText}>Download</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E6E6FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120, 
    height: 120, 
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#6A5ACD',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#6A5ACD',
    color: '#000',
    width: '90%',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
  },
  outputBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#8A2BE2',
    width: '90%',
  },
  outputText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  translateButton: {
    backgroundColor: '#6A5ACD',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
  },
  authButton: {
    backgroundColor: '#8A2BE2',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  swapButton: {
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  downloadButton: {
    backgroundColor: '#32CD32',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '90%',
  }
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6A5ACD',
    color: 'black',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6A5ACD',  
    color: 'black',
    paddingRight: 30, 
  },
};
