import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function AuthScreen() {
    const [isSignup, setIsSignup] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.main}>
            {/* Checkbox to switch between Login & Sign-Up */}
            <TouchableOpacity style={styles.toggleContainer} onPress={() => setIsSignup(!isSignup)}>
                <Text style={styles.toggleText}>{isSignup ? 'Switch to Login' : 'Switch to Sign Up'}</Text>
            </TouchableOpacity>

            {/* Sign-Up Form */}
            {isSignup && (
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Sign Up</Text>
                    <TextInput style={styles.input} placeholder="User name" value={username} onChangeText={setUsername} />
                    <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
                    <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
                    <TextInput style={styles.input} placeholder="OTP" secureTextEntry value={password} onChangeText={setPassword} />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Send OTP</Text>
                    </TouchableOpacity>
                    

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Login Form */}
            {!isSignup && (
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Login</Text>
                    <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
                    <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    toggleContainer: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#6A5ACD',
    },
    toggleText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
    },
    label: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#6A5ACD',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#6A5ACD',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
       },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});